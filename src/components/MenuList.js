import React from "react";
import Menu from "./Menu";

const MenuList = (props) => {
  const { menus } = props;

  return (
    <>
      {menus?.map((menu) => {
        return <Menu menu={menu} />;
      })}
    </>
  );
};
export default MenuList;
