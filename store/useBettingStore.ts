// stores/useBettingStore.ts
import { create } from 'zustand';

interface BettingStore {
  selectedDate: Date; // Change from `Date | null` to `Date`
  setSelectedDate: (date: Date | null) => void; // Allow `null` in the setter
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
}

const useBettingStore = create<BettingStore>((set) => ({
  selectedDate: new Date(), // Default to today's date
  setSelectedDate: (date) => set({ selectedDate: date || new Date() }), // Handle `null`
  selectedFilter: "All",
  setSelectedFilter: (filter) => set({ selectedFilter: filter }),
}));

export default useBettingStore;