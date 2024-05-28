import create from 'zustand';

interface Vector3 {
  x: number[];
  y: number[];
  z: number[];
}

interface State {
  position: Vector3;
  velocity: Vector3;
  setPosition: (newPosition: { x: number; y: number; z: number }) => void;
  setVelocity: (newVelocity: { x: number; y: number; z: number }) => void;
}

const updateAxis = (axis: number[], value: number) =>
  axis.length < 500 ? [...axis, value] : [...axis.slice(1), value];

const useStateStore = create<State>((set) => ({
  position: { x: [], y: [], z: [] },
  velocity: { x: [], y: [], z: [] },
  setPosition: (newPosition) =>
    set((state) => ({
      position: {
        x: updateAxis(state.position.x, newPosition.x),
        y: updateAxis(state.position.y, newPosition.y),
        z: updateAxis(state.position.z, newPosition.z),
      },
    })),
  setVelocity: (newVelocity) =>
    set((state) => ({
      velocity: {
        x: updateAxis(state.velocity.x, newVelocity.x),
        y: updateAxis(state.velocity.y, newVelocity.y),
        z: updateAxis(state.velocity.z, newVelocity.z),
      },
    })),
}));

export default useStateStore;
