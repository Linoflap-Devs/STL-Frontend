import { create } from 'zustand';
import { User, Operator, Column } from '~/types/types';

interface UserRoleStore {
  roleId: number | null;
  setRoleId: (roleId: number | null) => void;

  // Store user data
  data: User[];
  setData: (data: User[]) => void;

  // Store table columns configuration
  columns: Column[]; 
  setColumns: (columns: Column[]) => void;

  // Operator map to fetch operator details
  operatorMap: { [key: number]: Operator };
  setOperatorMap: (operatorMap: { [key: number]: Operator }) => void;
}

const useUserRoleStore = create<UserRoleStore>((set) => ({
  roleId: null,
  setRoleId: (roleId) => set({ roleId }),

  data: [],
  setData: (data) => set({ data }),

  columns: [],
  setColumns: (columns) => set({ columns }),

  operatorMap: {},
  setOperatorMap: (operatorMap) => set({ operatorMap }),
}));

export default useUserRoleStore;
