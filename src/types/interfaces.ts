import { extend } from "dayjs";
import { RegionData } from "./types";

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
  Region: any;
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
  dashboardData: T[];
  roleLabel?: string;
  cardData: never[];
  textlabel?: string;
}

export interface ChartDataItem<T = unknown> {
  label: string;
  data: number[];
  color: string;
  meta?: T;
}

export interface ChartCardProps<T = unknown> {
  label: string;
  chartData: ChartDataItem<T>[];
  regions: string[];
  pageType: "manager" | "executive" | "operator";
  title?: string;
  roleLabel?: string;
}

// Legend component props
export interface CustomLegendProps {
  pageType: "manager" | "executive" | "operator";
  label: string;
}

// Define the generic interface
export interface UseUsersChartsDataProps<T> {
  dashboardData: T[];
  regions: string[];
}

export interface ChartsDataPageProps<T extends { region: string }> extends UseUsersChartsDataProps<T> {
  userType: string;
  getUserStatus: (user: T, sevenDaysAgo: string) => string;
  pageType: "manager" | "executive" | "operator";
}

export interface ChartBarItem {
  label: string;
  color: string;
  data: number[];
}

// foorm for create modal
export interface Field {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
}

export type ReusableModalPageProps = {
  title: string; // Add the title prop
  endpoint: string;
  isOpen: boolean;
  onClose: () => void;
  fields: Field[];
  onSuccess?: () => void;
  onSubmit?: (formData: Record<string, string>) => Promise<void>;
};

export interface CreateModalPageProps {
  open?: boolean;
  onClose?: () => void;
  fields?: Array<{ label: string; value: string }>;
  endpoint?: string; // Added the missing 'endpoint' property
}
