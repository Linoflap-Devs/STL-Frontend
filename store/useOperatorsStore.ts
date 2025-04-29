import { create } from "zustand";

type DashboardData = {
  totalOperators: number;
  totalActiveOperators: number;
  totalDeletedOperators: number;
  totalInactiveOperators: number;
  totalNewOperators: number;
};

type DashboardStore = {
  dashboardData: DashboardData;
  // Partial<T> - typescript utility makes all fields of T optional
  setDashboardData: (data: Partial<DashboardData>) => void;
};

export const useDashboardStore = create<DashboardStore>((set) => ({
  dashboardData: {
    totalOperators: 0,
    totalActiveOperators: 0,
    totalDeletedOperators: 0,
    totalInactiveOperators: 0,
    totalNewOperators: 0,
  },
  setDashboardData: (data) =>
    set((state) => ({
      dashboardData: { ...state.dashboardData, ...data },
    })),
}));
