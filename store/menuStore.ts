import { create } from "zustand";

interface Menu {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const useMenuStore = create<Menu>((set) => ({
  activeTab: "add",
  setActiveTab: (activeTab) => set({ activeTab }),
}));

