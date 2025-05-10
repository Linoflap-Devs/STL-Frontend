import { User, Operator } from "./types";

// Generic API response interface
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export type GetUsersResponse = ApiResponse<User[]>;
export type GetOperatorsResponse = ApiResponse<Operator[]>;

// Table column interface
export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode; // Add render function to the Column interface
  sortable?: boolean;
  filterable?: boolean;
  filterKey?: keyof T | string;
  sortKey?: keyof T | string;
  filterValue?: string | ((row: T) => string);
  onFilterChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Sortable table header cell
export interface SortableTableCellProps {
  label: string;
  sortKey: string;
  isFilterVisible?: boolean;
}

// Generic card props
export interface CardProps<T = React.ReactNode> {
  label: string;
  textlabel?: string;
  value: T;
  color?: string;
  style?: React.CSSProperties;
}

// Cards page props
export interface CardsPageProps<T> {
  dashboardData: T[];
  roleLabel?: string;
  cardData: CardProps[];
  textlabel?: string;
}

// Chart types
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

export interface CustomLegendProps {
  pageType: "manager" | "executive" | "operator";
  label: string;
}

export interface UseUsersChartsDataProps<T> {
  dashboardData: T[];
  regions: string[];
  Region: string;
}

export interface ChartsDataPageProps<T extends { region: string }> {
  dashboardData: T[];
  userType?: string;
  getUserStatus?: (user: T, date: string) => string;
  pageType?: "manager" | "executive" | "operator";
  operatorMap?: Record<number, Operator>;
  Region?: string;
  regions: string[];
}

// Generic table props
export interface DetailedTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onCreate?: () => void;
  actionsRender?: (row: T) => React.ReactNode;
  pageType?: "manager" | "executive";
  showExportButton?: boolean;
  onExportCSV?: () => void;
  operatorMap?: Record<number, Operator>;
}

export interface ChartBarItem {
  label: string;
  color: string;
  data: number[];
}

// Region user object
export interface RegionUser {
  OperatorRegion?: {
    RegionFull: string;
    RegionId: number;
    RegionName: string;
  };
  region: string;
  Region?: string;
}

// Form field definitions
export interface Field {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  options?: FieldOption[];
  value: string;
  gridSpan?: 1 | 2 | 'full';  // Add the gridSpan property here
  required?: boolean; // Add this line
}

export interface FieldOption {
  label: string;
  value: string;
}

// Reusable modal
export interface ReusableModalPageProps {
  title: string;
  endpoint?: {
    create: string;
    update: string;
  };
  isOpen: boolean;
  onClose: () => void;
  fields: Field[];
  onSuccess?: () => void;
  onSubmit?: (formData: Record<string, string>) => Promise<void>;
  children: (props: { handleSubmit: () => void }) => React.ReactNode;
  loading?: boolean;
  formData?: Record<string, string>;
  setFormData?: (data: Record<string, string>) => void;
  additionalPayload?: Record<string, any>;
  initialUserData?: any;
  operatorMap?: Record<number, Operator>;
  layout?: 'single' | 'double'; // Add layout property
}

export interface ModalPageProps {
  open?: boolean;
  onClose?: () => void;
  fields?: Field[];
  endpoint?: {
    create: string;
    update: string;
  };
  pageType?: "manager" | "executive" | "operator";
  additionalPayload?: Record<string, any>;
  onFieldChange?: (name: string, value: string) => void;
  initialUserData?: any;
  operatorMap?: { [key: number]: Operator };
}

export interface UserFieldFormPageProps {
  operatorMap: { [key: number]: Operator };
  setOperatorMap: (operatorMap: { [key: number]: Operator }) => void;
}

export interface EditModalPageProps {
  userId: number;
  onClose: () => void;
} 
