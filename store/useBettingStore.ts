import { create } from 'zustand';

export type categoryType = 
  'Total Bettors and Bet' |
  'Total Bets by Bet Type' |
  'Total Bettor by Bet Type' |
  'Total Bets by Game Type' |
  'Total Bettors by Game Type' |
  'Top Betting Region by Bets Comparison' |
  'Top Betting Region by Bettors Comparison';

  type dateType = 'Specific Date' | 'Date Duration';

interface BettingStore {
  // For Submenus, Date type extracted from URL params
  activeGameType: string;
  categoryFilter: categoryType;
  dateFilter: dateType;
  // If Filtered by Specific Date
  firstDateSpecific: Date | null;
  secondDateSpecific: Date | null;
  // If Filtered by Date Duration
  firstDateDuration: Date | null;
  secondDateDuration: Date | null;
  // For Submenus, Date type extracted from URL params
  setGameType: (gameType: string) => void;
  setCategoryFilter: (category: categoryType) => void;
  setDateFilter: (type: dateType) => void;
  // If Filtered by Specific Datee
  setFirstDateSpecific: (date: Date) => void;
  setSecondDateSpecific: (date: Date) => void;
  // If Filtered by Date Duration
  setFirstDateDuration: (date: Date) => void;
  setSecondDateDuration: (date: Date) => void;

  resetFilters: () => void;
}

export const useBettingStore = create<BettingStore>((set) => ({
  activeGameType: '',
  categoryFilter: 'Total Bettors and Bet',
  dateFilter: 'Specific Date',
  firstDateSpecific: null,
  secondDateSpecific: null,
  firstDateDuration: null,
  secondDateDuration: null,
  
  setGameType: (gameType) => set({ activeGameType: gameType }),

  setCategoryFilter: (category:categoryType) => set({ categoryFilter: category }),
  setDateFilter: (type:dateType) => set({ dateFilter: type }),
  setFirstDateSpecific: (date) => set({ firstDateSpecific: date }),
  setSecondDateSpecific: (date) => set({ secondDateSpecific: date }),
  setFirstDateDuration: (date) => set({ firstDateDuration: date }),
  setSecondDateDuration: (date) => set({ secondDateDuration: date }),
  resetFilters: () =>
    set({
      categoryFilter: 'Total Bettors and Bet',
      dateFilter: 'Specific Date',
      firstDateSpecific: null,
      secondDateSpecific: null,
      firstDateDuration: null,
      secondDateDuration: null
    }),
}));
