"use client";
import React from "react";
import Image from "next/image";
import { useMenuStore } from "@/store/menuStore";

const Icon = ({
  icon,
  onClick,
  title = "default",
  subMenuIcon = false,
  ...props
}: {
  onClick?: () => void;
  icon: string;
  subMenuIcon?: boolean;
  title?: string;
}) => {

  const setActiveTab = useMenuStore((state) => state.setActiveTab);
  const activeTab = useMenuStore((state) => state.activeTab);
  return (
    <button onClick={() => {!subMenuIcon && (activeTab !== icon ? setActiveTab(icon) : setActiveTab('null'));onClick && onClick()}} title={title}>
      <Image
        title={title}
        className="object-cover w-9 h-8"
        src={`/icons/${icon}.svg`}
        alt={`${icon}`}
        width={10}
        height={10}
        {...props}
      />
    </button>
  );
};
export default Icon;
