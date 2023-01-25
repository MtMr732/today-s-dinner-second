import React from "react";
import Menu from "./Menu";

const Menus = (props) => {
  const { menus } = props;
  return (
    <>
      {/* {menus.name} */}
      {menus?.map((menu) => {
        return <Menu menu={menu} />;
      })}
    </>
  );
};
export default Menus;
