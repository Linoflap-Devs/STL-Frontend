import { create } from "zustand";

type OperatorsData = {
  totalOperators: number;
  totalActiveOperators: number;
  totalDeletedOperators: number;
  totalInactiveOperators: number;
  totalNewOperators: number;
};
type AddOperatorFormData = {
  companyName: string;
  email: string;
  phone: string;
  dateOfOperations: string;
  areaOfOperations: string;
  gameTypes: {
    stlPares: boolean;
    stlSwer2: boolean;
    stlSwer3: boolean;
    stlSwer4: boolean;
    allGames: boolean;
  }
}
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
}
type OperatorsStore = {
  //OperatorsCards Component
  operatorsData: OperatorsData;
  // Partial<T> - typescript utility makes all fields of T optional
  setOperatorsData: (data: Partial<OperatorsData>) => void;
  //Add Operator Component
  addOperatorForm: AddOperatorFormData;
  setOperatorFormData: (data:  Partial<AddOperatorFormData>) => void;
  setAllGameTypes: (data: Partial<AddOperatorFormData['gameTypes']>) => void;

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
    })
  ),
  // Add Operator Component
  addOperatorForm: defaultOperatorForm,
  setOperatorFormData: (data)=>
    set((state)=> ({
      addOperatorForm: {
        ...state.addOperatorForm, 
        ...data},
    })
  ),
  setAllGameTypes: (data)=>
    set((state)=> ({
      addOperatorForm: {
        ...state.addOperatorForm,
        gameTypes: {...state.addOperatorForm.gameTypes, ...data},
      }
    })
  )
  
}));
