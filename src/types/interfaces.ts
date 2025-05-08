import { extend } from "dayjs";
import { Operator, RegionData } from "./types";

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

export interface Field {
  name: string;
  label: string;
  type: string; // e.g., "text", "select"
  placeholder?: string;
  options?: FieldOption[]; // Only for 'select' fields
  value: string;
}

export interface FieldOption {
  label: string;
  value: string;
}

export type ReusableModalPageProps = {
  title: string;
  endpoint: string; 
  isOpen: boolean;
  onClose: () => void;
  fields: Field[];
  onSuccess?: () => void;
  onSubmit?: (formData: Record<string, string>) => Promise<void>;
  children: (props: { handleSubmit: () => void }) => React.ReactNode;
  loading?: boolean; // Optional loading state
  formData?: Record<string, string>; // Optional form data for pre-filling
  setFormData?: (data: Record<string, string>) => void; // Optional setter for form data
  additionalPayload?: Record<string, any>; // <- for things like UserTypeId
};

export interface CreateModalPageProps {
  open?: boolean;
  onClose?: () => void;
  fields?: Array<{
    type: any;
    name: any; label: string; value: string 
}>;
  endpoint?: string;
  pageType?: string; // Declare pageType prop
  additionalPayload?: Record<string, any>; // <- for things like UserTypeId
  onFieldChange?: (name: string, value: string) => void; // Added onFieldChange property
}
