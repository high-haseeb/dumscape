import { RapierRigidBody } from "@react-three/rapier";
import { RefObject } from "react";
import { create } from "zustand";

export interface Object {
  name: string;
  ref?: RefObject<RapierRigidBody>;
  geometry: string;
  color: string;
  mass: number;
  translation: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  linearDamping: number;
  angularDamping: number;
  gravityScale: number;
  friction: number;
  restitution: number;
  type: string;
}
export interface Joint {
  bodyA: string;
  bodyB: string;
  jointType: string;
  positionA?: { x: number; y: number; z: number };
  positionB?: { x: number; y: number; z: number };
  orientationA?: { x: number; y: number; z: number };
  orientationB?: { x: number; y: number; z: number };
  springRestLength?: number;
  damping?: number;
  ropeLength?: number;
  stiffness?: number;
}
export interface Impulse{
  type: string;
  direction: {x: number; y: number; z: number},
  magnitude: number;
  bodyRef : RefObject<RapierRigidBody> | null;
  index: number;
  used? : boolean;
}
interface Impulses{
  impulses: Impulse[];
  addImpulse : (impulse: Impulse) => void;
  setImpulseUsed : (impulse: Impulse) => void;
}
export const useImpulseStore = create<Impulses>((set) => ({
  impulses: [],
  addImpulse: (impulse: Impulse) => set((state) => ({ impulses: [...state.impulses, impulse] })),
 setImpulseUsed: (impulse: Impulse) => set((state) => ({
    impulses: state.impulses.map((imp) => 
      imp === impulse ? { ...imp, used: true } : imp
    )
  })),
}));
interface Graphs {
  graphBody: Object | null;
  setGraphBody : (body: Object) => void;
}
export const useGraphStore = create<Graphs>((set) => ({
  graphBody: null,
  setGraphBody: (body: Object) => set((state) => ({ graphBody: body })),
}));

export interface Joints {
  joints: Joint[];
  addJoint: (joint: Joint) => void;
}

export const useJointStore = create<Joints>((set) => ({
  joints: [],
  addJoint: (joint: Joint) => set((state) => ({ joints: [...state.joints, joint] })),
}));

export interface Schema {
  objects: Object[];
  addObject: (object: Object) => void;
  setRef: (index: number, ref: RefObject<RapierRigidBody>) => void;
}

const useSchemaStore = create<Schema>((set) => ({
  objects: [],
  addObject: (object) => set((state) => ({ objects: [...state.objects, object] })),
  setRef: (index, ref) =>
    set((state) => ({
      objects: state.objects.map((obj, i) => (i === index ? { ...obj, ref } : obj)),
    })),
}));

export default useSchemaStore;
