import { Collider, RigidBody, World } from "@dimforge/rapier3d-compat";
import { BufferGeometry, Object3D, Vector3 } from "three";
import { ColliderProps, RigidBodyProps } from "..";
import { ColliderState, ColliderStateMap, EventMap } from "../components/Physics";
import { ColliderShape, RigidBodyAutoCollider } from "../types";
export declare const scaleColliderArgs: (shape: ColliderShape, args: (number | ArrayLike<number> | {
    x: number;
    y: number;
    z: number;
})[], scale: Vector3) => (number | ArrayLike<number> | {
    x: number;
    y: number;
    z: number;
})[];
export declare const createColliderFromOptions: (options: ColliderProps, world: World, scale: Vector3, getRigidBody?: () => RigidBody) => Collider;
declare type ImmutableColliderOptions = (keyof ColliderProps)[];
export declare const immutableColliderOptions: ImmutableColliderOptions;
export declare const setColliderOptions: (collider: Collider, options: ColliderProps, states: ColliderStateMap) => void;
export declare const useUpdateColliderOptions: (getCollider: () => Collider, props: ColliderProps, states: ColliderStateMap) => void;
export declare const createColliderState: (collider: Collider, object: Object3D, rigidBodyObject?: Object3D | null) => ColliderState;
interface CreateColliderPropsFromChildren {
    (options: {
        object: Object3D;
        ignoreMeshColliders: boolean;
        options: RigidBodyProps;
    }): ColliderProps[];
}
export declare const createColliderPropsFromChildren: CreateColliderPropsFromChildren;
export declare const getColliderArgsFromGeometry: (geometry: BufferGeometry, colliders: RigidBodyAutoCollider) => {
    args: unknown[];
    offset: Vector3;
};
export declare const getActiveCollisionEventsFromProps: (props?: ColliderProps) => {
    collision: boolean;
    contactForce: boolean;
};
export declare const useColliderEvents: (getCollider: () => Collider, props: ColliderProps, events: EventMap, activeEvents?: {
    collision?: boolean;
    contactForce?: boolean;
}) => void;
export declare const cleanRigidBodyPropsForCollider: (props?: RigidBodyProps) => {
    linearVelocity?: import("..").Vector3Tuple | undefined;
    angularVelocity?: import("..").Vector3Tuple | undefined;
    dominanceGroup?: number | undefined;
    position?: import("@react-three/fiber").Vector3 | undefined;
    rotation?: import("@react-three/fiber").Euler | undefined;
    colliders?: RigidBodyAutoCollider | undefined;
    friction?: number | undefined;
    restitution?: number | undefined;
    additionalSolverIterations?: number | undefined;
    collisionGroups?: number | undefined;
    solverGroups?: number | undefined;
    onSleep?(): void;
    onWake?(): void;
    lockRotations?: boolean | undefined;
    lockTranslations?: boolean | undefined;
    enabledRotations?: import("..").Boolean3Tuple | undefined;
    enabledTranslations?: import("..").Boolean3Tuple | undefined;
    userData?: {
        [key: string]: any;
    } | undefined;
    includeInvisible?: boolean | undefined;
    transformState?: ((state: import("../components/Physics").RigidBodyState) => import("../components/Physics").RigidBodyState) | undefined;
    name?: string | undefined;
    shape?: ColliderShape | undefined;
    args?: any;
    principalAngularInertia?: import("..").Vector3Tuple | undefined;
    restitutionCombineRule?: import("@dimforge/rapier3d-compat").CoefficientCombineRule | undefined;
    frictionCombineRule?: import("@dimforge/rapier3d-compat").CoefficientCombineRule | undefined;
    quaternion?: import("@react-three/fiber").Quaternion | undefined;
    scale?: import("@react-three/fiber").Vector3 | undefined;
    density?: number | undefined;
    massProperties?: {
        mass: number;
        centerOfMass: import("@dimforge/rapier3d-compat").Vector;
        principalAngularInertia: import("@dimforge/rapier3d-compat").Vector;
        angularInertiaLocalFrame: import("@dimforge/rapier3d-compat").Rotation;
    } | undefined;
    sensor?: boolean | undefined;
};
export {};
