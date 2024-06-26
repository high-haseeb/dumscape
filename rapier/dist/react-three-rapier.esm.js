import { Vector3 as Vector3$1, Quaternion as Quaternion$1, ActiveEvents, ColliderDesc, EventQueue, RigidBodyDesc } from '@dimforge/rapier3d-compat';
export { CoefficientCombineRule, Collider as RapierCollider, RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat';
import { useFrame, useThree } from '@react-three/fiber';
import React, { useRef, useEffect, memo, useMemo, useContext, useState, createContext, useCallback, forwardRef, Fragment } from 'react';
import { Quaternion, Euler, Vector3, Object3D, Matrix4, BufferAttribute, MathUtils, DynamicDrawUsage } from 'three';
import { suspend } from 'suspend-react';
import { mergeVertices } from 'three-stdlib';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }

  return target;
}

const _quaternion = new Quaternion();
new Euler();
const _vector3 = new Vector3();
new Object3D();
const _matrix4 = new Matrix4();
const _position = new Vector3();
const _rotation = new Quaternion();
const _scale = new Vector3();

const vectorArrayToVector3 = arr => {
  const [x, y, z] = arr;
  return new Vector3(x, y, z);
};
const rapierQuaternionToQuaternion = ({
  x,
  y,
  z,
  w
}) => _quaternion.set(x, y, z, w);
const vector3ToRapierVector = v => {
  if (Array.isArray(v)) {
    return new Vector3$1(v[0], v[1], v[2]);
  } else if (typeof v === "number") {
    return new Vector3$1(v, v, v);
  } else {
    const threeVector3 = v;
    return new Vector3$1(threeVector3.x, threeVector3.y, threeVector3.z);
  }
};
const quaternionToRapierQuaternion = v => {
  if (Array.isArray(v)) {
    return new Quaternion$1(v[0], v[1], v[2], v[3]);
  } else {
    return new Quaternion$1(v.x, v.y, v.z, v.w);
  }
};
const rigidBodyTypeMap = {
  fixed: 1,
  dynamic: 0,
  kinematicPosition: 2,
  kinematicVelocity: 3
};
const rigidBodyTypeFromString = type => rigidBodyTypeMap[type];
const scaleVertices = (vertices, scale) => {
  const scaledVerts = Array.from(vertices);

  for (let i = 0; i < vertices.length / 3; i++) {
    scaledVerts[i * 3] *= scale.x;
    scaledVerts[i * 3 + 1] *= scale.y;
    scaledVerts[i * 3 + 2] *= scale.z;
  }

  return scaledVerts;
};
const vectorToTuple = v => {
  if (!v) return [0];

  if (v instanceof Quaternion) {
    return [v.x, v.y, v.z, v.w];
  }

  if (v instanceof Vector3 || v instanceof Euler) {
    return [v.x, v.y, v.z];
  }

  if (Array.isArray(v)) {
    return v;
  }

  return [v];
};
function useConst(initialValue) {
  const ref = useRef();

  if (ref.current === undefined) {
    ref.current = {
      value: typeof initialValue === "function" ? initialValue() : initialValue
    };
  }

  return ref.current.value;
}

