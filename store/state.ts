import { create } from "zustand";

interface State {
  position: number[];
  setPosition: (newPosition: number) => void;
}
export interface Config {
  interp: string;
  setInterp: (interp : string) => void;
}

export const useConfigStore = create<Config>((set) => ({
  interp: 'linear',
  setInterp: (interp) => set({ interp })
}))

const useStateStore = create<State>((set) => ({
  position: [],
  setPosition: (newPosition) =>
    set((state) => {
      const updatedPositions =
        state.position.length < 10
          ? [...state.position, newPosition]
          : [...state.position.slice(1), newPosition];
      return { position: updatedPositions };
    }),
}));

export default useStateStore;
