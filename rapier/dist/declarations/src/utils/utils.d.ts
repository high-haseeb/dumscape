import { Quaternion as RapierQuaternion, Vector3 as RapierVector3 } from "@dimforge/rapier3d-compat";
import { Euler, Quaternion, Vector3 } from "three";
import { RigidBodyTypeString, Vector3Tuple } from "../types";
import { Vector3 as Vector3Like, Quaternion as QuaternionLike } from "@react-three/fiber";
export declare const vectorArrayToVector3: (arr: Vector3Tuple) => Vector3;
export declare const vector3ToQuaternion: (v: Vector3) => Quaternion;
export declare const rapierVector3ToVector3: ({ x, y, z }: RapierVector3) => Vector3;
export declare const rapierQuaternionToQuaternion: ({ x, y, z, w }: RapierQuaternion) => Quaternion;
export declare const vector3ToRapierVector: (v: Vector3Like) => RapierVector3;
export declare const quaternionToRapierQuaternion: (v: QuaternionLike) => RapierQuaternion;
export declare const rigidBodyTypeFromString: (type: RigidBodyTypeString) => 0 | 3 | 1 | 2;
export declare const scaleVertices: (vertices: ArrayLike<number>, scale: Vector3) => number[];
export declare const vectorToTuple: (v: Vector3 | Quaternion | any[] | undefined | number | Euler) => any[];
export declare function useConst<T>(initialValue: T | (() => T)): T;
