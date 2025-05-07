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

// Define the API response structure for users
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

// Define the API response structure for operators
export interface GetOperatorsResponse {
  success: boolean;
  message?: string;
  data: Operator[];
}

// for the table component
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

export interface CardProps<T = React.ReactNode> {
  label: string; // The label that will be displayed in the card
  textlabel?: string;
  value: T; // The value to display on the card, which will be of generic type T
  color?: string; // The background color for the card
  style?: React.CSSProperties;
}

// types/interfaces.ts
export interface CardsPageProps<T> {
  dashboardData: T[]; // Dashboard data can be of any type
  roleLabel?: string;   // Label for the role (e.g., "Manager", "Operator")
  cardData: never[]; // if not used, you can remove this or mark optional
  textlabel?: string; // Optional text label for the card
}