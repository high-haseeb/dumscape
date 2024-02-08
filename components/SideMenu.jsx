import React from "react";
import ItemLists from "./SideMenu/ItemLists";

function Sidemenu() {
  return (
    <div className="w-1/4 bg-orange-50 text-black absolute h-screen">
      <div className="text-black">Items</div>
      <ItemLists name={"Linear"} />
      <ItemLists name={"Electrical"} />
      <ItemLists name={"Rotational"} />
    </div>
  );
}

export default Sidemenu;
