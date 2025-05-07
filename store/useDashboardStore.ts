// store/dashboardStore.ts
import { create } from "zustand";
import dayjs from "dayjs";
import { ChartBarItem } from "~/types/interfaces"; // Make sure this path is correct

// Define the type for dashboard data (replace with the actual type if available)
interface DashboardData {
  LastLogin?: string;
  LastTokenRefresh?: string;
  UserStatusId?: number;
  DateOfRegistration?: string;
  IsActive?: number;
  // Add any other properties here based on your data
}

interface DashboardState {
  dashboardData: DashboardData[];
  setDashboardData: (data: DashboardData[]) => void;

  roleConfig: { label: string; roleId: number } | null;
  setRoleConfig: (config: { label: string; roleId: number } | null) => void;

  sevenDaysAgo: dayjs.Dayjs;
  updateThreshold: (days: number) => void;

  chartData: ChartBarItem[];
  setChartData: (data: ChartBarItem[]) => void;
}

// Create the Zustand store
const useDashboardStore = create<DashboardState>((set) => ({
  dashboardData: [],
  setDashboardData: (data) => set({ dashboardData: data }),

  roleConfig: null,
  setRoleConfig: (config) => set({ roleConfig: config }),

  sevenDaysAgo: dayjs().subtract(7, "days"),
  updateThreshold: (days) =>
    set({ sevenDaysAgo: dayjs().subtract(days, "days") }),

  chartData: [],
  setChartData: (data) => set({ chartData: data }),
}));

export default useDashboardStore;
