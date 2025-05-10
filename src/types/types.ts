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
  region: string;
  Region?: string;

  LastLogin?: string;
  LastTokenRefresh?: string;
  IsActive?: number;
}

// Define the Operator type
export type Operator = {
  OperatorRegion: any;
  Region?: any;
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

  LastLogin?: string;
  LastTokenRefresh?: string;
  UserStatusId?: number;
  DateOfRegistration?: string;
  IsActive?: number;
}

export interface RoleConfig {
  userTypeId: number;
  endpoint: {
    create: string;
    update: string;
  };
  fields: {
    name: string;
    label: string;
    type: string;
    placeholder: string;
    value: string;
    gridSpan: number;
    options?: { value: string; label: string }[];
  }[];
}

export interface operatorConfig {
  userTypeId: number;
  endpoint: {
    create: string;
    update: string;
  };
  fields: {
    name: string;
    label: string;
    type: string;
    placeholder: string;
    value: string;
    gridSpan: number;
    options?: { value: string; label: string }[];
  }[];
}


