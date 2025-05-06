// Type for users
export interface User {
  UserId: number;
  FirstName: string;
  LastName: string;
  Suffix: string | null;
  UserTypeId: number;
  email: string;
  phoneNumber: string;
  DateOfRegistration: string;
  OperatorId: number; // <-- ADD THIS
  CreatedByFirstName?: string;
  CreatedByLastName?: string;
  OperatorDetails?: {
    OperatorName?: string;
  };
}

export interface GetUsersResponse {
  success: boolean;
  message: string;
  data: User[];
}

// Define the Operator type
export interface Operator {
  OperatorId: number;
  OperatorName: string;
  Executive: string;
  OperatorEmail: string | null;
  Status: number;
  CreatedAt: string;
  DateOfOperation: string;
  Cities: { CityId: number; CityName: string }[];
  OperatorAddress: string;
  OperatorContactNos: string;
  Email: string | null;
  ContactNo: string;
  OperatorRepresentative: string;
  Managers: any[]; // Optionally define structure if needed
}

export interface Column {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  filterKey?: string;

  // Custom props (optional)
  sortKey?: string;
  filterValue?: string;
  onFilterChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface SortableTableCellProps {
  label: string;
  sortKey: string;
  isFilterVisible?: boolean;
}

// Define the API response structure for operators
export interface GetOperatorsResponse {
  success: boolean;
  message?: string;
  data: Operator[];
}

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
export type UpdateOperatorFormData = {
  status: string;
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
  createdBy: string;
  latestUpdateBy: string;
  creationDate: string;
  latestUpdateDate: string;
  remarks: string;
}
export type OperatorsStore = {
  //OperatorsCards Component
  operatorsData: OperatorsData;
  // Partial<T> - typescript utility makes all fields of T optional
  setOperatorsData: (data: Partial<OperatorsData>) => void;
  //Add Operator Component
  addOperatorForm: AddOperatorFormData;
  setOperatorFormData: (data:  Partial<AddOperatorFormData>) => void;
  updateOperatorForm: UpdateOperatorFormData;
  setUpdateOperatorFormData: (data: Partial<UpdateOperatorFormData>) => void;
  setAllGameTypes: (data: Partial<AddOperatorFormData['gameTypes']>) => void;
};



