import "./App.css";
import { useEffect, useState } from "react";
import Menus from "./components/Menus";

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_APIKEY,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);

const App = () => {
  const [todayMain, setTodayMain] = useState("ぎょうざ");
  const [todaySide, setTodaySide] = useState("サラダ");
  const [todayGarnish, settodayGarnish] = useState("みそしる");
  const [isModalOpen, toggleModal] = useState(false);
  const [file, setFile] = useState(null);
  const [menus, setMenus] = useState(null);

  // firestoreからデータを取得する
  useEffect(() => {
    const menusCollectionRef = collection(db, "menus");
    getDocs(menusCollectionRef).then((querySnapshot) => {
      setMenus(querySnapshot.docs);
    });
  }, [menus]);

  // inputタグにファイルが選択された際に発火するメソッド
  const onChangeFile = (e) => {
    setFile(e.target.files[0]);
    console.log(e.target.files[0]);
  };

  const onClickSubmit = async () => {
    const storageRef = ref(storage, `images/${file.name}`);
    const menuType = document.querySelector("#menu-type").innerHTML;
    const name = document.querySelector("#menu-name").value;
    const content = document.querySelector("#menu-content").value;

    // 画像のアップロード
    await uploadBytes(storageRef, file).then((snapshot) => {
      console.log("Uploaded a file", snapshot);
    });

    // storageにある画像のパスを取得
    const gsReference = ref(
      storage,
      `${process.env.REACT_APP_ROOT_STORAGE_URL}/images/${file.name}`
    );
    let imageURL = await getDownloadURL(gsReference).then((url) => {
      return url;
    });
    console.log(imageURL);

    // dbへの保存(名前と内容と画像のパス)
    // firestoreのパスをmenusからmainmenus（他2種類）に変える
    await setDoc(doc(db, "menus", `${name}`), {
      name: name,
      description: content,
      imageURL: imageURL,
    });

    toggleModal();
  };

  const displayMenu = () => {
    setTodayMain(menus[Math.floor(Math.random() * menus.length)].data().name);
    setTodaySide(menus[Math.floor(Math.random() * menus.length)].data().name);
    settodayGarnish(
      menus[Math.floor(Math.random() * menus.length)].data().name
    );
  };

  const handleModal = () => {
    toggleModal(!isModalOpen);
  };

  useEffect(() => {
    console.log(isModalOpen);
  }, [isModalOpen]);

  return (
    <>
      <h1 className='title'>today's dinner</h1>

      <div className='top'>
        <button onClick={displayMenu}>献立を決める</button>
        <div className='wrapper'>
          <h3>今夜の晩ごはん</h3>
          <h3>メインディッシュ: {todayMain}</h3>
          <h3>副菜: {todaySide}</h3>
          <h3>付け合わせ: {todayGarnish}</h3>
        </div>
        <button onClick={handleModal}>メニューを追加する</button>
      </div>
      <div className='container'>
        {menus?.map((menu) => (
          <div key={menu.id}>
            <div className='card'>
              <img src={menu.data().imageURL}></img>
              <p>{menu.data().name}</p>
              <p>{menu.data().description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={isModalOpen ? "modalOpen" : "modalFalse"}>
        <div className='overlay'></div>
        <input id='menu-type' placeholder='メニューの種別' />
        <input id='menu-name' placeholder='メニュー名' required />
        <input id='menu-content' placeholder='内容' multiple />
        <input
          type='file'
          name='imageFile'
          accept='image/*'
          onChange={onChangeFile}
        />
        <div className='button'>
          <button onClick={onClickSubmit} value='送信'>
            送信
          </button>
        </div>
      </div>
    </>
  );
};

export default App;
