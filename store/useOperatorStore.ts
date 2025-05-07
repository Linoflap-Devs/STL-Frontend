import { create } from "zustand";
import { AddOperatorFormData, UpdateOperatorFormData, OperatorsStore, Operator } from '../src/types/types'
import { Column } from "../src/types/interfaces";

interface OperatorsState {
  // Store user data
  data: Operator[];
  setData: (data: Operator[]) => void;
  
  // Store table columns configuration
  columns: Column<Operator>[];
  setColumns: (columns: Column<Operator>[]) => void;

  operators: Operator[];
  operatorMap: { [key: number]: Operator };
  loading: boolean;
  error: string | null;

  setOperators: (operators: Operator[]) => void;
  setOperatorMap: (operatorMap: { [key: number]: Operator }) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void; // Added setModalOpen
}

export const useOperatorsData = create<OperatorsState>((set) => ({
  operators: [],
  operatorMap: {},
  loading: false,
  error: null,
  columns: [],
  data: [],
  modalOpen: false,
  setModalOpen: (modalOpen: any) => set({ modalOpen }),
  setData: (data) => set({ data }),
  setColumns: (columns) => set({ columns }),
  setOperators: (operators) => set({ operators }),
  setOperatorMap: (operatorMap) => set({ operatorMap }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

const defaultOperatorForm: AddOperatorFormData = {
  companyName: '',
  email: '',
  phone: '',
  dateOfOperations: '',
  areaOfOperations: '',
  gameTypes: {
    stlPares: false,
    stlSwer2: false,
    stlSwer3: false,
    stlSwer4: false,
    allGames: false,
  }
};

const defaultUpdateOperatorForm: UpdateOperatorFormData = {
  status: ' ',
  companyName: ' ',
  email: ' ',
  phone: ' ',
  dateOfOperations: ' ',
  areaOfOperations: ' ',
  gameTypes: {
    stlPares: false,
    stlSwer2: false,
    stlSwer3: false,
    stlSwer4: false,
    allGames: false,
  },
  createdBy: ' ',
  latestUpdateBy: ' ',
  creationDate: ' ',
  latestUpdateDate: ' ',
  remarks: '',
};

export const useOperatorsStore = create<OperatorsStore>((set) => ({
  // OperatorsCards Component
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

  // Add Operator Component
  addOperatorForm: defaultOperatorForm,
  setOperatorFormData: (data) =>
    set((state) => ({
      addOperatorForm: {
        ...state.addOperatorForm,
        ...data,
      },
    })),

  // Update Operator Component
  updateOperatorForm: defaultUpdateOperatorForm,
  setUpdateOperatorFormData: (data) =>
    set((state) => ({
      updateOperatorForm: {
        ...state.updateOperatorForm,
        ...data,
      },
    })),

  // Update game types for the Add Operator form
  setAllGameTypes: (data) =>
    set((state) => ({
      addOperatorForm: {
        ...state.addOperatorForm,
        gameTypes: { ...state.addOperatorForm.gameTypes, ...data },
      },
    })),
}));


