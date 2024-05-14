import { create } from "zustand";

export interface Config {
  interp: string;
  setInterp: (interp: string) => void;
  paused: boolean;
  setPaused: (paused: boolean) => void;
  debug: boolean;
  setDebug: (debug: boolean) => void;
}

export const useConfigStore = create<Config>((set) => ({
  interp: "linear",
  setInterp: (interp) => set({ interp }),
  paused: false,
  setPaused: (paused) => set({ paused }),
  debug: true,
  setDebug: (debug) => set({ debug }),
}));
