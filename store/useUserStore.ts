import { create } from 'zustand';
import { User, Operator, Column } from '~/types/interfaces';

interface UserRoleStore {
  roleId: number | null;
  setRoleId: (roleId: number | null) => void;

  // Store user data
  data: User[];
  setData: (data: User[]) => void;

  columns: Column<User>[];
  setColumns: (columns: Column<User>[]) => void;

  // Operator map to fetch operator details
  operatorMap: { [key: number]: Operator };
  setOperatorMap: (operatorMap: { [key: number]: Operator }) => void;

  modalOpen: boolean;
  setModalOpen: (modalOpen: boolean) => void;

  fieldName: string;
  setFieldName: (fieldName: string) => void;

  fields: { name: string; label: string; type: string; placeholder: string }[];
  setFields: (fields: { name: string; label: string; type: string; placeholder: string }[]) => void;
}

const useUserRoleStore = create<UserRoleStore>((set) => ({
  roleId: null,
  setRoleId: (roleId) => set({ roleId }),

  data: [],
  setData: (data) => set({ data }),

  columns: [],
  setColumns: (columns) => set({ columns }),

  modalOpen: false,
  setModalOpen: (modalOpen) => set({ modalOpen }),

  operatorMap: {},
  setOperatorMap: (operatorMap) => set({ operatorMap }),

  fieldName: "",
  setFieldName: (fieldName) => set({ fieldName }),

  fields: [],
  setFields: (fields) => set({ fields }),
}));

export default useUserRoleStore;
