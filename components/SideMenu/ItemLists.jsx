"use client";
import { faDownLong, faUpLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useSpring, animated } from "@react-spring/web";

function ItemLists({ name }) {
  const [open, setOpen] = useState(true);
  const handleClick = () => {
    setOpen(!open);
  };
  const springs = useSpring({ opacity: open ? 1 : 0 });
  const rotateAnimation = useSpring({
    transform: `rotate(${open ? 180 : 0}deg)`,
  });
  return (
    <div>
      <div className="flex justify-between bg-orange-500">
        <div onClick={handleClick}>{name}</div>
        <animated.div style={rotateAnimation}>
          <FontAwesomeIcon
            icon={faDownLong}
            className="text-black w-[40px] h-[40px]"
            onClick={handleClick}
          />
        </animated.div>
      </div>
      {open && <animated.div style={springs}>Items</animated.div>}
    </div>
  );
}

export default ItemLists;