const useRaf = callback => {
  const cb = useRef(callback);
  const raf = useRef(0);
  const lastFrame = useRef(0);
  useEffect(() => {
    cb.current = callback;
  }, [callback]);
  useEffect(() => {
    const loop = () => {
      const now = performance.now();
      const delta = now - lastFrame.current;
      raf.current = requestAnimationFrame(loop);
      cb.current(delta / 1000);
      lastFrame.current = now;
    };

    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, []);
};

const UseFrameStepper = ({
  onStep,
  updatePriority
}) => {
  useFrame((_, dt) => {
    onStep(dt);
  }, updatePriority);
  return null;
};

const RafStepper = ({
  onStep
}) => {
  useRaf(dt => {
    onStep(dt);
  });
  return null;
};

const FrameStepper = ({
  onStep,
  type,
  updatePriority
}) => {
  return type === "independent" ? /*#__PURE__*/React.createElement(RafStepper, {
    onStep: onStep
  }) : /*#__PURE__*/React.createElement(UseFrameStepper, {
    onStep: onStep,
    updatePriority: updatePriority
  });
};

var FrameStepper$1 = /*#__PURE__*/memo(FrameStepper);

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

const _excluded$2 = ["mass", "linearDamping", "angularDamping", "type", "onCollisionEnter", "onCollisionExit", "onIntersectionEnter", "onIntersectionExit", "onContactForce", "children", "canSleep", "ccd", "gravityScale"];
const scaleColliderArgs = (shape, args, scale) => {
  const newArgs = args.slice(); // Heightfield uses a vector

  if (shape === "heightfield") {
    const s = newArgs[3];
    s.x *= scale.x;
    s.x *= scale.y;
    s.x *= scale.z;
    return newArgs;
  } // Trimesh and convex scale the vertices


  if (shape === "trimesh" || shape === "convexHull") {
    newArgs[0] = scaleVertices(newArgs[0], scale);
    return newArgs;
  } // Prepfill with some extra


  const scaleArray = [scale.x, scale.y, scale.z, scale.x, scale.x];
  return newArgs.map((arg, index) => scaleArray[index] * arg);
};
const createColliderFromOptions = (options, world, scale, getRigidBody) => {
  const scaledArgs = scaleColliderArgs(options.shape, options.args, scale); // @ts-ignore

  const desc = ColliderDesc[options.shape](...scaledArgs);
  return world.createCollider(desc, getRigidBody === null || getRigidBody === void 0 ? void 0 : getRigidBody());
};
const immutableColliderOptions = ["shape", "args"];
const massPropertiesConflictError = "Please pick ONLY ONE of the `density`, `mass` and `massProperties` options.";

const setColliderMassOptions = (collider, options) => {
  if (options.density !== undefined) {
    if (options.mass !== undefined || options.massProperties !== undefined) {
      throw new Error(massPropertiesConflictError);
    }

    collider.setDensity(options.density);
    return;
  }

  if (options.mass !== undefined) {
    if (options.massProperties !== undefined) {
      throw new Error(massPropertiesConflictError);
    }

    collider.setMass(options.mass);
    return;
  }

  if (options.massProperties !== undefined) {
    collider.setMassProperties(options.massProperties.mass, options.massProperties.centerOfMass, options.massProperties.principalAngularInertia, options.massProperties.angularInertiaLocalFrame);
  }
};

const mutableColliderOptions = {
  sensor: (collider, value) => {
    collider.setSensor(value);
  },
  collisionGroups: (collider, value) => {
    collider.setCollisionGroups(value);
  },
  solverGroups: (collider, value) => {
    collider.setSolverGroups(value);
  },
  friction: (collider, value) => {
    collider.setFriction(value);
  },
  frictionCombineRule: (collider, value) => {
    collider.setFrictionCombineRule(value);
  },
  restitution: (collider, value) => {
    collider.setRestitution(value);
  },
  restitutionCombineRule: (collider, value) => {
    collider.setRestitutionCombineRule(value);
  },
  // To make sure the options all mutable options are listed
  quaternion: () => {},
  position: () => {},
  rotation: () => {},
  scale: () => {}
};
const mutableColliderOptionKeys = Object.keys(mutableColliderOptions);
const setColliderOptions = (collider, options, states) => {
  const state = states.get(collider.handle);

  if (state) {
    var _state$worldParent;

    // Update collider position based on the object's position
    const parentWorldScale = state.object.parent.getWorldScale(_vector3);
    const parentInvertedWorldMatrix = (_state$worldParent = state.worldParent) === null || _state$worldParent === void 0 ? void 0 : _state$worldParent.matrixWorld.clone().invert();
    state.object.updateWorldMatrix(true, false);

    _matrix4.copy(state.object.matrixWorld);

    if (parentInvertedWorldMatrix) {
      _matrix4.premultiply(parentInvertedWorldMatrix);
    }

    _matrix4.decompose(_position, _rotation, _scale);

    if (collider.parent()) {
      collider.setTranslationWrtParent({
        x: _position.x * parentWorldScale.x,
        y: _position.y * parentWorldScale.y,
        z: _position.z * parentWorldScale.z
      });
      collider.setRotationWrtParent(_rotation);
    } else {
      collider.setTranslation({
        x: _position.x * parentWorldScale.x,
        y: _position.y * parentWorldScale.y,
        z: _position.z * parentWorldScale.z
      });
      collider.setRotation(_rotation);
    }

    mutableColliderOptionKeys.forEach(key => {
      if (key in options) {
        const option = options[key];
        mutableColliderOptions[key](collider, // @ts-ignore Option does not want to fit into the function, but it will
        option, options);
      }
    }); // handle mass separately, because the assignments
    // are exclusive.

    setColliderMassOptions(collider, options);
  }
};
const useUpdateColliderOptions = (getCollider, props, states) => {
  // TODO: Improve this, split each prop into its own effect
  const mutablePropsAsFlatArray = useMemo(() => mutableColliderOptionKeys.flatMap(key => {
    return vectorToTuple(props[key]);
  }), [props]);
  useEffect(() => {
    const collider = getCollider();
    setColliderOptions(collider, props, states);
  }, [...mutablePropsAsFlatArray, getCollider]);
};

const isChildOfMeshCollider = child => {
  let flag = false;
  child.traverseAncestors(a => {
    if (a.userData.r3RapierType === "MeshCollider") flag = true;
  });
  return flag;
};

const createColliderState = (collider, object, rigidBodyObject) => {
  return {
    collider,
    worldParent: rigidBodyObject || undefined,
    object
  };
};
const autoColliderMap = {
  cuboid: "cuboid",
  ball: "ball",
  hull: "convexHull",
  trimesh: "trimesh"
};
const createColliderPropsFromChildren = ({
  object,
  ignoreMeshColliders: _ignoreMeshColliders = true,
  options
}) => {
  const childColliderProps = [];
  object.updateWorldMatrix(true, false);
  const invertedParentMatrixWorld = object.matrixWorld.clone().invert();

  const colliderFromChild = child => {
    if ("isMesh" in child) {
      if (_ignoreMeshColliders && isChildOfMeshCollider(child)) return;
      const worldScale = child.getWorldScale(_scale);
      const shape = autoColliderMap[options.colliders || "cuboid"];
      child.updateWorldMatrix(true, false);

      _matrix4.copy(child.matrixWorld).premultiply(invertedParentMatrixWorld).decompose(_position, _rotation, _scale);

      const rotationEuler = new Euler().setFromQuaternion(_rotation, "XYZ");
      const {
        geometry
      } = child;
      const {
        args,
        offset
      } = getColliderArgsFromGeometry(geometry, options.colliders || "cuboid");

      const colliderProps = _objectSpread2(_objectSpread2({}, cleanRigidBodyPropsForCollider(options)), {}, {
        args: args,
        shape: shape,
        rotation: [rotationEuler.x, rotationEuler.y, rotationEuler.z],
        position: [_position.x + offset.x * worldScale.x, _position.y + offset.y * worldScale.y, _position.z + offset.z * worldScale.z],
        scale: [worldScale.x, worldScale.y, worldScale.z]
      });

      childColliderProps.push(colliderProps);
    }
  };

  if (options.includeInvisible) {
    object.traverse(colliderFromChild);
  } else {
    object.traverseVisible(colliderFromChild);
  }

  return childColliderProps;
};
const getColliderArgsFromGeometry = (geometry, colliders) => {
  switch (colliders) {
    case "cuboid":
      {
        geometry.computeBoundingBox();
        const {
          boundingBox
        } = geometry;
        const size = boundingBox.getSize(new Vector3());
        return {
          args: [size.x / 2, size.y / 2, size.z / 2],
          offset: boundingBox.getCenter(new Vector3())
        };
      }

    case "ball":
      {
        geometry.computeBoundingSphere();
        const {
          boundingSphere
        } = geometry;
        const radius = boundingSphere.radius;
        return {
          args: [radius],
          offset: boundingSphere.center
        };
      }

    case "trimesh":
      {
        var _clonedGeometry$index;

        const clonedGeometry = geometry.index ? geometry.clone() : mergeVertices(geometry);
        return {
          args: [clonedGeometry.attributes.position.array, (_clonedGeometry$index = clonedGeometry.index) === null || _clonedGeometry$index === void 0 ? void 0 : _clonedGeometry$index.array],
          offset: new Vector3()
        };
      }

    case "hull":
      {
        const g = geometry.clone();
        return {
          args: [g.attributes.position.array],
          offset: new Vector3()
        };
      }
  }

  return {
    args: [],
    offset: new Vector3()
  };
};
const getActiveCollisionEventsFromProps = props => {
  return {
    collision: !!(props !== null && props !== void 0 && props.onCollisionEnter || props !== null && props !== void 0 && props.onCollisionExit || props !== null && props !== void 0 && props.onIntersectionEnter || props !== null && props !== void 0 && props.onIntersectionExit),
    contactForce: !!(props !== null && props !== void 0 && props.onContactForce)
  };
};
const useColliderEvents = (getCollider, props, events,
/**
 * The RigidBody can pass down active events to the collider without attaching the event listners
 */
activeEvents = {}) => {
  const {
    onCollisionEnter,
    onCollisionExit,
    onIntersectionEnter,
    onIntersectionExit,
    onContactForce
  } = props;
  useEffect(() => {
    const collider = getCollider();

    if (collider) {
      const {
        collision: collisionEventsActive,
        contactForce: contactForceEventsActive
      } = getActiveCollisionEventsFromProps(props);
      const hasCollisionEvent = collisionEventsActive || activeEvents.collision;
      const hasContactForceEvent = contactForceEventsActive || activeEvents.contactForce;

      if (hasCollisionEvent && hasContactForceEvent) {
        collider.setActiveEvents(ActiveEvents.COLLISION_EVENTS | ActiveEvents.CONTACT_FORCE_EVENTS);
      } else if (hasCollisionEvent) {
        collider.setActiveEvents(ActiveEvents.COLLISION_EVENTS);
      } else if (hasContactForceEvent) {
        collider.setActiveEvents(ActiveEvents.CONTACT_FORCE_EVENTS);
      }

      events.set(collider.handle, {
        onCollisionEnter,
        onCollisionExit,
        onIntersectionEnter,
        onIntersectionExit,
        onContactForce
      });
    }

    return () => {
      if (collider) {
        events.delete(collider.handle);
      }
    };
  }, [onCollisionEnter, onCollisionExit, onIntersectionEnter, onIntersectionExit, onContactForce, activeEvents]);
};
const cleanRigidBodyPropsForCollider = (props = {}) => {
  const rest = _objectWithoutProperties(props, _excluded$2);

  return rest;
};

const useMutableCallback = fn => {
  const ref = useRef(fn);
  useEffect(() => {
    ref.current = fn;
  }, [fn]);
  return ref;
}; // External hooks

/**
 * Exposes the Rapier context, and world
 * @category Hooks
 */


const useRapier = () => {
  const rapier = useContext(rapierContext);
  if (!rapier) throw new Error("react-three-rapier: useRapier must be used within <Physics />!");
  return rapier;
};
/**
 * Registers a callback to be called before the physics step
 * @category Hooks
 */

const useBeforePhysicsStep = callback => {
  const {
    beforeStepCallbacks
  } = useRapier();
  const ref = useMutableCallback(callback);
  useEffect(() => {
    beforeStepCallbacks.add(ref);
    return () => {
      beforeStepCallbacks.delete(ref);
    };
  }, []);
};
/**
 * Registers a callback to be called after the physics step
 * @category Hooks
 */

const useAfterPhysicsStep = callback => {
  const {
    afterStepCallbacks
  } = useRapier();
  const ref = useMutableCallback(callback);
  useEffect(() => {
    afterStepCallbacks.add(ref);
    return () => {
      afterStepCallbacks.delete(ref);
    };
  }, []);
}; // Internal hooks

/**
 * @internal
 */

const useChildColliderProps = (ref, options, ignoreMeshColliders = true) => {
  const [colliderProps, setColliderProps] = useState([]);
  useEffect(() => {
    const object = ref.current;

    if (object && options.colliders !== false) {
      setColliderProps(createColliderPropsFromChildren({
        object: ref.current,
        options,
        ignoreMeshColliders
      }));
    }
  }, [options.colliders]);
  return colliderProps;
};

const Debug = /*#__PURE__*/memo(() => {
  const {
    world
  } = useRapier();
  const ref = useRef(null);
  useFrame(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const buffers = world.debugRender();
    mesh.geometry.setAttribute("position", new BufferAttribute(buffers.vertices, 3));
    mesh.geometry.setAttribute("color", new BufferAttribute(buffers.colors, 4));
  });
  return /*#__PURE__*/React.createElement("group", null, /*#__PURE__*/React.createElement("lineSegments", {
    ref: ref,
    frustumCulled: false
  }, /*#__PURE__*/React.createElement("lineBasicMaterial", {
    color: 0xffffff,
    vertexColors: true
  }), /*#__PURE__*/React.createElement("bufferGeometry", null)));
});

