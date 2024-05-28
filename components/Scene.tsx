"use client";

import useStateStore from "@/store/state";
import { useConfigStore } from "@/store/configStore";
import { DragControls, Environment, OrbitControls } from "@react-three/drei";
import { Physics, RigidBody, useSpringJoint, RapierRigidBody, useFixedJoint, useRopeJoint, RigidBodyTypeString } from "@react-three/rapier";
import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Image from "next/image";
import useSchemaStore, { Joint, Object, useGraphStore, useImpulseStore, useJointStore } from "@/store/schemaStore";

export const Model = (props: any) => {
  const paused = useConfigStore((state) => state.paused);
  const debug = useConfigStore((state) => state.debug);
  const schema = useSchemaStore((state) => state.objects);
  const joints = useJointStore((state) => state.joints);

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
            {schema.map((object, index) => (
              <Body object={object} index={index} />
            ))}

            {joints.map((joint, _index) => (
              <RenderJoints joint={joint} objects={schema} />
            ))}
            <Ground />
            <Impulse />
          </Physics>
          <OrbitControls makeDefault />
          <Environment preset="city" />
        </Canvas>
      </Suspense>
    </div>
  );
};
const RenderJoints = ({ joint, objects }: { joint: Joint; objects: Object[] }) => {
  if (objects.length >= 2) {
    switch (joint.jointType.toLowerCase()) {
      case "fixed":
        useFixedJoint(objects[0].ref, objects[1].ref, [
          [joint.positionA.x, joint.positionA.y, joint.positionA.z],
          [joint.orientationA.x, joint.orientationA.y, joint.orientationA.z, 1],
          [joint.positionB.x, joint.positionB.y, joint.positionB.z],
          [joint.orientationB.x, joint.orientationB.y, joint.orientationB.z, 1],
        ]);
        console.log("added fixed joint");
        break;

      case "rope":
        useRopeJoint(objects[0].ref, objects[1].ref, [
          [joint.positionA.x, joint.positionA.y, joint.positionA.z],
          [joint.positionB.x, joint.positionB.y, joint.positionB.z],
          joint.ropeLength,
        ]);
        console.log("added rope joint");
        break;

      case "spring":
        useSpringJoint(objects[0].ref, objects[1].ref, [
          [0, 0, 0],
          [0, 0, 0],
          joint.springRestLength,
          joint.stiffness,
          joint.damping,
        ]);
        console.log(joint.springRestLength, joint.stiffness, joint.damping);
        break;

      default:
        break;
    }
  }
  return <></>;
};
const Body = ({ object, index }: { object: Object; index: number }) => {
  const bodyRef = useRef<RapierRigidBody>();
  const meshRef = useRef<THREE.Mesh>();
  const setRef = useSchemaStore((state) => state.setRef);
  const setPosition = useStateStore((state) => state.setPosition);
  const setVelocity = useStateStore(state => state.setVelocity)
  const graphBody = useGraphStore((state) => state.graphBody);

  useEffect(() => {
    if (bodyRef.current) {
      setRef(index, bodyRef);
    }
  }, [bodyRef.current]);

  useFrame(() => {
    if (!bodyRef.current) return;
    if (object === graphBody) {
      setPosition({
        x: Number(bodyRef.current.translation().x.toFixed(2)),
        y: Number(bodyRef.current.translation().y.toFixed(2)),
        z: Number(bodyRef.current.translation().z.toFixed(2)),
      });
      setVelocity({
        x: Number(bodyRef.current.linvel().x.toFixed(2)),
        y: Number(bodyRef.current.linvel().y.toFixed(2)),
        z: Number(bodyRef.current.linvel().z.toFixed(2)),
      })
    }
  });

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

const Impulse = () => {
  const impulses = useImpulseStore((state) => state.impulses);
  return (
    <>
      {impulses.map((impulse) => {
        if (!impulse.used && impulse.bodyRef.current) {
          impulse.type === "angular"
            ? impulse.bodyRef.current.applyTorqueImpulse(impulse.direction, true)
            : impulse.bodyRef.current.applyImpulse(impulse.direction, true);
          impulse.used = true;
        }
      })}
    </>
  );
};

