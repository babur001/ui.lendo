import { create } from "zustand";

export interface Store {
  groupCode: string | null;
  classCode: string | null;
  positionCode: string | null;
  subPositionCode: string | null;
}

interface Actions {
  setGroupCode: (mxikName: Store["groupCode"]) => void;
  setClassCode: (mxikName: Store["classCode"]) => void;
  setPositionCode: (mxikName: Store["positionCode"]) => void;
  setSubPositionCode: (mxikName: Store["subPositionCode"]) => void;
}

export const useProductStore = create<Store & Actions>()((set) => ({
  positionCode: null,
  setPositionCode: (positionCode: Store["positionCode"]) =>
    set((state) => ({ positionCode })),

  subPositionCode: null,
  setSubPositionCode: (subPositionCode: Store["subPositionCode"]) =>
    set((state) => ({ subPositionCode })),

  classCode: null,
  setClassCode: (classCode: Store["classCode"]) =>
    set((state) => ({ classCode })),

  groupCode: null,
  setGroupCode: (groupCode: Store["groupCode"]) =>
    set((state) => ({ groupCode })),
}));
