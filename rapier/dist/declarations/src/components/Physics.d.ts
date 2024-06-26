import type Rapier from "@dimforge/rapier3d-compat";
import { Collider, ColliderHandle, RigidBody, RigidBodyHandle, World } from "@dimforge/rapier3d-compat";
import React, { FC, ReactNode } from "react";
import { Matrix4, Object3D, Vector3 } from "three";
import { CollisionEnterHandler, CollisionExitHandler, ContactForceHandler, IntersectionEnterHandler, IntersectionExitHandler, RigidBodyAutoCollider, Vector3Tuple } from "../types";
export interface RigidBodyState {
    meshType: "instancedMesh" | "mesh";
    rigidBody: RigidBody;
    object: Object3D;
    invertedWorldMatrix: Matrix4;
    setMatrix: (matrix: Matrix4) => void;
    getMatrix: (matrix: Matrix4) => Matrix4;
    /**
     * Required for instanced rigid bodies.
     */
    scale: Vector3;
    isSleeping: boolean;
}
export declare type RigidBodyStateMap = Map<RigidBody["handle"], RigidBodyState>;
export declare type WorldStepCallback = (world: World) => void;
export declare type WorldStepCallbackSet = Set<{
    current: WorldStepCallback;
}>;
export interface ColliderState {
    collider: Collider;
    object: Object3D;
    /**
     * The parent of which this collider needs to base its
     * world position on, can be empty
     */
    worldParent?: Object3D;
}
export declare type ColliderStateMap = Map<Collider["handle"], ColliderState>;
export interface RapierContext {
    /**
     * Used by the world to keep track of RigidBody states
     * @internal
     */
    rigidBodyStates: RigidBodyStateMap;
    /**
     * Used by the world to keep track of Collider states
     * @internal
     */
    colliderStates: ColliderStateMap;
    /**
     * Used by the world to keep track of RigidBody events
     * @internal
     */
    rigidBodyEvents: EventMap;
    /**
     * Used by the world to keep track of Collider events
     * @internal
     */
    colliderEvents: EventMap;
    /**
     * Default options for rigid bodies and colliders
     * @internal
     */
    physicsOptions: {
        colliders: RigidBodyAutoCollider;
    };
    /**
     * Triggered before the physics world is stepped
     * @internal
     */
    beforeStepCallbacks: WorldStepCallbackSet;
    /**
     * Triggered after the physics world is stepped
     * @internal
     */
    afterStepCallbacks: WorldStepCallbackSet;
    /**
     * Direct access to the Rapier instance
     */
    rapier: typeof Rapier;
    /**
     * The Rapier physics world
     */
    world: World;
    /**
     * Can be used to overwrite the current World. Useful when working with snapshots.
     *
     * @example
     * ```tsx
     * import { useRapier } from '@react-three/rapier';
     *
     * const SnapshottingComponent = () => {
     *   const { world, setWorld, rapier } = useRapier();
     *   const worldSnapshot = useRef<Uint8Array>();
     *
     *   // Store the snapshot
     *   const takeSnapshot = () => {
     *     const snapshot = world.takeSnapshot()
     *     worldSnapshot.current = snapshot
     *   }
     *
     *   // Create a new World from the snapshot, and replace the current one
     *   const restoreSnapshot = () => {
     *     setWorld(rapier.World.restoreSnapshot(worldSnapshot.current))
     *   }
     *
     *   return <>
     *     <Rigidbody>...</RigidBody>
     *     <Rigidbody>...</RigidBody>
     *     <Rigidbody>...</RigidBody>
     *     <Rigidbody>...</RigidBody>
     *     <Rigidbody>...</RigidBody>
     *   </>
     * }
     * ```
     */
    setWorld: (world: World) => void;
    /**
     * If the physics simulation is paused
     */
    isPaused: boolean;
    /**
     * Step the physics world one step
     *
     * @param deltaTime The delta time to step the world with
     *
     * @example
     * ```
     * step(1/60)
     * ```
     */
    step: (deltaTime: number) => void;
    /**
     * Is debug mode enabled
     */
    isDebug: boolean;
}
export declare const rapierContext: React.Context<RapierContext | undefined>;
export declare type EventMapValue = {
    onSleep?(): void;
    onWake?(): void;
    onCollisionEnter?: CollisionEnterHandler;
    onCollisionExit?: CollisionExitHandler;
    onIntersectionEnter?: IntersectionEnterHandler;
    onIntersectionExit?: IntersectionExitHandler;
    onContactForce?: ContactForceHandler;
};
export declare type EventMap = Map<ColliderHandle | RigidBodyHandle, EventMapValue>;
export interface PhysicsProps {
    children: ReactNode;
    /**
     * Set the gravity of the physics world
     * @defaultValue [0, -9.81, 0]
     */
    gravity?: Vector3Tuple;
    /**
     * Amount of penetration the engine wont attempt to correct
     * @defaultValue 0.001
     */
    allowedLinearError?: number;
    /**
     * The number of solver iterations run by the constraints solver for calculating forces.
     * The greater this value is, the most rigid and realistic the physics simulation will be.
     * However a greater number of iterations is more computationally intensive.
     *
     * @defaultValue 4
     */
    numSolverIterations?: number;
    /**
     * Number of addition friction resolution iteration run during the last solver sub-step.
     * The greater this value is, the most realistic friction will be.
     * However a greater number of iterations is more computationally intensive.
     *
     * @defaultValue 4
     */
    numAdditionalFrictionIterations?: number;
    /**
     * Number of internal Project Gauss Seidel (PGS) iterations run at each solver iteration.
     * Increasing this parameter will improve stability of the simulation. It will have a lesser effect than
     * increasing `numSolverIterations` but is also less computationally expensive.
     *
     * @defaultValue 1
     */
    numInternalPgsIterations?: number;
    /**
     * The maximal distance separating two objects that will generate predictive contacts
     *
     * @defaultValue 0.002
     *
     */
    predictionDistance?: number;
    /**
     * Minimum number of dynamic bodies in each active island
     *
     * @defaultValue 128
     */
    minIslandSize?: number;
    /**
     * Maximum number of substeps performed by the solver
     *
     * @defaultValue 1
     */
    maxCcdSubsteps?: number;
    /**
     * The Error Reduction Parameter in between 0 and 1, is the proportion of the positional error to be corrected at each time step.
     *
     * @defaultValue 0.8
     */
    erp?: number;
    /**
     * Set the base automatic colliders for this physics world
     * All Meshes inside RigidBodies will generate a collider
     * based on this value, if not overridden.
     */
    colliders?: RigidBodyAutoCollider;
    /**
     * Set the timestep for the simulation.
     * Setting this to a number (eg. 1/60) will run the
     * simulation at that framerate. Alternatively, you can set this to
     * "vary", which will cause the simulation to always synchronize with
     * the current frame delta times.
     *
     * @defaultValue 1/60
     */
    timeStep?: number | "vary";
    /**
     * Pause the physics simulation
     *
     * @defaultValue false
     */
    paused?: boolean;
    /**
     * Interpolate the world transform using the frame delta times.
     * Has no effect if timeStep is set to "vary".
     *
     * @defaultValue true
     **/
    interpolate?: boolean;
    /**
     * The update priority at which the physics simulation should run.
     * Only used when `updateLoop` is set to "follow".
     *
     * @see https://docs.pmnd.rs/react-three-fiber/api/hooks#taking-over-the-render-loop
     * @defaultValue undefined
     */
    updatePriority?: number;
    /**
     * Set the update loop strategy for the physics world.
     *
     * If set to "follow", the physics world will be stepped
     * in a `useFrame` callback, managed by @react-three/fiber.
     * You can use `updatePriority` prop to manage the scheduling.
     *
     * If set to "independent", the physics world will be stepped
     * in a separate loop, not tied to the render loop.
     * This is useful when using the "demand" `frameloop` strategy for the
     * @react-three/fiber `<Canvas />`.
     *
     * @see https://docs.pmnd.rs/react-three-fiber/advanced/scaling-performance#on-demand-rendering
     * @defaultValue "follow"
     */
    updateLoop?: "follow" | "independent";
    /**
     * Enable debug rendering of the physics world.
     * @defaultValue false
     */
    debug?: boolean;
}
/**
 * The main physics component used to create a physics world.
 * @category Components
 */
export declare const Physics: FC<PhysicsProps>;
