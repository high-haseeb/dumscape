import { MutableRefObject, RefObject } from "react";
import { CoefficientCombineRule, Collider as RapierCollider, ImpulseJoint, InteractionGroups, RigidBody as RapierRigidBody, TempContactManifold } from "@dimforge/rapier3d-compat";
import { Rotation, Vector } from "@dimforge/rapier3d-compat/math";
import { Object3DProps, Vector3, Quaternion } from "@react-three/fiber";
import { Object3D } from "three";
import { ColliderProps } from ".";
import { RigidBodyState } from "./components/Physics";
export { CoefficientCombineRule as CoefficientCombineRule } from "@dimforge/rapier3d-compat";
export { RapierRigidBody, RapierCollider };
export declare type RefGetter<T> = MutableRefObject<() => T | undefined>;
export declare type RigidBodyAutoCollider = "ball" | "cuboid" | "hull" | "trimesh" | false;
export declare type CuboidArgs = [
    halfWidth: number,
    halfHeight: number,
    halfDepth: number
];
export declare type BallArgs = [radius: number];
export declare type CapsuleArgs = [halfHeight: number, radius: number];
export declare type ConvexHullArgs = [vertices: ArrayLike<number>];
export declare type HeightfieldArgs = [
    width: number,
    height: number,
    heights: number[],
    scale: {
        x: number;
        y: number;
        z: number;
    }
];
export declare type TrimeshArgs = [
    vertices: ArrayLike<number>,
    indices: ArrayLike<number>
];
export declare type PolylineArgs = [vertices: Float32Array, indices: Uint32Array];
export declare type RoundCuboidArgs = [
    halfWidth: number,
    halfHeight: number,
    halfDepth: number,
    borderRadius: number
];
export declare type CylinderArgs = [halfHeight: number, radius: number];
export declare type RoundCylinderArgs = [
    halfHeight: number,
    radius: number,
    borderRadius: number
];
export declare type ConeArgs = [halfHeight: number, radius: number];
export declare type RoundConeArgs = [
    halfHeight: number,
    radius: number,
    borderRadius: number
];
export declare type ConvexMeshArgs = [
    vertices: ArrayLike<number>,
    indices: ArrayLike<number>
];
export declare type RoundConvexHullArgs = [
    vertices: ArrayLike<number>,
    indices: ArrayLike<number>,
    borderRadius: number
];
export declare type RoundConvexMeshArgs = [
    vertices: ArrayLike<number>,
    indices: ArrayLike<number>,
    borderRadius: number
];
export declare type UseBodyOptions = Omit<RigidBodyOptions, "shape">;
export declare type RigidBodyTypeString = "fixed" | "dynamic" | "kinematicPosition" | "kinematicVelocity";
export declare type ColliderShape = "cuboid" | "trimesh" | "ball" | "capsule" | "convexHull" | "heightfield" | "polyline" | "roundCuboid" | "cylinder" | "roundCylinder" | "cone" | "roundCone" | "convexMesh" | "roundConvexHull" | "roundConvexMesh";
export declare type Vector3Tuple = [x: number, y: number, z: number];
export declare type Vector4Tuple = [x: number, y: number, z: number, w: number];
export declare type Boolean3Tuple = [x: boolean, y: boolean, z: boolean];
export declare type Vector3Object = {
    x: number;
    y: number;
    z: number;
};
/**
 * @deprecated use Vector3Tuple instead
 */
export declare type Vector3Array = Vector3Tuple;
/**
 * @deprecated use Vector4Tuple instead
 * */
export declare type Vector4Array = Vector4Tuple;
/**
 * @deprecated use Boolean3Tuple instead
 * */