/**
 * Creates a proxy that will create a singleton instance of the given class
 * when a property is accessed, and not before.
 *
 * @returns A proxy and a reset function, so that the instance can created again
 */
const createSingletonProxy = createInstance => {
  let instance;
  const handler = {
    get(target, prop) {
      if (!instance) {
        instance = createInstance();
      }

      return Reflect.get(instance, prop);
    },

    set(target, prop, value) {
      if (!instance) {
        instance = createInstance();
      }

      return Reflect.set(instance, prop, value);
    }

  };
  const proxy = new Proxy({}, handler);

  const reset = () => {
    instance = undefined;
  };

  const set = newInstance => {
    instance = newInstance;
  };
  /**
   * Return the proxy and a reset function
   */


  return {
    proxy,
    reset,
    set
  };
};

const rapierContext = /*#__PURE__*/createContext(undefined);

const getCollisionPayloadFromSource = (target, other) => {
  var _target$collider$stat, _target$rigidBody$sta, _other$collider$state, _other$rigidBody$stat, _other$collider$state2, _other$rigidBody$stat2;

  return {
    target: {
      rigidBody: target.rigidBody.object,
      collider: target.collider.object,
      colliderObject: (_target$collider$stat = target.collider.state) === null || _target$collider$stat === void 0 ? void 0 : _target$collider$stat.object,
      rigidBodyObject: (_target$rigidBody$sta = target.rigidBody.state) === null || _target$rigidBody$sta === void 0 ? void 0 : _target$rigidBody$sta.object
    },
    other: {
      rigidBody: other.rigidBody.object,
      collider: other.collider.object,
      colliderObject: (_other$collider$state = other.collider.state) === null || _other$collider$state === void 0 ? void 0 : _other$collider$state.object,
      rigidBodyObject: (_other$rigidBody$stat = other.rigidBody.state) === null || _other$rigidBody$stat === void 0 ? void 0 : _other$rigidBody$stat.object
    },
    rigidBody: other.rigidBody.object,
    collider: other.collider.object,
    colliderObject: (_other$collider$state2 = other.collider.state) === null || _other$collider$state2 === void 0 ? void 0 : _other$collider$state2.object,
    rigidBodyObject: (_other$rigidBody$stat2 = other.rigidBody.state) === null || _other$rigidBody$stat2 === void 0 ? void 0 : _other$rigidBody$stat2.object
  };
};

const importRapier = async () => {
  let r = await import('@dimforge/rapier3d-compat');
  await r.init();
  return r;
};

/**
 * The main physics component used to create a physics world.
 * @category Components
 */
