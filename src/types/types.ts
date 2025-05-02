
// Operators
export type OperatorsData = {
  totalOperators: number;
  totalActiveOperators: number;
  totalDeletedOperators: number;
  totalInactiveOperators: number;
  totalNewOperators: number;
};
export type AddOperatorFormData = {
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
export type OperatorsStore = {
  //OperatorsCards Component
  operatorsData: OperatorsData;
  // Partial<T> - typescript utility makes all fields of T optional
  setOperatorsData: (data: Partial<OperatorsData>) => void;
  //Add Operator Component
  addOperatorForm: AddOperatorFormData;
  setOperatorFormData: (data:  Partial<AddOperatorFormData>) => void;
  setAllGameTypes: (data: Partial<AddOperatorFormData['gameTypes']>) => void;
};

