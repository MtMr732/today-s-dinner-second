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
  // firestoreから取得したデータを格納する変数
  const [mainMenus, setMainMenu] = useState(null);
  const [sideMenus, setSideMenus] = useState(null);
  const [garnish, setGarnish] = useState(null);
  // 画面上部の今晩のメニューに利用する変数
  const [todayMain, setTodayMain] = useState("ぎょうざ");
  const [todaySide, setTodaySide] = useState("サラダ");
  const [todayGarnish, settodayGarnish] = useState("みそしる");
  // その他
  const [isModalOpen, toggleModal] = useState(false);
  const [file, setFile] = useState(null);
  const [menutype, setMenutype] = useState("");

  const handleMenutype = (e) => {
    setMenutype(e.target.value);
  };
  useEffect(() => {
    console.log(menutype);
  }, [menutype]);

  // firestoreからデータを取得する
  useEffect(() => {
    const menusCollectionRef = collection(db, "mainMenus");
    getDocs(menusCollectionRef).then((querySnapshot) => {
      setMainMenu(querySnapshot.docs);
    });
  }, [mainMenus]);

  useEffect(() => {
    const menusCollectionRef = collection(db, "sideMenus");
    getDocs(menusCollectionRef).then((querySnapshot) => {
      setSideMenus(querySnapshot.docs);
    });
  }, [sideMenus]);

  useEffect(() => {
    const menusCollectionRef = collection(db, "garnish");
    getDocs(menusCollectionRef).then((querySnapshot) => {
      setGarnish(querySnapshot.docs);
    });
  }, [garnish]);

  // inputタグにファイルが選択された際に発火するメソッド
  const onChangeFile = (e) => {
    setFile(e.target.files[0]);
    console.log(e.target.files[0]);
  };

  const onClickSubmit = async () => {
    const storageRef = ref(storage, `images/${file.name}`);
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
    await setDoc(doc(db, `${menutype}`, `${name}`), {
      name: name,
      description: content,
      imageURL: imageURL,
    });

    toggleModal();
  };

  const displayMenu = () => {
    setTodayMain(
      mainMenus[Math.floor(Math.random() * mainMenus.length)].data().name
    );
    setTodaySide(
      sideMenus[Math.floor(Math.random() * sideMenus.length)].data().name
    );
    settodayGarnish(
      garnish[Math.floor(Math.random() * garnish.length)].data().name
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
      <div>
        <h3>メニュー一覧</h3>
      </div>
      <div className='container'>
        <div id='mainMenus'>
          <h3>主菜</h3>
          {mainMenus?.map((menu) => (
            <div key={menu.id}>
              <div className='card'>
                <img src={menu.data().imageURL}></img>
                <p>{menu.data().name}</p>
                <p>{menu.data().description}</p>
              </div>
            </div>
          ))}
        </div>
        <div id='sideMenus'>
          <h3>副菜</h3>
          {sideMenus?.map((menu) => (
            <div key={menu.id}>
              <div className='card'>
                <img src={menu.data().imageURL}></img>
                <p>{menu.data().name}</p>
                <p>{menu.data().description}</p>
              </div>
            </div>
          ))}
        </div>
        <div id='garnish'>
          <h3>付け合わせ</h3>
          {garnish?.map((menu) => (
            <div key={menu.id}>
              <div className='card'>
                <img src={menu.data().imageURL}></img>
                <p>{menu.data().name}</p>
                <p>{menu.data().description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={isModalOpen ? "modalOpen" : "modalFalse"}>
        <div className='overlay'></div>
        <input
          id='menu-type'
          placeholder='メニューの種別'
          onChange={(e) => handleMenutype(e)}
        />
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
