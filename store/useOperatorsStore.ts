import { create } from "zustand";

type OperatorsData = {
  totalOperators: number;
  totalActiveOperators: number;
  totalDeletedOperators: number;
  totalInactiveOperators: number;
  totalNewOperators: number;
};

type OperatorsStore = {
  operatorsData: OperatorsData;
  // Partial<T> - typescript utility makes all fields of T optional
  setOperatorsData: (data: Partial<OperatorsData>) => void;
};

export const useOperatorsStore = create<OperatorsStore>((set) => ({
  operatorsData: {
    totalOperators: 0,
    totalActiveOperators: 0,
    totalDeletedOperators: 0,
    totalInactiveOperators: 0,
    totalNewOperators: 0,
  },
  setOperatorsData: (data) =>
    set((state) => ({
      operatorsData: { ...state.operatorsData, ...data },
    })),
}));
