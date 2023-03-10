import { useEffect, useMemo, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Box, Typography, useMediaQuery } from "@mui/material";
import Grid from "@mui/material/Grid";

import DecideMenu from "./components/DecideMenu";
import AddMenu from "./components/AddMenu";
import MenuList from "./components/MenuList";

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
// 本来は別ファイルに書き出す
const useFetch = (path) => {
  const [data, setData] = useState(null);
  const [randomNumber, setRandomNumber] = useState(0);
  const update = () => {
    setRandomNumber(Math.random());
  };
  useEffect(() => {
    const menusCollectionRef = collection(db, path);
    getDocs(menusCollectionRef).then((querySnapshot) => {
      setData(querySnapshot.docs);
    });
  }, [randomNumber]);

  return { data, update };
};

const App = () => {
  // firestoreから取得したデータを格納する変数
  const { data: mainMenus, update: updateMainmenu } = useFetch("mainMenus");
  const { data: sideMenus, update: updateSidemenu } = useFetch("sideMenus");
  const { data: garnish, update: updateGarnish } = useFetch("garnish");
  // 画面上部の今晩のメニューに利用する変数
  const [result, setResult] = useState({});
  const displayMenu = () => {
    const main =
      mainMenus[Math.floor(Math.random() * mainMenus.length)].data().name;
    const side =
      sideMenus[Math.floor(Math.random() * sideMenus.length)].data().name;
    const garni =
      garnish[Math.floor(Math.random() * garnish.length)].data().name;
    setResult({ main, side, garni });
    console.log(result);
  };
  // その他
  const [isModalOpen, setModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [menutype, setMenutype] = useState("");
  const isMatches = useMediaQuery("(max-width:1199px)");

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

    // データを送信後にstateを更新する処理をここで追加し、再レンダリングしている
    updateMainmenu();
    updateSidemenu();
    updateGarnish();

    setModalOpen(false);
  };

  const handleMenutype = (e) => {
    setMenutype(e.target.value);
  };

  return (
    <>
      <Typography
        variant='h4'
        sx={{ backgroundColor: "#dcc2ff", color: "#ffffff" }}
      >
        today's dinner
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <DecideMenu displayMenu={displayMenu} />
        <Box sx={{ flexDirection: "column" }}>
          <h3>今夜の晩ごはん</h3>
          <h3>メインディッシュ: {result.main}</h3>
          <h3>副菜: {result.side}</h3>
          <h3>付け合わせ: {result.garni}</h3>
        </Box>
        <AddMenu
          isModalOpen={isModalOpen}
          setModalOpen={setModalOpen}
          menutype={menutype}
          handleMenutype={(e) => handleMenutype(e)}
          onChangeFile={onChangeFile}
          onClickSubmit={onClickSubmit}
        />
      </Box>
      <Box style={{ margin: 10 }}>
        <h3>メニュー表</h3>
      </Box>
      <Grid container direction='row'>
        <Grid item xs={isMatches ? 12 : 4}>
          <h4 style={{ margin: 10 }}>主菜</h4>
          <MenuList menus={mainMenus} />
        </Grid>
        <Grid item xs={isMatches ? 12 : 4}>
          <h4 style={{ margin: 10 }}>副菜</h4>
          <MenuList menus={sideMenus} />
        </Grid>
        <Grid item xs={isMatches ? 12 : 4}>
          <h4 style={{ margin: 10 }}>付け合わせ</h4>
          <MenuList menus={garnish} />
        </Grid>
      </Grid>

      <Box id='footer' style={{ height: 30 }}></Box>
    </>
  );
};

export default App;
