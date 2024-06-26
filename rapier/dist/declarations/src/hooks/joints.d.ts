import { FixedImpulseJoint, ImpulseJoint, PrismaticImpulseJoint, RevoluteImpulseJoint, RopeImpulseJoint, SphericalImpulseJoint, SpringImpulseJoint } from "@dimforge/rapier3d-compat";
import { RefObject } from "react";
import { FixedJointParams, PrismaticJointParams, RapierRigidBody, RevoluteJointParams, RopeJointParams, SphericalJointParams, SpringJointParams, UseImpulseJoint } from "..";
import type Rapier from "@dimforge/rapier3d-compat";
/**
 * @internal
 */
export declare const useImpulseJoint: <JointType extends ImpulseJoint>(body1: RefObject<RapierRigidBody>, body2: RefObject<RapierRigidBody>, params: Rapier.JointData) => import("react").MutableRefObject<JointType | undefined>;
/**
 * A fixed joint ensures that two rigid-bodies don't move relative to each other.
 * Fixed joints are characterized by one local frame (represented by an isometry) on each rigid-body.
 * The fixed-joint makes these frames coincide in world-space.
 *
 * @category Hooks - Joints
 */
export declare const useFixedJoint: UseImpulseJoint<FixedJointParams, FixedImpulseJoint>;
/**
 * The spherical joint ensures that two points on the local-spaces of two rigid-bodies always coincide (it prevents any relative
 * translational motion at this points). This is typically used to simulate ragdolls arms, pendulums, etc.
 * They are characterized by one local anchor on each rigid-body. Each anchor represents the location of the
 * points that need to coincide on the local-space of each rigid-body.
 *
 * @category Hooks - Joints
 */
export declare const useSphericalJoint: UseImpulseJoint<SphericalJointParams, SphericalImpulseJoint>;
/**
 * The revolute joint prevents any relative movement between two rigid-bodies, except for relative
 * rotations along one axis. This is typically used to simulate wheels, fans, etc.
 * They are characterized by one local anchor as well as one local axis on each rigid-body.
 *
 * @category Hooks - Joints
 */
export declare const useRevoluteJoint: UseImpulseJoint<RevoluteJointParams, RevoluteImpulseJoint>;
/**
 * The prismatic joint prevents any relative movement between two rigid-bodies, except for relative translations along one axis.
 * It is characterized by one local anchor as well as one local axis on each rigid-body. In 3D, an optional
 * local tangent axis can be specified for each rigid-body.
 *
 * @category Hooks - Joints
 */
export declare const usePrismaticJoint: UseImpulseJoint<PrismaticJointParams, PrismaticImpulseJoint>;
/**
 * The rope joint limits the max distance between two bodies.
 * @category Hooks - Joints
 */
export declare const useRopeJoint: UseImpulseJoint<RopeJointParams, RopeImpulseJoint>;
/**
 * The spring joint applies a force proportional to the distance between two objects.
 * @category Hooks - Joints
 */
export declare const useSpringJoint: UseImpulseJoint<SpringJointParams, SpringImpulseJoint>;
