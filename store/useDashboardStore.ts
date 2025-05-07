// store/dashboardStore.ts
import { create } from "zustand";

// Define the type for dashboard data (replace with the actual type if available)
interface DashboardData {
  LastLogin?: string;
  LastTokenRefresh?: string;
  UserStatusId?: number;
  DateOfRegistration?: string;
  // Add any other properties here based on your data
}

interface DashboardState {
  dashboardData: DashboardData[]; // Use a more specific type for your data
  setDashboardData: (data: DashboardData[]) => void;
  roleConfig: { label: string; roleId: number } | null; // You can extend this with more properties if needed
  setRoleConfig: (config: { label: string; roleId: number } | null) => void;
}

// Create the Zustand store
const useDashboardStore = create<DashboardState>((set) => ({
  dashboardData: [],  // Initialize with an empty array or default data
  setDashboardData: (data) => set({ dashboardData: data }),  // Update dashboardData
  roleConfig: null,  // Initialize roleConfig as null
  setRoleConfig: (config) => set({ roleConfig: config }),  // Update roleConfig
}));

export default useDashboardStore;