const Physics = props => {
  const {
    colliders = "cuboid",
    children,
    timeStep = 1 / 60,
    paused = false,
    interpolate = true,
    updatePriority,
    updateLoop = "follow",
    debug = false,
    gravity = [0, -9.81, 0],
    allowedLinearError = 0.001,
    predictionDistance = 0.002,
    numSolverIterations = 4,
    numAdditionalFrictionIterations = 4,
    numInternalPgsIterations = 1,
    minIslandSize = 128,
    maxCcdSubsteps = 1,
    erp = 0.8
  } = props;
  const rapier = suspend(importRapier, ["@react-thee/rapier", importRapier]);
  const {
    invalidate
  } = useThree();
  const rigidBodyStates = useConst(() => new Map());
  const colliderStates = useConst(() => new Map());
  const rigidBodyEvents = useConst(() => new Map());
  const colliderEvents = useConst(() => new Map());
  const eventQueue = useConst(() => new EventQueue(false));
  const beforeStepCallbacks = useConst(() => new Set());
  const afterStepCallbacks = useConst(() => new Set());
  /**
   * Initiate the world
   * This creates a singleton proxy, so that the world is only created when
   * something within it is accessed.
   */

  const {
    proxy: worldProxy,
    reset: resetWorldProxy,
    set: setWorldProxy
  } = useConst(() => createSingletonProxy(() => new rapier.World(vectorArrayToVector3(gravity))));
  useEffect(() => {
    return () => {
      worldProxy.free();
      resetWorldProxy();
    };
  }, []); // Update mutable props

  useEffect(() => {
    worldProxy.gravity = vector3ToRapierVector(gravity);
    worldProxy.integrationParameters.numSolverIterations = numSolverIterations;
    worldProxy.integrationParameters.numAdditionalFrictionIterations = numAdditionalFrictionIterations;
    worldProxy.integrationParameters.numInternalPgsIterations = numInternalPgsIterations;
    worldProxy.integrationParameters.allowedLinearError = allowedLinearError;
    worldProxy.integrationParameters.minIslandSize = minIslandSize;
    worldProxy.integrationParameters.maxCcdSubsteps = maxCcdSubsteps;
    worldProxy.integrationParameters.predictionDistance = predictionDistance;
    worldProxy.integrationParameters.erp = erp;
  }, [worldProxy, ...gravity, numSolverIterations, numAdditionalFrictionIterations, numInternalPgsIterations, allowedLinearError, minIslandSize, maxCcdSubsteps, predictionDistance, erp]);
  const getSourceFromColliderHandle = useCallback(handle => {
    var _collider$parent;

    const collider = worldProxy.getCollider(handle);
    const colEvents = colliderEvents.get(handle);
    const colliderState = colliderStates.get(handle);
    const rigidBodyHandle = collider === null || collider === void 0 ? void 0 : (_collider$parent = collider.parent()) === null || _collider$parent === void 0 ? void 0 : _collider$parent.handle;
    const rigidBody = rigidBodyHandle !== undefined ? worldProxy.getRigidBody(rigidBodyHandle) : undefined;
    const rbEvents = rigidBody && rigidBodyHandle !== undefined ? rigidBodyEvents.get(rigidBodyHandle) : undefined;
    const rigidBodyState = rigidBodyHandle !== undefined ? rigidBodyStates.get(rigidBodyHandle) : undefined;
    const source = {
      collider: {
        object: collider,
        events: colEvents,
        state: colliderState
      },
      rigidBody: {
        object: rigidBody,
        events: rbEvents,
        state: rigidBodyState
      }
    };
    return source;
  }, []);
  const [steppingState] = useState({
    previousState: {},
    accumulator: 0
  });
  const step = useCallback(dt => {
    const world = worldProxy;
    /* Check if the timestep is supposed to be variable. We'll do this here
      once so we don't have to string-check every frame. */

    const timeStepVariable = timeStep === "vary";
    /**
     * Fixed timeStep simulation progression
     * @see https://gafferongames.com/post/fix_your_timestep/
     */

    const clampedDelta = MathUtils.clamp(dt, 0, 0.5);

    const stepWorld = delta => {
      // Trigger beforeStep callbacks
      beforeStepCallbacks.forEach(callback => {
        callback.current(world);
      });
      world.timestep = delta;
      world.step(eventQueue); // Trigger afterStep callbacks

      afterStepCallbacks.forEach(callback => {
        callback.current(world);
      });
    };

    if (timeStepVariable) {
      stepWorld(clampedDelta);
    } else {
      // don't step time forwards if paused
      // Increase accumulator
      steppingState.accumulator += clampedDelta;

      while (steppingState.accumulator >= timeStep) {
        // Set up previous state
        // needed for accurate interpolations if the world steps more than once
        if (interpolate) {
          steppingState.previousState = {};
          world.forEachRigidBody(body => {
            steppingState.previousState[body.handle] = {
              position: body.translation(),
              rotation: body.rotation()
            };
          });
        }

        stepWorld(timeStep);
        steppingState.accumulator -= timeStep;
      }
    }

    const interpolationAlpha = timeStepVariable || !interpolate || paused ? 1 : steppingState.accumulator / timeStep; // Update meshes

    rigidBodyStates.forEach((state, handle) => {
      const rigidBody = world.getRigidBody(handle);
      const events = rigidBodyEvents.get(handle);

      if (events !== null && events !== void 0 && events.onSleep || events !== null && events !== void 0 && events.onWake) {
        if (rigidBody.isSleeping() && !state.isSleeping) {
          var _events$onSleep;

          events === null || events === void 0 ? void 0 : (_events$onSleep = events.onSleep) === null || _events$onSleep === void 0 ? void 0 : _events$onSleep.call(events);
        }

        if (!rigidBody.isSleeping() && state.isSleeping) {
          var _events$onWake;

          events === null || events === void 0 ? void 0 : (_events$onWake = events.onWake) === null || _events$onWake === void 0 ? void 0 : _events$onWake.call(events);
        }

        state.isSleeping = rigidBody.isSleeping();
      }

      if (!rigidBody || rigidBody.isSleeping() && !("isInstancedMesh" in state.object) || !state.setMatrix) {
        return;
      } // New states


      let t = rigidBody.translation();
      let r = rigidBody.rotation();
      let previousState = steppingState.previousState[handle];

      if (previousState) {
        // Get previous simulated world position
        _matrix4.compose(previousState.position, rapierQuaternionToQuaternion(previousState.rotation), state.scale).premultiply(state.invertedWorldMatrix).decompose(_position, _rotation, _scale); // Apply previous tick position


        if (state.meshType == "mesh") {
          state.object.position.copy(_position);
          state.object.quaternion.copy(_rotation);
        }
      } // Get new position


      _matrix4.compose(t, rapierQuaternionToQuaternion(r), state.scale).premultiply(state.invertedWorldMatrix).decompose(_position, _rotation, _scale);

      if (state.meshType == "instancedMesh") {
        state.setMatrix(_matrix4);
      } else {
        // Interpolate to new position
        state.object.position.lerp(_position, interpolationAlpha);
        state.object.quaternion.slerp(_rotation, interpolationAlpha);
      }
    });
    eventQueue.drainCollisionEvents((handle1, handle2, started) => {
      const source1 = getSourceFromColliderHandle(handle1);
      const source2 = getSourceFromColliderHandle(handle2); // Collision Events

      if (!(source1 !== null && source1 !== void 0 && source1.collider.object) || !(source2 !== null && source2 !== void 0 && source2.collider.object)) {
        return;
      }

      const collisionPayload1 = getCollisionPayloadFromSource(source1, source2);
      const collisionPayload2 = getCollisionPayloadFromSource(source2, source1);

      if (started) {
        world.contactPair(source1.collider.object, source2.collider.object, (manifold, flipped) => {
          var _source1$rigidBody$ev, _source1$rigidBody$ev2, _source2$rigidBody$ev, _source2$rigidBody$ev2, _source1$collider$eve, _source1$collider$eve2, _source2$collider$eve, _source2$collider$eve2;

          /* RigidBody events */
          (_source1$rigidBody$ev = source1.rigidBody.events) === null || _source1$rigidBody$ev === void 0 ? void 0 : (_source1$rigidBody$ev2 = _source1$rigidBody$ev.onCollisionEnter) === null || _source1$rigidBody$ev2 === void 0 ? void 0 : _source1$rigidBody$ev2.call(_source1$rigidBody$ev, _objectSpread2(_objectSpread2({}, collisionPayload1), {}, {
            manifold,
            flipped
          }));
          (_source2$rigidBody$ev = source2.rigidBody.events) === null || _source2$rigidBody$ev === void 0 ? void 0 : (_source2$rigidBody$ev2 = _source2$rigidBody$ev.onCollisionEnter) === null || _source2$rigidBody$ev2 === void 0 ? void 0 : _source2$rigidBody$ev2.call(_source2$rigidBody$ev, _objectSpread2(_objectSpread2({}, collisionPayload2), {}, {
            manifold,
            flipped
          }));
          /* Collider events */

          (_source1$collider$eve = source1.collider.events) === null || _source1$collider$eve === void 0 ? void 0 : (_source1$collider$eve2 = _source1$collider$eve.onCollisionEnter) === null || _source1$collider$eve2 === void 0 ? void 0 : _source1$collider$eve2.call(_source1$collider$eve, _objectSpread2(_objectSpread2({}, collisionPayload1), {}, {
            manifold,
            flipped
          }));
          (_source2$collider$eve = source2.collider.events) === null || _source2$collider$eve === void 0 ? void 0 : (_source2$collider$eve2 = _source2$collider$eve.onCollisionEnter) === null || _source2$collider$eve2 === void 0 ? void 0 : _source2$collider$eve2.call(_source2$collider$eve, _objectSpread2(_objectSpread2({}, collisionPayload2), {}, {
            manifold,
            flipped
          }));
        });
      } else {
        var _source1$rigidBody$ev3, _source1$rigidBody$ev4, _source2$rigidBody$ev3, _source2$rigidBody$ev4, _source1$collider$eve3, _source1$collider$eve4, _source2$collider$eve3, _source2$collider$eve4;

        (_source1$rigidBody$ev3 = source1.rigidBody.events) === null || _source1$rigidBody$ev3 === void 0 ? void 0 : (_source1$rigidBody$ev4 = _source1$rigidBody$ev3.onCollisionExit) === null || _source1$rigidBody$ev4 === void 0 ? void 0 : _source1$rigidBody$ev4.call(_source1$rigidBody$ev3, collisionPayload1);
        (_source2$rigidBody$ev3 = source2.rigidBody.events) === null || _source2$rigidBody$ev3 === void 0 ? void 0 : (_source2$rigidBody$ev4 = _source2$rigidBody$ev3.onCollisionExit) === null || _source2$rigidBody$ev4 === void 0 ? void 0 : _source2$rigidBody$ev4.call(_source2$rigidBody$ev3, collisionPayload2);
        (_source1$collider$eve3 = source1.collider.events) === null || _source1$collider$eve3 === void 0 ? void 0 : (_source1$collider$eve4 = _source1$collider$eve3.onCollisionExit) === null || _source1$collider$eve4 === void 0 ? void 0 : _source1$collider$eve4.call(_source1$collider$eve3, collisionPayload1);
        (_source2$collider$eve3 = source2.collider.events) === null || _source2$collider$eve3 === void 0 ? void 0 : (_source2$collider$eve4 = _source2$collider$eve3.onCollisionExit) === null || _source2$collider$eve4 === void 0 ? void 0 : _source2$collider$eve4.call(_source2$collider$eve3, collisionPayload2);
      } // Sensor Intersections


      if (started) {
        if (world.intersectionPair(source1.collider.object, source2.collider.object)) {
          var _source1$rigidBody$ev5, _source1$rigidBody$ev6, _source2$rigidBody$ev5, _source2$rigidBody$ev6, _source1$collider$eve5, _source1$collider$eve6, _source2$collider$eve5, _source2$collider$eve6;

          (_source1$rigidBody$ev5 = source1.rigidBody.events) === null || _source1$rigidBody$ev5 === void 0 ? void 0 : (_source1$rigidBody$ev6 = _source1$rigidBody$ev5.onIntersectionEnter) === null || _source1$rigidBody$ev6 === void 0 ? void 0 : _source1$rigidBody$ev6.call(_source1$rigidBody$ev5, collisionPayload1);
          (_source2$rigidBody$ev5 = source2.rigidBody.events) === null || _source2$rigidBody$ev5 === void 0 ? void 0 : (_source2$rigidBody$ev6 = _source2$rigidBody$ev5.onIntersectionEnter) === null || _source2$rigidBody$ev6 === void 0 ? void 0 : _source2$rigidBody$ev6.call(_source2$rigidBody$ev5, collisionPayload2);
          (_source1$collider$eve5 = source1.collider.events) === null || _source1$collider$eve5 === void 0 ? void 0 : (_source1$collider$eve6 = _source1$collider$eve5.onIntersectionEnter) === null || _source1$collider$eve6 === void 0 ? void 0 : _source1$collider$eve6.call(_source1$collider$eve5, collisionPayload1);
          (_source2$collider$eve5 = source2.collider.events) === null || _source2$collider$eve5 === void 0 ? void 0 : (_source2$collider$eve6 = _source2$collider$eve5.onIntersectionEnter) === null || _source2$collider$eve6 === void 0 ? void 0 : _source2$collider$eve6.call(_source2$collider$eve5, collisionPayload2);
        }
      } else {
        var _source1$rigidBody$ev7, _source1$rigidBody$ev8, _source2$rigidBody$ev7, _source2$rigidBody$ev8, _source1$collider$eve7, _source1$collider$eve8, _source2$collider$eve7, _source2$collider$eve8;

        (_source1$rigidBody$ev7 = source1.rigidBody.events) === null || _source1$rigidBody$ev7 === void 0 ? void 0 : (_source1$rigidBody$ev8 = _source1$rigidBody$ev7.onIntersectionExit) === null || _source1$rigidBody$ev8 === void 0 ? void 0 : _source1$rigidBody$ev8.call(_source1$rigidBody$ev7, collisionPayload1);
        (_source2$rigidBody$ev7 = source2.rigidBody.events) === null || _source2$rigidBody$ev7 === void 0 ? void 0 : (_source2$rigidBody$ev8 = _source2$rigidBody$ev7.onIntersectionExit) === null || _source2$rigidBody$ev8 === void 0 ? void 0 : _source2$rigidBody$ev8.call(_source2$rigidBody$ev7, collisionPayload2);
        (_source1$collider$eve7 = source1.collider.events) === null || _source1$collider$eve7 === void 0 ? void 0 : (_source1$collider$eve8 = _source1$collider$eve7.onIntersectionExit) === null || _source1$collider$eve8 === void 0 ? void 0 : _source1$collider$eve8.call(_source1$collider$eve7, collisionPayload1);
        (_source2$collider$eve7 = source2.collider.events) === null || _source2$collider$eve7 === void 0 ? void 0 : (_source2$collider$eve8 = _source2$collider$eve7.onIntersectionExit) === null || _source2$collider$eve8 === void 0 ? void 0 : _source2$collider$eve8.call(_source2$collider$eve7, collisionPayload2);
      }
    });
    eventQueue.drainContactForceEvents(event => {
      var _source1$rigidBody$ev9, _source1$rigidBody$ev10, _source2$rigidBody$ev9, _source2$rigidBody$ev10, _source1$collider$eve9, _source1$collider$eve10, _source2$collider$eve9, _source2$collider$eve10;

      const source1 = getSourceFromColliderHandle(event.collider1());
      const source2 = getSourceFromColliderHandle(event.collider2()); // Collision Events

      if (!(source1 !== null && source1 !== void 0 && source1.collider.object) || !(source2 !== null && source2 !== void 0 && source2.collider.object)) {
        return;
      }

      const collisionPayload1 = getCollisionPayloadFromSource(source1, source2);
      const collisionPayload2 = getCollisionPayloadFromSource(source2, source1);
      (_source1$rigidBody$ev9 = source1.rigidBody.events) === null || _source1$rigidBody$ev9 === void 0 ? void 0 : (_source1$rigidBody$ev10 = _source1$rigidBody$ev9.onContactForce) === null || _source1$rigidBody$ev10 === void 0 ? void 0 : _source1$rigidBody$ev10.call(_source1$rigidBody$ev9, _objectSpread2(_objectSpread2({}, collisionPayload1), {}, {
        totalForce: event.totalForce(),
        totalForceMagnitude: event.totalForceMagnitude(),
        maxForceDirection: event.maxForceDirection(),
        maxForceMagnitude: event.maxForceMagnitude()
      }));
      (_source2$rigidBody$ev9 = source2.rigidBody.events) === null || _source2$rigidBody$ev9 === void 0 ? void 0 : (_source2$rigidBody$ev10 = _source2$rigidBody$ev9.onContactForce) === null || _source2$rigidBody$ev10 === void 0 ? void 0 : _source2$rigidBody$ev10.call(_source2$rigidBody$ev9, _objectSpread2(_objectSpread2({}, collisionPayload2), {}, {
        totalForce: event.totalForce(),
        totalForceMagnitude: event.totalForceMagnitude(),
        maxForceDirection: event.maxForceDirection(),
        maxForceMagnitude: event.maxForceMagnitude()
      }));
      (_source1$collider$eve9 = source1.collider.events) === null || _source1$collider$eve9 === void 0 ? void 0 : (_source1$collider$eve10 = _source1$collider$eve9.onContactForce) === null || _source1$collider$eve10 === void 0 ? void 0 : _source1$collider$eve10.call(_source1$collider$eve9, _objectSpread2(_objectSpread2({}, collisionPayload1), {}, {
        totalForce: event.totalForce(),
        totalForceMagnitude: event.totalForceMagnitude(),
        maxForceDirection: event.maxForceDirection(),
        maxForceMagnitude: event.maxForceMagnitude()
      }));
      (_source2$collider$eve9 = source2.collider.events) === null || _source2$collider$eve9 === void 0 ? void 0 : (_source2$collider$eve10 = _source2$collider$eve9.onContactForce) === null || _source2$collider$eve10 === void 0 ? void 0 : _source2$collider$eve10.call(_source2$collider$eve9, _objectSpread2(_objectSpread2({}, collisionPayload2), {}, {
        totalForce: event.totalForce(),
        totalForceMagnitude: event.totalForceMagnitude(),
        maxForceDirection: event.maxForceDirection(),
        maxForceMagnitude: event.maxForceMagnitude()
      }));
    });
    world.forEachActiveRigidBody(() => {
      invalidate();
    });
  }, [paused, timeStep, interpolate, worldProxy]);
  const context = useMemo(() => ({
    rapier,
    world: worldProxy,
    setWorld: world => {
      setWorldProxy(world);
    },
    physicsOptions: {
      colliders,
      gravity
    },
    rigidBodyStates,
    colliderStates,
    rigidBodyEvents,
    colliderEvents,
    beforeStepCallbacks,
    afterStepCallbacks,
    isPaused: paused,
    isDebug: debug,
    step
  }), [paused, step, debug, colliders, gravity]);
  const stepCallback = useCallback(delta => {
    if (!paused) {
      step(delta);
    }
  }, [paused, step]);
  return /*#__PURE__*/React.createElement(rapierContext.Provider, {
    value: context
  }, /*#__PURE__*/React.createElement(FrameStepper$1, {
    onStep: stepCallback,
    type: updateLoop,
    updatePriority: updatePriority
  }), debug && /*#__PURE__*/React.createElement(Debug, null), children);
};

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };
  return _extends.apply(this, arguments);
}

