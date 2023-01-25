import "./App.css";
import { useEffect, useState } from "react";
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
import { useMediaQuery } from "@mui/material";
import Grid from "@mui/material/Grid";

import DecideMenu from "./components/DecideMenu";
import AddMenu from "./components/AddMenu";
import Menus from "./components/Menus";

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
  const [todayMain, setTodayMain] = useState("");
  const [todaySide, setTodaySide] = useState("");
  const [todayGarnish, settodayGarnish] = useState("");
  // その他
  const [isModalOpen, setModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [menutype, setMenutype] = useState("");
  const isMatches = useMediaQuery("(max-width:1199px)");

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

    setModalOpen(false);
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

  useEffect(() => {
    console.log(isModalOpen);
  }, [isModalOpen]);

  return (
    <>
      <h1 className='title'>today's dinner</h1>

      <div className='top'>
        <DecideMenu displayMenu={displayMenu} />
        <div className='wrapper'>
          <h3>今夜の晩ごはん</h3>
          <h3>メインディッシュ: {todayMain}</h3>
          <h3>副菜: {todaySide}</h3>
          <h3>付け合わせ: {todayGarnish}</h3>
        </div>
        <AddMenu
          isModalOpen={isModalOpen}
          setModalOpen={setModalOpen}
          menutype={menutype}
          handleMenutype={(e) => handleMenutype(e)}
          onChangeFile={onChangeFile}
          onClickSubmit={onClickSubmit}
        />
      </div>
      <div style={{ margin: 10 }}>
        <h3>メニュー表</h3>
      </div>
      <Grid container direction='row'>
        <Grid xs={isMatches ? 12 : 4}>
          <h4 style={{ margin: 10 }}>主菜</h4>
          <Menus menus={mainMenus} />
        </Grid>
        <Grid xs={isMatches ? 12 : 4}>
          <h4 style={{ margin: 10 }}>副菜</h4>
          <Menus menus={sideMenus} />
        </Grid>
        <Grid xs={isMatches ? 12 : 4}>
          <h4 style={{ margin: 10 }}>付け合わせ</h4>
          <Menus menus={garnish} />
        </Grid>
      </Grid>

      <div id='footer' style={{ height: 30 }}></div>
    </>
  );
};

export default App;
