import { create } from "zustand";

interface OperatorFormStore {
  gameTypes: any[];
  regions: any[];
  provinces: any[];
  cities: any[];
  selectedRegion: any;
  selectedProvince: any;
  areaOfOperations: any[];
  setGameTypes: (gameTypes: any[]) => void;
  setRegions: (regions: any[]) => void;
  setProvinces: (provinces: any[]) => void;
  setCities: (cities: any[]) => void;
  setSelectedRegion: (region: any) => void;
  setSelectedProvince: (province: any) => void;
  setAreaOfOperations: (province: any) => void;
}

export const useOperatorFormStore = create<OperatorFormStore>((set) => ({
  gameTypes: [],
  regions: [],
  provinces: [],
  cities: [],
  areaOfOperations: [],
  selectedRegion: '',
  selectedProvince: '',
  setGameTypes: (gameTypes) => set({ gameTypes }),
  setRegions: (regions) => set({ regions }),
  setProvinces: (provinces) => set({ provinces }),
  setCities: (cities) => set({ cities }),
  setAreaOfOperations: (areaOfOperations) => set({ areaOfOperations }),
  setSelectedRegion: (region) => set({ selectedRegion: region }),
  setSelectedProvince: (province) => set({ selectedProvince: province }),

}));
