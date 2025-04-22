import { create } from 'zustand';

export type categoryType = 
  'Total Winners and Winnings' |
  'Total Winnings by Bet Type' |
  'Total Winners by Bet Type' |
  'Total Winnings by Game Type' |
  'Total Winners by Game Type' |
  'Top Winning Region by Winnings Comparison' |
  'Top Winner Region by Winners Comparison';

  type dateType = 'Specific Date' | 'Date Duration';

interface WinningStore {
  loading: boolean;
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

export const useWinningStore = create<WinningStore>((set) => ({
  loading: false,
  activeGameType: '',
  categoryFilter: 'Total Winners and Winnings',
  dateFilter: 'Specific Date',
  firstDateSpecific: null,
  secondDateSpecific: null,
  firstDateDuration: null,
  secondDateDuration: null,
  

  setLoading: ()=> set((state)=> ({loading: !state.loading})),
  setGameType: (gameType) => set({ activeGameType: gameType }),

  setCategoryFilter: (category:categoryType) => set({ categoryFilter: category }),
  setDateFilter: (type:dateType) => set({ dateFilter: type }),
  setFirstDateSpecific: (date) => set({ firstDateSpecific: date }),
  setSecondDateSpecific: (date) => set({ secondDateSpecific: date }),
  setFirstDateDuration: (date) => set({ firstDateDuration: date }),
  setSecondDateDuration: (date) => set({ secondDateDuration: date }),
  resetFilters: () =>
    set({
      categoryFilter: 'Total Winners and Winnings',
      dateFilter: 'Specific Date',
      firstDateSpecific: null,
      secondDateSpecific: null,
      firstDateDuration: null,
      secondDateDuration: null
    }),
}));
