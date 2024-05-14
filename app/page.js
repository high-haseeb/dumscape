import React from "react";
import Graph from "@/components/Graph";
import Menu from "@/components/ui/Menu";
import Navbar from "@/components/ui/Navbar";
import { Model } from "@/components/Scene";
import { SubMenu } from "@/components/ui/Icon";

export default function Home() {
  return (
    <div className="w-screen h-screen flex flex-row gap-4 p-10 bg-[#181818] overflow-hidden" >
      <Navbar/>
      <Graph className="w-1/2 h-full rounded bg-white text-4xl font-medium"/>
      <Model className="flex-grow h-full rounded bg-white text-4xl font-medium"/>
      <Menu/>
    </div>
  );
}
