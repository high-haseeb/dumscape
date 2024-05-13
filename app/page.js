import React from "react";
import Graph from "@/components/Graph";
import { Model } from "@/components/rapier";

export default function Home() {
  return (
    <div className="w-screen h-screen flex flex-row  p-10 bg-[#181818]" >
      <Graph className="w-1/2 h-full rounded-xl bg-white text-4xl font-medium"/>
      <Model className="w-1/2 h-full rounded-xl bg-white text-4xl font-medium"/>
    </div>
  );
}
