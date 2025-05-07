
// for dashboard cards
export type DashboardData = {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  inactiveUsers: number;
  newUsers: number;
};

// for dashboard charts
export interface LegendItem {
  color: string;
  label: string;
}

export type User = {
  region: string;  // Add region to User
  LastLogin?: string;
  LastTokenRefresh?: string;
  DateOfRegistration?: string;
  IsActive?: number;
};

export type RegionData = Record<
  string,
  {
    users: User[];
  }
>;

// Operators
export type OperatorsData = {
  totalOperators: number;
  totalActiveOperators: number;
  totalDeletedOperators: number;
  totalInactiveOperators: number;
  totalNewOperators: number;
};

// Operators Add Form
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



