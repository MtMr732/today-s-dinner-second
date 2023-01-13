import "./App.css";
import { useState } from "react";
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

  const handlesubmit = () => {
    createMenu();
  };

  const displayMenu = () => {
    // setTodayMain(data.length[Math.floor(Math.random() * data.length)].name);
    // setTodaySide(data.length[Math.floor(Math.random() * data.length)].name);
    // settodayGarnish(data.length[Math.floor(Math.random() * data.length)].name);
  };

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
        <button value='a'>メニューを追加する</button>
        <div className='modal'>
          <form onSubmit={handlesubmit}>
            <input placeholder='メニューの種別' />
            <input placeholder='メニュー名' required />
            <input placeholder='内容' multiple />
            <input type='submit' />
          </form>
        </div>
      </div>

      <div className='container'>
        <Menus />
      </div>
    </>
  );
}

export default App;
