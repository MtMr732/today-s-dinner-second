import "./App.css";
import { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import Menus from "./components/Menus";

const createMenu = gql`
  mutation ($name: String!, $description: String!) {
    createMenu(data: { name: $name, description: $description }) {
      name
      description
    }
  }
`;

function App() {
  const [todayMain, setTodayMain] = useState("ぎょうざ");
  const [todaySide, setTodaySide] = useState("サラダ");
  const [todayGarnish, settodayGarnish] = useState("みそしる");
  const [isModalOpen, toggle] = useState(false);

  const handlesubmit = () => {
    createMenu();
  };

  const displayMenu = () => {
    // setTodayMain(data.length[Math.floor(Math.random() * data.length)].name);
    // setTodaySide(data.length[Math.floor(Math.random() * data.length)].name);
    // settodayGarnish(data.length[Math.floor(Math.random() * data.length)].name);
  };

  const handleModal = () => {
    toggle(!isModalOpen);
    console.log(isModalOpen);
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
        <Menus />
      </div>

      <div className={isModalOpen ? "modalOpen" : "modalFalse"}>
        <div className='overlay'>
          <form onSubmit={handlesubmit}>
            <input placeholder='メニューの種別' />
            <input placeholder='メニュー名' required />
            <input placeholder='内容' multiple />
            <input type='submit' />
          </form>
        </div>
      </div>
    </>
  );
}

export default App;