export declare type Boolean3Array = Boolean3Tuple;
export interface ColliderOptions<ColliderArgs extends Array<unknown>> {
    /**
     * The optional name passed to THREE's Object3D
     */
    name?: string;
    /**
     * The shape of your collider
     */
    shape?: ColliderShape;
    /**
     * Arguments to pass to the collider
     */
    args?: ColliderArgs;
    /**
     * Principal angular inertia of this rigid body
     */
    principalAngularInertia?: Vector3Tuple;
    /**
     * Restitution controls how elastic (aka. bouncy) a contact is. Le elasticity of a contact is controlled by the restitution coefficient
     */
    restitution?: number;
    /**
     * What happens when two bodies meet. See https://rapier.rs/docs/user_guides/javascript/colliders#friction.
     */
    restitutionCombineRule?: CoefficientCombineRule;
    /**
     * Friction is a force that opposes the relative tangential motion between two rigid-bodies with colliders in contact.
     * A friction coefficient of 0 implies no friction at all (completely sliding contact) and a coefficient
     * greater or equal to 1 implies a very strong friction. Values greater than 1 are allowed.
     */
    friction?: number;
    /**
     * What happens when two bodies meet. See https://rapier.rs/docs/user_guides/javascript/colliders#friction.
     */
    frictionCombineRule?: CoefficientCombineRule;
    /**
     * The position of this collider relative to the rigid body
     */
    position?: Object3DProps["position"];
    /**
     * The rotation of this collider relative to the rigid body
     */
    rotation?: Object3DProps["rotation"];
    /**
     * The rotation, as a Quaternion, of this collider relative to the rigid body
     */
    quaternion?: Object3DProps["quaternion"];
    /**
     * The scale of this collider relative to the rigid body
     */
    scale?: Object3DProps["scale"];
    /**
     * Callback when this collider collides with another collider.
     */
    onCollisionEnter?: CollisionEnterHandler;
    /**
     * Callback when this collider stops colliding with another collider.
     */
    onCollisionExit?: CollisionExitHandler;
    /**
     * Callback when this collider, or another collider starts intersecting, and at least one of them is a `sensor`.
     */
    onIntersectionEnter?: IntersectionEnterHandler;
    /**
     * Callback when this, or another collider stops intersecting, and at least one of them is a `sensor`.
     */
    onIntersectionExit?: IntersectionExitHandler;
    /**
     * Callback when this, or another collider triggers a contact force event
     */
    onContactForce?: ContactForceHandler;
    /**
     * The bit mask configuring the groups and mask for collision handling.
     */
    collisionGroups?: InteractionGroups;
    /**
     * The bit mask configuring the groups and mask for solver handling.
     */
    solverGroups?: InteractionGroups;
    /**
     * Sets the uniform density of this collider.
     * If this is set, other mass-properties like the angular inertia tensor are computed
     * automatically from the collider's shape.
     * Cannot be used at the same time as the mass or massProperties values.
     * More info https://rapier.rs/docs/user_guides/javascript/colliders#mass-properties
     */
    density?: number;
    /**
     * The mass of this collider.
     * Generally, it's not recommended to adjust the mass properties as it could lead to
     * unexpected behaviors.
     * Cannot be used at the same time as the density or massProperties values.
     * More info https://rapier.rs/docs/user_guides/javascript/colliders#mass-properties
     */
    mass?: number;
    /**
     * The mass properties of this rigid body.
     * Cannot be used at the same time as the density or mass values.
     */
    massProperties?: {
        mass: number;
        centerOfMass: Vector;
        principalAngularInertia: Vector;
        angularInertiaLocalFrame: Rotation;
    };
    /**
     * Sets whether or not this collider is a sensor.
     */
    sensor?: boolean;
}
export declare type CollisionTarget = {
    rigidBody?: RapierRigidBody;
    collider: RapierCollider;
    rigidBodyObject?: Object3D;
    colliderObject?: Object3D;
};
export declare type CollisionPayload = {
    /** the object firing the event */
    target: CollisionTarget;
    /** the other object involved in the event */
    other: CollisionTarget;
    /** deprecated use `payload.other.rigidBody` instead */
    rigidBody?: RapierRigidBody;
    /** deprecated use `payload.other.collider` instead */
    collider: RapierCollider;
    /** deprecated use `payload.other.rigidBodyObject` instead */
    rigidBodyObject?: Object3D;
    /** deprecated use `payload.other.colliderObject` instead */
    colliderObject?: Object3D;
};
export declare type CollisionEnterPayload = CollisionPayload & {
    manifold: TempContactManifold;
    flipped: boolean;
};
export declare type CollisionExitPayload = CollisionPayload;
export declare type IntersectionEnterPayload = CollisionPayload;
export declare type IntersectionExitPayload = CollisionPayload;
export declare type ContactForcePayload = CollisionPayload & {
    totalForce: Vector;
    totalForceMagnitude: number;
    maxForceDirection: Vector;
    maxForceMagnitude: number;
};
export declare type CollisionEnterHandler = (payload: CollisionEnterPayload) => void;
export declare type CollisionExitHandler = (payload: CollisionExitPayload) => void;
export declare type IntersectionEnterHandler = (payload: IntersectionEnterPayload) => void;
export declare type IntersectionExitHandler = (payload: IntersectionExitPayload) => void;
export declare type ContactForceHandler = (payload: ContactForcePayload) => void;
export interface RigidBodyOptions extends ColliderProps {
    /**
     * Specify the type of this rigid body
     */
    type?: RigidBodyTypeString;
    /**
     * Whether or not this body can sleep.
     * @defaultValue true
     */
    canSleep?: boolean;
    /** The linear damping coefficient of this rigid-body.*/
    linearDamping?: number;
    /** The angular damping coefficient of this rigid-body.*/
    angularDamping?: number;
    /**
     * The initial linear velocity of this body.
     * @defaultValue [0,0,0]
     */
    linearVelocity?: Vector3Tuple;
    /**
     * The initial angular velocity of this body.
     * @defaultValue [0,0,0]
     */
    angularVelocity?: Vector3Tuple;
    /**
     * The scaling factor applied to the gravity affecting the rigid-body.
     * @defaultValue 1.0
     */
    gravityScale?: number;
    /**
     * The dominance group of this RigidBody. If a rigid body has a higher domiance group,
     * on collision it will be immune to forces originating from the other bodies.
     * https://rapier.rs/docs/user_guides/javascript/rigid_bodies#dominance
     * Default: 0
     */
    dominanceGroup?: number;
    /**
     * Whether or not Continous Collision Detection is enabled for this rigid-body.
     * https://rapier.rs/docs/user_guides/javascript/rigid_bodies#continuous-collision-detection
     * @defaultValue false
     */
    ccd?: boolean;
    /**
     * Initial position of the RigidBody
     */
    position?: Object3DProps["position"];
    /**
     * Initial rotation of the RigidBody
     */
    rotation?: Object3DProps["rotation"];
    /**
     * Automatically generate colliders based on meshes inside this
     * rigid body.
     *
     * You can change the default setting globally by setting the colliders
     * prop on the <Physics /> component.
     *
     * Setting this to false will disable automatic colliders.
     */
    colliders?: RigidBodyAutoCollider | false;
    /**
     * Set the friction of auto-generated colliders.
     * This does not affect any non-automatic child collider-components.
     */
    friction?: number;
    /**
     * Set the restitution (bounciness) of auto-generated colliders.
     * This does not affect any non-automatic child collider-components.
     */
    restitution?: number;
    /**
     * Sets the number of additional solver iterations that will be run for this
     * rigid-body and everything that interacts with it directly or indirectly
     * through contacts or joints.
     *
     * Compared to increasing the global `World.numSolverIteration`, setting this
     * value lets you increase accuracy on only a subset of the scene, resulting in reduced
     * performance loss.
     */
    additionalSolverIterations?: number;
    /**
     * The default collision groups bitmask for all colliders in this rigid body.
     * Can be customized per-collider.
     */
    collisionGroups?: InteractionGroups;
    /**
     * The default solver groups bitmask for all colliders in this rigid body.
     * Can be customized per-collider.
     */
    solverGroups?: InteractionGroups;
    onSleep?(): void;
    onWake?(): void;
    /**
     * Locks all rotations that would have resulted from forces on the created rigid-body.
     */
    lockRotations?: boolean;
    /**
     * Locks all translations that would have resulted from forces on the created rigid-body.
     */
    lockTranslations?: boolean;
    /**
     * Allow rotation of this rigid-body only along specific axes.
     */
    enabledRotations?: Boolean3Tuple;
    /**
     * Allow translation of this rigid-body only along specific axes.
     */
    enabledTranslations?: Boolean3Tuple;
    /**
     * Passed down to the object3d representing this collider.
     */
    userData?: Object3DProps["userData"];
    /**
     * Include invisible objects on the collider creation estimation.
     */
    includeInvisible?: boolean;
    /**
     * Transform the RigidBodyState
     * @internal Do not use. Used internally by the InstancedRigidBodies to alter the RigidBody State
     */
    transformState?: (state: RigidBodyState) => RigidBodyState;
}
export declare type SphericalJointParams = [
    body1Anchor: Vector3,
    body2Anchor: Vector3
];
export declare type FixedJointParams = [
    body1Anchor: Vector3,
    body1LocalFrame: Quaternion,
    body2Anchor: Vector3,
    body2LocalFrame: Quaternion
];
export declare type PrismaticJointParams = [
    body1Anchor: Vector3,
    body2Anchor: Vector3,
    axis: Vector3,
    limits?: [min: number, max: number]
];
export declare type RevoluteJointParams = [
    body1Anchor: Vector3,
    body2Anchor: Vector3,
    axis: Vector3,
    limits?: [min: number, max: number]
];
export declare type RopeJointParams = [
    body1Anchor: Vector3,
    body2Anchor: Vector3,
    length: number
];
export declare type SpringJointParams = [
    body1Anchor: Vector3,
    body2Anchor: Vector3,
    restLength: number,
    stiffness: number,
    damping: number
];
export interface UseImpulseJoint<JointParams, JointType extends ImpulseJoint> {
    (body1: RefObject<RapierRigidBody>, body2: RefObject<RapierRigidBody>, params: JointParams): RefObject<JointType | undefined>;
}
