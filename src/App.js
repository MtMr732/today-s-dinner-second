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
import { getStorage, ref, uploadBytes } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBYVxzP5thGHXYU_XnT2OnoVjs5h-bVCcI",
  authDomain: "today-s-dinner-second.firebaseapp.com",
  projectId: "today-s-dinner-second",
  storageBucket: "today-s-dinner-second.appspot.com",
  messagingSenderId: "1068876473605",
  appId: "1:1068876473605:web:424273aa4b8e845627036c",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage();

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
      // console.log(querySnapshot.docs);
      setMenus(querySnapshot.docs);
      // querySnapshot.docs.forEach((menu) => console.log(menu.data()));
    });
  }, []);

  // inputタグにファイルが選択された際に発火するメソッド
  const onChangeFile = (e) => {
    setFile(e.target.files[0]);
    console.log(e.target.files[0]);
  };

  const onClickSubmit = async () => {
    const storageRef = ref(storage, `images/${file.name}`);

    // 画像のアップロード
    await uploadBytes(storageRef, file).then((snapshot) => {
      console.log("Uploaded a file", snapshot);
    });

    // dbへの保存(名前と内容と画像のパス)
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
        <button>献立を決める</button>
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
        <input placeholder='メニューの種別' />
        <input placeholder='メニュー名' required />
        <input placeholder='内容' multiple />
        <input
          type='file'
          name='imageFile'
          accept='image/*'
          onChange={onChangeFile}
        />
        <div className='button'>
          <button onClick={onClickSubmit} value='送信' />
        </div>
      </div>
    </>
  );
};

export default App;
