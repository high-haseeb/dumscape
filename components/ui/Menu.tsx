"use client";
import React from "react";
import Icon  from "./Icon";
import SubMenu from "./Submenu";
import { useConfigStore,} from "@/store/configStore";
 // import {useMenuStore} from '@/store/menuStore' 

import Add from "./Add";
import Joints from "./Joint";
import Impulse from "./Impulse";
import Monitor from "./Monitor";

const Menu = () => {
  const setPaused = useConfigStore((state) => state.setPaused);
  const paused = useConfigStore((state) => state.paused);
  const setDebug = useConfigStore((state) => state.setDebug);
  const debug = useConfigStore((state) => state.debug);
  return (
    <div className="relative h-full">
      <div className="flex gap-2 bg-gray-800 rounded h-full">
        <div className="flex flex-col gap-4 justify-start items-center p-2 w-10">
          <Icon icon="logo_d" onClick={() => console.log("clicked")} />
          <Icon icon="cube_add" onClick={() => console.log("clicked")}  title="add object"/>
          <Icon icon="graph" onClick={() => console.log("clicked")} title="add joint"/>
          <Icon icon="globe" onClick={() => setPaused(!paused)} />
          <Icon icon="gear" onClick={() => console.log("clicked")} />
          <Icon icon="arrow_down" onClick={() => console.log("clicked")} title="add impulse"/>
          <Icon icon="monitor" onClick={() => console.log("clicked")} title="monitor a body"/>
          <Icon icon="bug" title="toggle debug" onClick={() => setDebug(!debug)} />
        </div>
      </div>
      <Add/>
      <Joints/>
      <Impulse/>
      <Monitor/>
    </div>
  );
};

export default Menu;
