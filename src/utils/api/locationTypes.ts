//   src\utils\locationTypes.ts
// for fetching of locations 
  
  export interface Region {
    key: string;
    name: string;
  }
  
  export interface Province {
    key: string;
    name: string;
    region: string;
  }
  
  export interface City {
    key: string;
    name: string;
    province: string;
  }