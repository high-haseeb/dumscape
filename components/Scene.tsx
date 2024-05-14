"use client";

import useStateStore from "@/store/state";
import { useConfigStore } from "@/store/configStore";
import { Environment, OrbitControls } from "@react-three/drei";
import { Physics, RigidBody, useSpringJoint, RapierRigidBody, useFixedJoint, useRopeJoint, RigidBodyTypeString } from "@react-three/rapier";
import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Image from "next/image";
import useSchemaStore, { Object, useJointStore } from "@/store/schemaStore";
import Joint from "./ui/Joint";

export const Model = (props: any) => {
  const paused = useConfigStore((state) => state.paused);
  const debug = useConfigStore((state) => state.debug);
  const schema = useSchemaStore((state) => state.objects);

  return (
    <div {...props}>
      <Suspense
        fallback={
          <div className="flex justify-center items-center w-full h-full bg-gray-500">
            <Image src={"/icons/logo.svg"} alt="logo" width={400} height={100} />
          </div>
        }
      >
        <Canvas {...props}>
          <Physics paused={paused} debug={debug}>
            {/* <TransformControls> */}

            {/* <Body /> */}
            {/* <JointedThing /> */}
            {schema.map((object, index) => (
              <Body object={object} index={index} />
            ))}

            {/* </TransformControls> */}

            <Joints />
            <Ground />
          </Physics>
          <OrbitControls makeDefault />
          <Environment preset="city" />
        </Canvas>
      </Suspense>
    </div>
  );
};
const Joints = () => {
  const objects = useSchemaStore((state) => state.objects);
  const joints = useJointStore((state) => state.joints);
  useEffect(() => {
    joints.map(
      (joint, _index) => {
        switch (joint.jointType.toLowerCase()) {
          case "fixed":
            useFixedJoint(objects[0].ref, objects[1].ref, [
              [joint.positionA.x, joint.positionA.y, joint.positionA.z],
              [joint.orientationA.x, joint.orientationA.y, joint.orientationA.z, 1],
              [joint.positionB.x, joint.positionB.y, joint.positionB.z],
              [joint.orientationB.x, joint.orientationB.y, joint.orientationB.z, 1],
            ]);
            break;

          case "rope":
            useRopeJoint(objects[0].ref, objects[1].ref, [
              [joint.positionA.x, joint.positionA.y, joint.positionA.z],
              [joint.positionB.x, joint.positionB.y, joint.positionB.z],
              joint.ropeLength,
            ]);
            console.log("added rope joint");
            break;

          default:
            break;
        }
      },
      [joints],
    );
  });
  return <></>;
};
const Body = ({ object, index }: { object: Object; index: number }) => {
  const bodyRef = useRef<RapierRigidBody>();
  const meshRef = useRef<THREE.Mesh>();
  const setRef = useSchemaStore((state) => state.setRef);
  const setPosition = useStateStore((state) => state.setPosition);

  useEffect(() => {
    if (bodyRef.current) {
      setRef(index, bodyRef);
    }
  }, [bodyRef.current]);

  // useFrame(() => {
  //   if (!bodyRef.current) return;
  // setPosition(Number(ref.current.translation().y.toFixed(2)));
  // });

  return (
    <RigidBody
      ref={bodyRef}
      type={object.type as RigidBodyTypeString}
      position={[object.translation.x, object.translation.y, object.translation.z]}
      rotation={[object.rotation.x, object.rotation.y, object.rotation.z]}
      mass={object.mass}
      linearDamping={object.linearDamping}
      angularDamping={object.angularDamping}
      gravityScale={object.gravityScale}
      friction={object.friction}
      restitution={object.restitution}
    >
      <mesh ref={meshRef} scale={[object.scale.x, object.scale.y, object.scale.z]}>
        {object.geometry === "sphere" ? <sphereGeometry args={[1]} /> : <boxGeometry args={[1, 1, 1]} />}
        <meshStandardMaterial color={object.color} />
      </mesh>
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
const JointedThing = () => {
  const bodyA = useRef<RapierRigidBody>(null);
  const bodyB = useRef<RapierRigidBody>(null);

  const mass = 1;
  const springRestLength = 7;
  const stiffness = 1.0e3;
  const criticalDamping = 2.0 * Math.sqrt(stiffness * mass);
  const dampingRatio = 1;
  const damping = 1.0; // dampingRatio * criticalDamping;

  useSpringJoint(bodyA, bodyB, [
    // Position of the joint in bodyA's local space
    [0, 0, 0],
    // Position of the joint in bodyB's local space
    [0, 0, 0],
    // Spring rest length
    2,
    // Spring stiffness
    stiffness,
    // Spring damping
    // 0.1,
    0.01 * criticalDamping,
  ]);
  // const joint = useRopeJoint(bodyA, bodyB, [[0, 0, 0], [0, 0, 0], 2]);
  // useEffect(() => {
  // console.log(joint.current)
  // }, [joint])

  const setPosition = useStateStore((state) => state.setPosition);
  useFrame(() => {
    if (!bodyB.current) return;
    setPosition(Number(bodyB.current.translation().x.toFixed(2)));
  });
  return (
    <group>
      <RigidBody ref={bodyA} position={[0, 5, 0]} type="fixed">
        <mesh>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshStandardMaterial color={"red"} attach={"material"} />
        </mesh>
      </RigidBody>
      <RigidBody ref={bodyB} position={[10, 0, 0]} mass={10} friction={10} linearDamping={0.1}>
        <mesh>
          <sphereGeometry args={[0.3]} />
          <meshStandardMaterial color={"blue"} attach={"material"} />
        </mesh>
      </RigidBody>
    </group>
  );
};
