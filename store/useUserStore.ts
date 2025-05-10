import { create } from 'zustand';
import { Column } from '~/types/interfaces';
import { User, Operator } from '~/types/types';

interface UserRoleStore {
  roleId: number | null;
  setRoleId: (roleId: number | null) => void;
  setData: (data: User[]) => void;
  setColumns: (columns: Column<User>[]) => void;
  setOperatorMap: (operatorMap: { [key: number]: Operator }) => void;
  setModalOpen: (modalOpen: boolean) => void;
  setFieldName: (fieldName: string) => void;

  data: User[];
  columns: Column<User>[];
  operatorMap: { [key: number]: Operator };
  modalOpen: boolean;
  fieldName: string;
  fields: {
    value: any; name: string; label: string; type: string; placeholder: string 
}[];
  setFields: (fields: { name: string; label: string; type: string; placeholder: string, value: string}[]) => void;
}

const useUserRoleStore = create<UserRoleStore>((set) => ({
  roleId: null,
  data: [],
  columns: [],
  modalOpen: false,
  operatorMap: {},
  fieldName: "",
  fields: [],

  setRoleId: (roleId) => set({ roleId }),
  setData: (data) => set({ data }),
  setColumns: (columns) => set({ columns }),
  setModalOpen: (modalOpen) => set({ modalOpen }),
  setOperatorMap: (operatorMap) => set({ operatorMap }),
  setFieldName: (fieldName) => set({ fieldName }),
  setFields: (fields) => {
    set({
      fields: fields.map(field => ({
        ...field,
        value: field.value || '',
      }))
    });
  }
  
  
}));

export default useUserRoleStore;