/**
 * Initiate an instance and return a safe getter
 */

const useImperativeInstance = (createFn, destroyFn, dependencyList) => {
  const ref = useRef();
  const getInstance = useCallback(() => {
    if (!ref.current) {
      ref.current = createFn();
    }

    return ref.current;
  }, dependencyList);
  useEffect(() => {
    // Save the destroy function and instance
    const instance = getInstance();

    const destroy = () => destroyFn(instance);

    return () => {
      destroy();
      ref.current = undefined;
    };
  }, [getInstance]);
  return getInstance;
};

/**
 * Takes an object resembling a Vector3 and returs a Three.Vector3
 * @category Math helpers
 */

const vec3 = ({
  x,
  y,
  z
} = {
  x: 0,
  y: 0,
  z: 0
}) => {
  return new Vector3(x, y, z);
};
/**
 * Takes an object resembling a Quaternion and returs a Three.Quaternion
 * @category Math helpers
 */

const quat = ({
  x,
  y,
  z,
  w
} = {
  x: 0,
  y: 0,
  z: 0,
  w: 1
}) => {
  return new Quaternion(x, y, z, w);
};
/**
 * Takes an object resembling an Euler and returs a Three.Euler
 * @category Math helpers
 */

const euler = ({
  x,
  y,
  z
} = {
  x: 0,
  y: 0,
  z: 0
}) => {
  return new Euler(x, y, z);
};

const useForwardedRef = (forwardedRef, defaultValue = null) => {
  const innerRef = useRef(defaultValue); // Update the forwarded ref when the inner ref changes

  if (forwardedRef && typeof forwardedRef !== "function") {
    if (!forwardedRef.current) {
      forwardedRef.current = innerRef.current;
    }

    return forwardedRef;
  }

  return innerRef;
};

/**
 * A collider is a shape that can be attached to a rigid body to define its physical properties.
 * @internal
 */
