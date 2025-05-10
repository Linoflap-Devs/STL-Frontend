import { create } from "zustand";
import { Operator } from "../src/types/types";
import { Column, Field } from "~/types/interfaces";

export interface OperatorsState {
  data: Operator[];
  setData: (data: Operator[]) => void;

  columns: Column<Operator>[];
  setColumns: (columns: Column<Operator>[]) => void;

  operators: Operator[];
  operatorMap: Record<number, Operator>;
  
  loading: boolean;
  error: string | null;

  setOperators: (operators: Operator[]) => void;
  setOperatorMap: (operatorMap: Record<number, Operator>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;

  fields: Field[];
  setFields: (fields: Field[]) => void;
}

export const useOperatorsData = create<OperatorsState>((set) => ({
  data: [],
  setData: (data) => set({ data }),

  columns: [],
  setColumns: (columns) => set({ columns }),

  operators: [],
  operatorMap: {}, // Ensures type safety
  loading: false,
  error: null,

  setOperators: (operators) => set({ operators }),
  setOperatorMap: (operatorMap) => set({ operatorMap }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  modalOpen: false,
  setModalOpen: (open) => set({ modalOpen: open }),

  fields: [],
  setFields: (fields) => set({ fields }),
}));
