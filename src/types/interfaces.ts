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
    OperatorId: number;
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
  }
  
  export interface Column<T> {
    key: keyof T | string;
    label: string;
    render?: (row: T) => React.ReactNode;
    sortable?: boolean;
    filterable?: boolean;
    filterKey?: string;
  
    // Custom props (optional)
    sortKey?: string;
    filterValue?: string | ((row: T) => string);
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