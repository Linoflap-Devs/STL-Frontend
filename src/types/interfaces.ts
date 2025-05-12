import { z } from "zod";
import { User, Operator } from "./types";
import { userSchema } from "~/utils/validation";
import { MultiValue } from "react-select";

// Generic API response interface
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export type GetUsersResponse = ApiResponse<User[]>;
export type GetOperatorsResponse = ApiResponse<Operator[]>;
export type GetGameCategoriesResponse = ApiResponse<{
  data: {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  }[];
}>;
export type GetLocationResponse = ApiResponse<{
  data: {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  }[];
}>;


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
  statsPerRegion: any[];
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
}

// Generic table props
export interface DetailedTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onCreate?: () => void;
  actionsRender?: (row: T) => React.ReactNode;
  pageType?: "manager" | "executive" | "operator";
  showExportButton?: boolean;
  onExportCSV?: () => void;
  operatorMap?: Record<number, Operator>;
  statsPerRegion?: any[];
  roleId?: number;
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
export interface FieldOption {
  value: string;
  label: string;
  regionId?: number; // <- Add this ,ine
  provinceId?: number; // <- Add this line
  cityId?: number; // <- Add this line
  selected?: boolean; // Indicates if the option is selected
  RegionName?: string; // Optional region name for display
  RegionId?: number; // Optional region ID for filtering
  ProvinceName?: string; // Optional province name for display
  ProvinceId?: number; // Optional province ID for filtering  
  CityName?: string; // Optional city name for display
  CityId?: number; // Optional city ID for filtering
}

export interface Field {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  options?: FieldOption[]; // Used only for 'select' and 'multiselect' types
  value: string | number | boolean | string[]; // Add boolean for checkbox
  gridSpan?: 1 | 2 | 'full'; // Grid span for layout
  required?: boolean; // Indicates if the field is required
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

  provinces: any[];
  regions: any[];
  cities: any[];
  setSelectedRegion: (regionId: string) => void;
  setSelectedProvince: (provinceId: string) => void;
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

  // operators
  provinces?: FieldOption[];
  regions?: FieldOption[];  // Added regions
  cities?: FieldOption[];   // Added cities
  selectedRegion?: string;  // Selected region for filtering provinces/cities
  selectedProvince?: string; // Selected province for filtering cities
  onRegionSelect?: (regionId: string) => void;  // Handler for region selection
  onProvinceSelect?: (provinceId: string) => void; // Handler for province selection
  handleMultiSelect?: (fieldName: string, selectedOptions: MultiValue<FieldOption>) => void; // Added this line

  setSelectedRegion?: (regionId: string) => void; // Added this line
  setSelectedProvince?: (provinceId: string) => void; // Added this line
}

export interface UserFieldFormPageProps {
  operatorMap: { [key: number]: Operator };
  setOperatorMap: (operatorMap: { [key: number]: Operator }) => void;
}

export interface EditModalPageProps {
  userId: number;
  onClose: () => void;
}

export interface CSVExportButtonProps {
  statsPerRegion: any[];
  pageType: string;
  roleId?: number;
  fileName?: string;
  columns?: any[];
  operatorMap?: any[];
}

export type UserFormData = z.infer<typeof userSchema>;

export const defaultValues: UserFormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phoneNumber: "",
  operatorId: 0,
};

export interface ConfirmUserActionModalProps {
  open: boolean;
  onClose: () => void;
  onVerified?: () => void;
  user?: any;
  errors: any;
  setErrors: React.Dispatch<React.SetStateAction<any>>;
  selectedUser?: User | null;
  setSelectedUser?: React.Dispatch<React.SetStateAction<User | null>>;
  actionType: "create" | "suspend";
  formData: { [key: string]: string | number | string[] };
  setFormData: (data: { [key: string]: string | number }) => void;
  endpoint: {
    create: string;
    update: string;
  };
}
