"use client";

import { Box, OrbitControls, Torus } from "@react-three/drei";
import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier";
import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

export const Model = ({ callback, ...props }) => {
  return (
    <div {...props}>
      <Suspense fallback={"<Html>loading...</Html>"}>
        <Canvas className="bg-gray-500 rounded-3xl">
          <Physics>
            <Body callback={callback} />
            <RigidBody type="fixed">
              <mesh position={[0, -2 ,0]}>
                <boxGeometry  args={[20, 0.5, 20]} />
                <meshStandardMaterial color={"lime"} attach={"material"} />
              </mesh>
            </RigidBody>
          </Physics>
          <OrbitControls/>
          <ambientLight intensity={2}/>
        </Canvas>
      </Suspense>
    </div>
  );
};
const Body = ({ callback }) => {
  const ref = useRef();
  useFrame(() => {
    if (!ref.current) {
      return;
    }
    // console.log("velocity",ref.current.linvel())
    // console.log("position",ref.current.translation())
    callback(ref.current.translation().y);
  });
  return (
    <RigidBody restitution={2} ref={ref}>
      <Box >
        <meshStandardMaterial color={'hotpink'} metalness={0.9} roughness={0.1} />
      </Box>
    </RigidBody>
  );
};