const AnyCollider = /*#__PURE__*/memo( /*#__PURE__*/forwardRef((props, forwardedRef) => {
  const {
    children,
    position,
    rotation,
    quaternion,
    scale,
    name
  } = props;
  const {
    world,
    colliderEvents,
    colliderStates
  } = useRapier();
  const rigidBodyContext = useRigidBodyContext();
  const colliderRef = useForwardedRef(forwardedRef);
  const objectRef = useRef(null); // We spread the props out here to make sure that the ref is updated when the props change.

  const immutablePropArray = immutableColliderOptions.flatMap(key => Array.isArray(props[key]) ? [...props[key]] : props[key]);
  const getInstance = useImperativeInstance(() => {
    const worldScale = objectRef.current.getWorldScale(vec3());
    const collider = createColliderFromOptions(props, world, worldScale, rigidBodyContext === null || rigidBodyContext === void 0 ? void 0 : rigidBodyContext.getRigidBody);

    if (typeof forwardedRef == "function") {
      forwardedRef(collider);
    }

    colliderRef.current = collider;
    return collider;
  }, collider => {
    if (world.getCollider(collider.handle)) {
      world.removeCollider(collider, true);
    }
  }, [...immutablePropArray, rigidBodyContext]);
  useEffect(() => {
    const collider = getInstance();
    colliderStates.set(collider.handle, createColliderState(collider, objectRef.current, rigidBodyContext === null || rigidBodyContext === void 0 ? void 0 : rigidBodyContext.ref.current));
    return () => {
      colliderStates.delete(collider.handle);
    };
  }, [getInstance]);
  const mergedProps = useMemo(() => {
    return _objectSpread2(_objectSpread2({}, cleanRigidBodyPropsForCollider(rigidBodyContext === null || rigidBodyContext === void 0 ? void 0 : rigidBodyContext.options)), props);
  }, [props, rigidBodyContext === null || rigidBodyContext === void 0 ? void 0 : rigidBodyContext.options]);
  useUpdateColliderOptions(getInstance, mergedProps, colliderStates);
  useColliderEvents(getInstance, mergedProps, colliderEvents, getActiveCollisionEventsFromProps(rigidBodyContext === null || rigidBodyContext === void 0 ? void 0 : rigidBodyContext.options));
  return /*#__PURE__*/React.createElement("object3D", {
    position: position,
    rotation: rotation,
    quaternion: quaternion,
    scale: scale,
    ref: objectRef,
    name: name
  }, children);
}));

/**
 * A cuboid collider shape
 * @category Colliders
 */
const CuboidCollider = /*#__PURE__*/React.forwardRef((props, ref) => {
  return /*#__PURE__*/React.createElement(AnyCollider, _extends({}, props, {
    shape: "cuboid",
    ref: ref
  }));
});
CuboidCollider.displayName = "CuboidCollider";

/**
 * A round cuboid collider shape
 * @category Colliders
 */
const RoundCuboidCollider = /*#__PURE__*/React.forwardRef((props, ref) => /*#__PURE__*/React.createElement(AnyCollider, _extends({}, props, {
  shape: "roundCuboid",
  ref: ref
})));
RoundCuboidCollider.displayName = "RoundCuboidCollider";

/**
 * A ball collider shape
 * @category Colliders
 */
const BallCollider = /*#__PURE__*/React.forwardRef((props, ref) => /*#__PURE__*/React.createElement(AnyCollider, _extends({}, props, {
  shape: "ball",
  ref: ref
})));
BallCollider.displayName = "BallCollider";

/**
 * A capsule collider shape
 * @category Colliders
 */
const CapsuleCollider = /*#__PURE__*/React.forwardRef((props, ref) => /*#__PURE__*/React.createElement(AnyCollider, _extends({}, props, {
  shape: "capsule",
  ref: ref
})));
CapsuleCollider.displayName = "CapsuleCollider";

/**
 * A heightfield collider shape
 * @category Colliders
 */
const HeightfieldCollider = /*#__PURE__*/React.forwardRef((props, ref) => /*#__PURE__*/React.createElement(AnyCollider, _extends({}, props, {
  shape: "heightfield",
  ref: ref
})));
HeightfieldCollider.displayName = "HeightfieldCollider";

/**
 * A trimesh collider shape
 * @category Colliders
 */
const TrimeshCollider = /*#__PURE__*/React.forwardRef((props, ref) => /*#__PURE__*/React.createElement(AnyCollider, _extends({}, props, {
  shape: "trimesh",
  ref: ref
})));
TrimeshCollider.displayName = "TrimeshCollider";

/**
 * A cone collider shape
 * @category Colliders
 */
const ConeCollider = /*#__PURE__*/React.forwardRef((props, ref) => /*#__PURE__*/React.createElement(AnyCollider, _extends({}, props, {
  shape: "cone",
  ref: ref
})));
ConeCollider.displayName = "ConeCollider";

/**
 * A round cylinder collider shape
 * @category Colliders
 */
const RoundConeCollider = /*#__PURE__*/React.forwardRef((props, ref) => /*#__PURE__*/React.createElement(AnyCollider, _extends({}, props, {
  shape: "roundCone",
  ref: ref
})));
RoundConeCollider.displayName = "RoundConeCollider";

/**
 * A cylinder collider shape
 * @category Colliders
 */
const CylinderCollider = /*#__PURE__*/React.forwardRef((props, ref) => /*#__PURE__*/React.createElement(AnyCollider, _extends({}, props, {
  shape: "cylinder",
  ref: ref
})));
CylinderCollider.displayName = "CylinderCollider";

/**
 * A round cylinder collider shape
 * @category Colliders
 */
const RoundCylinderCollider = /*#__PURE__*/React.forwardRef((props, ref) => /*#__PURE__*/React.createElement(AnyCollider, _extends({}, props, {
  shape: "roundCylinder",
  ref: ref
})));
CylinderCollider.displayName = "RoundCylinderCollider";

/**
 * A convex hull collider shape
 * @category Colliders
 */
const ConvexHullCollider = /*#__PURE__*/React.forwardRef((props, ref) => /*#__PURE__*/React.createElement(AnyCollider, _extends({}, props, {
  shape: "convexHull",
  ref: ref
})));
ConvexHullCollider.displayName = "ConvexHullCollider";

