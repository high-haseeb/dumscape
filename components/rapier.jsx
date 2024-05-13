"use client";

import useStateStore from "@/store/state";
import { Box, Environment, OrbitControls, Torus } from "@react-three/drei";
import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier";
import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

export const Model = (props) => {
  return (
    <div {...props}>
      <Suspense fallback={"<Html>loading...</Html>"}>
        <Canvas {...props}>
          <Physics>
            <Body />
            <Ground/>
          </Physics>
          <OrbitControls />
          <Environment preset="city"/>
        </Canvas>
      </Suspense>
    </div>
  );
};
const Body = () => {
  const ref = useRef();
  const setPosition = useStateStore(state => state.setPosition)
  useFrame(() => {
    if (!ref.current) return;

    setPosition(ref.current.translation().y.toFixed(2));
    // setPosition(ref.current.translation().y);
    // console.log(ref.current.translation().y)
    // console.log("velocity",ref.current.linvel())
    // console.log("position",ref.current.translation())
  });
  return (
    <RigidBody restitution={2} ref={ref}>
      <Box onClick={() => {setPosition((Math.random() * 10).toFixed(2));}}>
        <meshStandardMaterial
          color={"hotpink"}
          metalness={0.9}
          roughness={0.1}
        />
      </Box>
    </RigidBody>
  );
};
const Ground = () => {
  return (
    <RigidBody type="fixed">
      <mesh position={[0, -2, 0]}>
        <boxGeometry args={[20, 1, 20]} />
        <meshStandardMaterial color={"lime"} attach={"material"} />
      </mesh>
    </RigidBody>
  );
};
