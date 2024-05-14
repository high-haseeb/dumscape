import { create } from "zustand";

interface State {
  position: number[];
  setPosition: (newPosition: number) => void;
}
const useStateStore = create<State>((set) => ({
  position: [],
  setPosition: (newPosition) =>
    set((state) => {
      const updatedPositions =
        state.position.length < 500
          ? [...state.position, newPosition]
          : [...state.position.slice(1), newPosition];
      return { position: updatedPositions };
    }),
}));

export default useStateStore;