const rigidBodyDescFromOptions = options => {
  var _options$canSleep;

  const type = rigidBodyTypeFromString((options === null || options === void 0 ? void 0 : options.type) || "dynamic");
  const desc = new RigidBodyDesc(type); // Apply immutable options

  desc.canSleep = (_options$canSleep = options === null || options === void 0 ? void 0 : options.canSleep) !== null && _options$canSleep !== void 0 ? _options$canSleep : true;
  return desc;
};
const createRigidBodyState = ({
  rigidBody,
  object,
  setMatrix,
  getMatrix,
  worldScale,
  meshType: _meshType = "mesh"
}) => {
  object.updateWorldMatrix(true, false);
  const invertedWorldMatrix = object.parent.matrixWorld.clone().invert();
  return {
    object,
    rigidBody,
    invertedWorldMatrix,
    setMatrix: setMatrix ? setMatrix : matrix => {
      object.matrix.copy(matrix);
    },
    getMatrix: getMatrix ? getMatrix : matrix => matrix.copy(object.matrix),
    scale: worldScale || object.getWorldScale(_scale).clone(),
    isSleeping: false,
    meshType: _meshType
  };
};
const immutableRigidBodyOptions = ["args", "colliders", "canSleep"];
const mutableRigidBodyOptions = {
  gravityScale: (rb, value) => {
    rb.setGravityScale(value, true);
  },

  additionalSolverIterations(rb, value) {
    rb.setAdditionalSolverIterations(value);
  },

  linearDamping: (rb, value) => {
    rb.setLinearDamping(value);
  },
  angularDamping: (rb, value) => {
    rb.setAngularDamping(value);
  },
  dominanceGroup: (rb, value) => {
    rb.setDominanceGroup(value);
  },
  enabledRotations: (rb, [x, y, z]) => {
    rb.setEnabledRotations(x, y, z, true);
  },
  enabledTranslations: (rb, [x, y, z]) => {
    rb.setEnabledTranslations(x, y, z, true);
  },
  lockRotations: (rb, value) => {
    rb.lockRotations(value, true);
  },
  lockTranslations: (rb, value) => {
    rb.lockTranslations(value, true);
  },
  angularVelocity: (rb, [x, y, z]) => {
    rb.setAngvel({
      x,
      y,
      z
    }, true);
  },
  linearVelocity: (rb, [x, y, z]) => {
    rb.setLinvel({
      x,
      y,
      z
    }, true);
  },
  ccd: (rb, value) => {
    rb.enableCcd(value);
  },
  userData: (rb, value) => {
    rb.userData = value;
  },

  type(rb, value) {
    rb.setBodyType(rigidBodyTypeFromString(value), true);
  },

  position: () => {},
  rotation: () => {},
  quaternion: () => {},
  scale: () => {}
};
const mutableRigidBodyOptionKeys = Object.keys(mutableRigidBodyOptions);
const setRigidBodyOptions = (rigidBody, options, states, updateTranslations = true) => {
  if (!rigidBody) {
    return;
  }

  const state = states.get(rigidBody.handle);

  if (state) {
    if (updateTranslations) {
      state.object.updateWorldMatrix(true, false);

      _matrix4.copy(state.object.matrixWorld).decompose(_position, _rotation, _scale);

      rigidBody.setTranslation(_position, false);
      rigidBody.setRotation(_rotation, false);
    }

    mutableRigidBodyOptionKeys.forEach(key => {
      if (key in options) {
        mutableRigidBodyOptions[key](rigidBody, options[key]);
      }
    });
  }
};
const useUpdateRigidBodyOptions = (getRigidBody, props, states, updateTranslations = true) => {
  // TODO: Improve this, split each prop into its own effect
  const mutablePropsAsFlatArray = useMemo(() => mutableRigidBodyOptionKeys.flatMap(key => {
    return vectorToTuple(props[key]);
  }), [props]);
  useEffect(() => {
    const rigidBody = getRigidBody();
    setRigidBodyOptions(rigidBody, props, states, updateTranslations);
  }, mutablePropsAsFlatArray);
};
const useRigidBodyEvents = (getRigidBody, props, events) => {
  const {
    onWake,
    onSleep,
    onCollisionEnter,
    onCollisionExit,
    onIntersectionEnter,
    onIntersectionExit,
    onContactForce
  } = props;
  const eventHandlers = {
    onWake,
    onSleep,
    onCollisionEnter,
    onCollisionExit,
    onIntersectionEnter,
    onIntersectionExit,
    onContactForce
  };
  useEffect(() => {
    const rigidBody = getRigidBody();
    events.set(rigidBody.handle, eventHandlers);
    return () => {
      events.delete(rigidBody.handle);
    };
  }, [onWake, onSleep, onCollisionEnter, onCollisionExit, onIntersectionEnter, onIntersectionExit, onContactForce]);
};

const _excluded$1 = ["children", "type", "position", "rotation", "scale", "quaternion", "transformState"];
const RigidBodyContext = /*#__PURE__*/createContext(undefined);
const useRigidBodyContext = () => useContext(RigidBodyContext);

/**
 * A rigid body is a physical object that can be simulated by the physics engine.
 * @category Components
 */
const RigidBody = /*#__PURE__*/memo( /*#__PURE__*/forwardRef((props, forwardedRef) => {
  const {
    children,
    type,
    position,
    rotation,
    scale,
    quaternion,
    transformState
  } = props,
        objectProps = _objectWithoutProperties(props, _excluded$1);

  const objectRef = useRef(null);
  const rigidBodyRef = useForwardedRef(forwardedRef);
  const {
    world,
    rigidBodyStates,
    physicsOptions,
    rigidBodyEvents
  } = useRapier();
  const mergedOptions = useMemo(() => {
    return _objectSpread2(_objectSpread2(_objectSpread2({}, physicsOptions), props), {}, {
      children: undefined
    });
  }, [physicsOptions, props]);
  const immutablePropArray = immutableRigidBodyOptions.flatMap(key => {
    return Array.isArray(mergedOptions[key]) ? [...mergedOptions[key]] : mergedOptions[key];
  });
  const childColliderProps = useChildColliderProps(objectRef, mergedOptions); // Provide a way to eagerly create rigidbody

  const getRigidBody = useImperativeInstance(() => {
    const desc = rigidBodyDescFromOptions(mergedOptions);
    const rigidBody = world.createRigidBody(desc);

    if (typeof forwardedRef === "function") {
      forwardedRef(rigidBody);
    }

    rigidBodyRef.current = rigidBody;
    return rigidBody;
  }, rigidBody => {
    if (world.getRigidBody(rigidBody.handle)) {
      world.removeRigidBody(rigidBody);
    }
  }, immutablePropArray); // Only provide a object state after the ref has been set

  useEffect(() => {
    const rigidBody = getRigidBody();
    const state = createRigidBodyState({
      rigidBody,
      object: objectRef.current
    });
    rigidBodyStates.set(rigidBody.handle, props.transformState ? props.transformState(state) : state);
    return () => {
      rigidBodyStates.delete(rigidBody.handle);
    };
  }, [getRigidBody]);
  useUpdateRigidBodyOptions(getRigidBody, mergedOptions, rigidBodyStates);
  useRigidBodyEvents(getRigidBody, mergedOptions, rigidBodyEvents);
  const contextValue = useMemo(() => {
    return {
      ref: objectRef,
      getRigidBody: getRigidBody,
      options: mergedOptions
    };
  }, [getRigidBody]);
  return /*#__PURE__*/React.createElement(RigidBodyContext.Provider, {
    value: contextValue
  }, /*#__PURE__*/React.createElement("object3D", _extends({
    ref: objectRef
  }, objectProps, {
    position: position,
    rotation: rotation,
    quaternion: quaternion,
    scale: scale
  }), children, childColliderProps.map((colliderProps, index) => /*#__PURE__*/React.createElement(AnyCollider, _extends({
    key: index
  }, colliderProps)))));
}));
RigidBody.displayName = "RigidBody";

/**
 * A mesh collider is a collider that is automatically generated from the geometry of the children.
 * @category Colliders
 */
const MeshCollider = /*#__PURE__*/memo(props => {
  const {
    children,
    type
  } = props;
  const {
    physicsOptions
  } = useRapier();
  const object = useRef(null);
  const {
    options
  } = useRigidBodyContext();
  const mergedOptions = useMemo(() => {
    return _objectSpread2(_objectSpread2(_objectSpread2({}, physicsOptions), options), {}, {
      children: undefined,
      colliders: type
    });
  }, [physicsOptions, options]);
  const childColliderProps = useChildColliderProps(object, mergedOptions, false);
  return /*#__PURE__*/React.createElement("object3D", {
    ref: object,
    userData: {
      r3RapierType: "MeshCollider"
    }
  }, children, childColliderProps.map((colliderProps, index) => /*#__PURE__*/React.createElement(AnyCollider, _extends({
    key: index
  }, colliderProps))));
});
MeshCollider.displayName = "MeshCollider";

