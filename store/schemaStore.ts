import { create } from "zustand";

export interface Object {
  name: string;
  geometry: string;
  color: string;
  mass: number;
  translation: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  linearDamping: number;
  angularDamping: number;
  gravityScale : number;
  friction: number;
  restitution: number;
}
export interface Schema {
  objects: Object[];
  addObject: (object: Object) => void;
}

const useSchemaStore = create<Schema>((set) => ({
  objects: [],
  addObject: (object) =>
    set((state) => ({ objects: [...state.objects, object] })),
}));

export default useSchemaStore;