const _excluded = ["children", "instances", "colliderNodes", "position", "rotation", "quaternion", "scale"];
const InstancedRigidBodies = /*#__PURE__*/memo( /*#__PURE__*/forwardRef((props, forwardedRef) => {
  const rigidBodiesRef = useForwardedRef(forwardedRef, []);
  const objectRef = useRef(null);
  const instanceWrapperRef = useRef(null);

  const {
    // instanced props
    children,
    instances,
    colliderNodes = [],
    // wrapper object props
    position,
    rotation,
    quaternion,
    scale
  } = props,
        rigidBodyProps = _objectWithoutProperties(props, _excluded);

  const childColliderProps = useChildColliderProps(objectRef, _objectSpread2(_objectSpread2({}, props), {}, {
    children: undefined
  }));

  const getInstancedMesh = () => {
    const firstChild = instanceWrapperRef.current.children[0];

    if (firstChild && "isInstancedMesh" in firstChild) {
      return firstChild;
    }

    return undefined;
  };

  useEffect(() => {
    const instancedMesh = getInstancedMesh();

    if (instancedMesh) {
      instancedMesh.instanceMatrix.setUsage(DynamicDrawUsage);
    } else {
      console.warn("InstancedRigidBodies expects exactly one child, which must be an InstancedMesh");
    }
  }, []); // Update the RigidBodyStates whenever the instances change

  const applyInstancedState = (state, index) => {
    const instancedMesh = getInstancedMesh();

    if (instancedMesh) {
      return _objectSpread2(_objectSpread2({}, state), {}, {
        getMatrix: matrix => {
          instancedMesh.getMatrixAt(index, matrix);
          return matrix;
        },
        setMatrix: matrix => {
          instancedMesh.setMatrixAt(index, matrix);
          instancedMesh.instanceMatrix.needsUpdate = true;
        },
        meshType: "instancedMesh"
      });
    }

    return state;
  };

  return /*#__PURE__*/React.createElement("object3D", _extends({
    ref: objectRef
  }, rigidBodyProps, {
    position: position,
    rotation: rotation,
    quaternion: quaternion,
    scale: scale
  }), /*#__PURE__*/React.createElement("object3D", {
    ref: instanceWrapperRef
  }, children), instances === null || instances === void 0 ? void 0 : instances.map((instance, index) => /*#__PURE__*/React.createElement(RigidBody, _extends({}, rigidBodyProps, instance, {
    ref: body => rigidBodiesRef.current[index] = body,
    transformState: state => applyInstancedState(state, index)
  }), /*#__PURE__*/React.createElement(React.Fragment, null, colliderNodes.map((node, index) => /*#__PURE__*/React.createElement(Fragment, {
    key: index
  }, node)), childColliderProps.map((colliderProps, colliderIndex) => /*#__PURE__*/React.createElement(AnyCollider, _extends({
    key: colliderIndex
  }, colliderProps)))))));
}));
InstancedRigidBodies.displayName = "InstancedRigidBodies";

/**
 * @internal
 */

const useImpulseJoint = (body1, body2, params) => {
  const {
    world
  } = useRapier();
  const jointRef = useRef();
  useImperativeInstance(() => {
    if (body1.current && body2.current) {
      const newJoint = world.createImpulseJoint(params, body1.current, body2.current, true);
      jointRef.current = newJoint;
      return newJoint;
    }
  }, joint => {
    if (joint) {
      jointRef.current = undefined;

      if (world.getImpulseJoint(joint.handle)) {
        world.removeImpulseJoint(joint, true);
      }
    }
  }, []);
  return jointRef;
};
/**
 * A fixed joint ensures that two rigid-bodies don't move relative to each other.
 * Fixed joints are characterized by one local frame (represented by an isometry) on each rigid-body.
 * The fixed-joint makes these frames coincide in world-space.
 *
 * @category Hooks - Joints
 */

const useFixedJoint = (body1, body2, [body1Anchor, body1LocalFrame, body2Anchor, body2LocalFrame]) => {
  const {
    rapier
  } = useRapier();
  return useImpulseJoint(body1, body2, rapier.JointData.fixed(vector3ToRapierVector(body1Anchor), quaternionToRapierQuaternion(body1LocalFrame), vector3ToRapierVector(body2Anchor), quaternionToRapierQuaternion(body2LocalFrame)));
};
/**
 * The spherical joint ensures that two points on the local-spaces of two rigid-bodies always coincide (it prevents any relative
 * translational motion at this points). This is typically used to simulate ragdolls arms, pendulums, etc.
 * They are characterized by one local anchor on each rigid-body. Each anchor represents the location of the
 * points that need to coincide on the local-space of each rigid-body.
 *
 * @category Hooks - Joints
 */

const useSphericalJoint = (body1, body2, [body1Anchor, body2Anchor]) => {
  const {
    rapier
  } = useRapier();
  return useImpulseJoint(body1, body2, rapier.JointData.spherical(vector3ToRapierVector(body1Anchor), vector3ToRapierVector(body2Anchor)));
};
/**
 * The revolute joint prevents any relative movement between two rigid-bodies, except for relative
 * rotations along one axis. This is typically used to simulate wheels, fans, etc.
 * They are characterized by one local anchor as well as one local axis on each rigid-body.
 *
 * @category Hooks - Joints
 */

const useRevoluteJoint = (body1, body2, [body1Anchor, body2Anchor, axis, limits]) => {
  const {
    rapier
  } = useRapier();
  const params = rapier.JointData.revolute(vector3ToRapierVector(body1Anchor), vector3ToRapierVector(body2Anchor), vector3ToRapierVector(axis));

  if (limits) {
    params.limitsEnabled = true;
    params.limits = limits;
  }

  return useImpulseJoint(body1, body2, params);
};
/**
 * The prismatic joint prevents any relative movement between two rigid-bodies, except for relative translations along one axis.
 * It is characterized by one local anchor as well as one local axis on each rigid-body. In 3D, an optional
 * local tangent axis can be specified for each rigid-body.
 *
 * @category Hooks - Joints
 */

const usePrismaticJoint = (body1, body2, [body1Anchor, body2Anchor, axis, limits]) => {
  const {
    rapier
  } = useRapier();
  const params = rapier.JointData.prismatic(vector3ToRapierVector(body1Anchor), vector3ToRapierVector(body2Anchor), vector3ToRapierVector(axis));

  if (limits) {
    params.limitsEnabled = true;
    params.limits = limits;
  }

  return useImpulseJoint(body1, body2, params);
};
/**
 * The rope joint limits the max distance between two bodies.
 * @category Hooks - Joints
 */

const useRopeJoint = (body1, body2, [body1Anchor, body2Anchor, length]) => {
  const {
    rapier
  } = useRapier();
  const vBody1Anchor = vector3ToRapierVector(body1Anchor);
  const vBody2Anchor = vector3ToRapierVector(body2Anchor);
  const params = rapier.JointData.rope(length, vBody1Anchor, vBody2Anchor);
  return useImpulseJoint(body1, body2, params);
};
/**
 * The spring joint applies a force proportional to the distance between two objects.
 * @category Hooks - Joints
 */

const useSpringJoint = (body1, body2, [body1Anchor, body2Anchor, restLength, stiffness, damping]) => {
  const {
    rapier
  } = useRapier();
  const vBody1Anchor = vector3ToRapierVector(body1Anchor);
  const vBody2Anchor = vector3ToRapierVector(body2Anchor);
  const params = rapier.JointData.spring(restLength, stiffness, damping, vBody1Anchor, vBody2Anchor);
  return useImpulseJoint(body1, body2, params);
};

/**
 * Calculates an InteractionGroup bitmask for use in the `collisionGroups` or `solverGroups`
 * properties of RigidBody or Collider components. The first argument represents a list of
 * groups the entity is in (expressed as numbers from 0 to 15). The second argument is a list
 * of groups that will be filtered against. When it is omitted, all groups are filtered against.
 *
 * @example
 * A RigidBody that is member of group 0 and will collide with everything from groups 0 and 1:
 *
 * ```tsx
 * <RigidBody collisionGroups={interactionGroups([0], [0, 1])} />
 * ```
 *
 * A RigidBody that is member of groups 0 and 1 and will collide with everything else:
 *
 * ```tsx
 * <RigidBody collisionGroups={interactionGroups([0, 1])} />
 * ```
 *
 * A RigidBody that is member of groups 0 and 1 and will not collide with anything:
 *
 * ```tsx
 * <RigidBody collisionGroups={interactionGroups([0, 1], [])} />
 * ```
 *
 * Please note that Rapier needs interaction filters to evaluate to true between _both_ colliding
 * entities for collision events to trigger.
 *
 * @param memberships Groups the collider is a member of. (Values can range from 0 to 15.)
 * @param filters Groups the interaction group should filter against. (Values can range from 0 to 15.)
 * @returns An InteractionGroup bitmask.
 */
const interactionGroups = (memberships, filters) => (bitmask(memberships) << 16) + (filters !== undefined ? bitmask(filters) : 0b1111111111111111);

const bitmask = groups => [groups].flat().reduce((acc, layer) => acc | 1 << layer, 0);

export { AnyCollider, BallCollider, CapsuleCollider, ConeCollider, ConvexHullCollider, CuboidCollider, CylinderCollider, HeightfieldCollider, InstancedRigidBodies, MeshCollider, Physics, RigidBody, RoundConeCollider, RoundCuboidCollider, RoundCylinderCollider, TrimeshCollider, euler, interactionGroups, quat, useAfterPhysicsStep, useBeforePhysicsStep, useFixedJoint, useImpulseJoint, usePrismaticJoint, useRapier, useRevoluteJoint, useRopeJoint, useSphericalJoint, useSpringJoint, vec3 };
