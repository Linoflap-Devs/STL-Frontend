import { create } from 'zustand';
import getTransactionsData from '~/utils/api/transactions/get.TransactionsData.service';

export type categoryType = 
  'Total Winners and Winnings' |
  'Total Winnings by Bet Type' |
  'Total Winners by Bet Type' |
  'Total Winnings by Game Type' |
  'Total Winners by Game Type' |
  'Top Winning Region by Winnings Comparison' |
  'Top Winner Region by Winners Comparison';

type dateType = 'Specific Date' | 'Date Duration';

export interface WinnersandWinningsSummaryProps {
  categoryFilter: categoryType;
  dateFilter: string;
  firstDateSpecific: string | null;
  secondDateSpecific: string | null;
  firstDateDuration: string | null;
  secondDateDuration: string | null;
}

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
  cardsAggregatedData: {
    totalBettors: number;
    totalWinners: number;
    totalBets: number;
    totalPayout: number;
    totalRevenue: number;
  };
  

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
  fetchAndAggregateDate: () => Promise<void>;
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
  cardsAggregatedData: {
    totalBettors: 0,
    totalWinners: 0,
    totalBets: 0,
    totalPayout: 0,
    totalRevenue: 0,
  },

  setLoading: () => set((state) => ({ loading: !state.loading })),
  setGameType: (gameType) => set({ activeGameType: gameType }),
  setCategoryFilter: (category: categoryType) => set({ categoryFilter: category }),
  setDateFilter: (type: dateType) => set({ dateFilter: type }),
  setFirstDateSpecific: (date) => set({ firstDateSpecific: date }),
  setSecondDateSpecific: (date) => set({ secondDateSpecific: date }),
  setFirstDateDuration: (date) => set({ firstDateDuration: date }),
  setSecondDateDuration: (date) => set({ secondDateDuration: date }),

  fetchAndAggregateDate: async () => {
    try {
      // Fetch the data using the getTransactionsData function
      const data = await getTransactionsData<{
        TransactionDate: string;
        RegionId: number;
        Region: string;
        RegionFull: string;
        TotalBets: number;
        TotalBettors: number;
        TotalWinners: number;
        TotalBetAmount: number;
        TotalPayout: number;
        TotalEarnings: number;
      }[]>("/transactions/getHistoricalRegion", {});

      console.log(`Winning Dashboard Cards Data:`, JSON.stringify(data, null, 2));

      // Check if data is valid and is an array
      if (data && Array.isArray(data)) {
        // Aggregate the totals
        const totals = data.reduce(
          (acc, item) => {
            acc.totalBettors += item.TotalBettors;
            acc.totalWinners += item.TotalWinners;
            acc.totalBets += item.TotalBets;
            acc.totalPayout += item.TotalPayout;
            acc.totalRevenue += item.TotalEarnings;
            return acc;
          },
          {
            totalBettors: 0,
            totalWinners: 0,
            totalBets: 0,
            totalPayout: 0,
            totalRevenue: 0,
          }
        );

        // Update the store with the aggregated data
        set({ cardsAggregatedData: totals });
      } else {
        console.error("Unexpected data format or no data returned:", data);
      }
    } catch (error) {
      console.error("Error fetching and aggregating data:", error);
    }
  },

  resetFilters: () =>
    set({
      categoryFilter: 'Total Winners and Winnings',
      dateFilter: 'Specific Date',
      firstDateSpecific: null,
      secondDateSpecific: null,
      firstDateDuration: null,
      secondDateDuration: null,
    }),
}));

// Map here, for Custom Legend if the Selected Date Type (Specific)
export const getLegendItemsMap_Specific = (
  categoryFilter: categoryType,
  firstDateSpecific: string | null,
  secondDateSpecific: string | null
): { label: string; color: string }[] => {
  const legendItemsMap: Record<categoryType, { label: string; color: string }[]> = {
      "Total Winners and Winnings": [
        {
          label: `Bettors - ${firstDateSpecific ? firstDateSpecific : "N/A"}`,
          color: "#E5C7FF",
        },
        {
          label: `Bettors - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
          color: "#D2A7FF",
        },
        {
          label: `Bets - ${firstDateSpecific ? firstDateSpecific : "N/A"}`,
          color: "#D2A7FF",
        },
        {
          label: `Bets - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
          color: "#D2A7FF",
        },
      ],
      "Total Winnings by Bet Type": [
        {
          label: `Tumbok - ${firstDateSpecific ? firstDateSpecific : "N/A"}`,
          color: "#E5C7FF",
        },
        {
          label: `Tumbok - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
          color: "#D2A7FF",
        },
        {
          label: `Sahod - ${firstDateSpecific ? firstDateSpecific : "N/A"}`,
          color: "#D2A7FF",
        },
        {
          label: `Sahod - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
          color: "#D2A7FF",
        },
      ],
      "Total Winners by Bet Type": [
        {
          label: `Tumbok - ${firstDateSpecific ? firstDateSpecific : "N/A"}`,
          color: "#E5C7FF",
        },
        {
          label: `Tumbok - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
          color: "#D2A7FF",
        },
        {
          label: `Sahod - ${firstDateSpecific ? firstDateSpecific : "N/A"}`,
          color: "#D2A7FF",
        },
        {
          label: `Sahod - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
          color: "#D2A7FF",
        },
      ],
      "Total Winnings by Game Type": [
        {
          label: `STL Pares - ${firstDateSpecific ? firstDateSpecific : "N/A"}`,
          color: "#E5C7FF",
        },
        {
          label: `STL Pares - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
          color: "#E5C7FF",
        },
        {
          label: `STL Swer2 - ${firstDateSpecific ? firstDateSpecific : "N/A"}`,
          color: "#BB86FC",
        },
        {
          label: `STL Swer2 - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
          color: "#BB86FC",
        },
        {
          label: `STL Swer3 - ${firstDateSpecific ? firstDateSpecific : "N/A"}`,
          color: "#6F58C9",
        },
        {
          label: `STL Swer3 - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
          color: "#6F58C9",
        },
        {
          label: `STL Swer4 - ${firstDateSpecific ? firstDateSpecific : "N/A"}`,
          color: "#3E2466",
        },
        {
          label: `STL Swer4 - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
          color: "#3E2466",
        },
      ],
      "Total Winners by Game Type": [
        {
          label: `STL Pares - ${firstDateSpecific ? firstDateSpecific : "N/A"}`,
          color: "#E5C7FF",
        },
        {
          label: `STL Pares - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
          color: "#E5C7FF",
        },
        {
          label: `STL Swer2 - ${firstDateSpecific ? firstDateSpecific : "N/A"}`,
          color: "#BB86FC",
        },
        {
          label: `STL Swer2 - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
          color: "#BB86FC",
        },
        {
          label: `STL Swer3 - ${firstDateSpecific ? firstDateSpecific : "N/A"}`,
          color: "#6F58C9",
        },
        {
          label: `STL Swer3 - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
          color: "#6F58C9",
        },
        {
          label: `STL Swer4 - ${firstDateSpecific ? firstDateSpecific : "N/A"}`,
          color: "#3E2466",
        },
        {
          label: `STL Swer4 - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
          color: "#3E2466",
        },
      ],
      "Top Winning Region by Winnings Comparison": [
        {
          label: "Ranking",
          color: "#E5C7FF",
        },
        {
          label: "Ranking",
          color: "##3E2466",
        },
      ],
      "Top Winner Region by Winners Comparison": [
        {
          label: "Ranking",
          color: "#E5C7FF",
        },
        {
          label: "Ranking",
          color: "##3E2466",
        },
      ],
    }


  return legendItemsMap[categoryFilter];
}
// Map here, for Custom Legend if the Selected Date Type (Duration)
export const getLegendItemsMap_Duration = (
  categoryFilter: categoryType,
  firstDateSpecific: string | null,
  secondDateSpecific: string | null,
  firstDateDuration: string | null,
  secondDateDuration: string | null
): { label: string; color: string }[] => {
  const legendItemsMap: Record<categoryType, { label: string; color: string }[]> = {
    "Total Winners and Winnings": [
      {
        label: `Bettors - ${firstDateSpecific ? firstDateSpecific : "N/A"} - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
        color: "#E5C7FF",
      },
      {
        label: `Bettors - ${firstDateDuration ? firstDateDuration : "N/A"} - ${secondDateDuration ? secondDateDuration : "N/A"}`,
        color: "#D2A7FF",
      },
      {
        label: `Bets - ${firstDateSpecific ? firstDateSpecific : "N/A"} - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
        color: "#D2A7FF",
      },
      {
        label: `Bets - ${firstDateDuration ? firstDateDuration : "N/A"} - ${secondDateDuration ? secondDateDuration : "N/A"}`,
        color: "#D2A7FF",
      },
    ],
    "Total Winnings by Bet Type": [
      {
        label: `Tumbok - ${firstDateSpecific ? firstDateSpecific : "N/A"} - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
        color: "#E5C7FF",
      },
      {
        label: `Tumbok - ${firstDateDuration ? firstDateDuration : "N/A"} - ${secondDateDuration ? secondDateDuration : "N/A"}`,
        color: "#D2A7FF",
      },
      {
        label: `Sahod - ${firstDateSpecific ? firstDateSpecific : "N/A"} - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
        color: "#D2A7FF",
      },
      {
        label: `Sahod - ${firstDateDuration ? firstDateDuration : "N/A"} - ${secondDateDuration ? secondDateDuration : "N/A"}`,
        color: "#D2A7FF",
      },
    ],
    "Total Winners by Bet Type": [
      {
        label: `Tumbok - ${firstDateSpecific ? firstDateSpecific : "N/A"} - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
        color: "#E5C7FF",
      },
      {
        label: `Tumbok - ${firstDateDuration ? firstDateDuration : "N/A"} - ${secondDateDuration ? secondDateDuration : "N/A"}`,
        color: "#D2A7FF",
      },
      {
        label: `Sahod - ${firstDateSpecific ? firstDateSpecific : "N/A"} - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
        color: "#D2A7FF",
      },
      {
        label: `Sahod - ${firstDateDuration ? firstDateDuration : "N/A"} - ${secondDateDuration ? secondDateDuration : "N/A"}`,
        color: "#D2A7FF",
      },
    ],
    "Total Winnings by Game Type": [
      {
        label: `STL Pares - ${firstDateSpecific ? firstDateSpecific : "N/A"} - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
        color: "#E5C7FF",
      },
      {
        label: `STL Pares - ${firstDateDuration ? firstDateDuration : "N/A"} - ${secondDateDuration ? secondDateDuration : "N/A"}`,
        color: "#E5C7FF",
      },
      {
        label: `STL Swer2 - ${firstDateSpecific ? firstDateSpecific : "N/A"} - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
        color: "#E5C7FF",
      },
      {
        label: `STL Swer2 - ${firstDateDuration ? firstDateDuration : "N/A"} - ${secondDateDuration ? secondDateDuration : "N/A"}`,
        color: "#E5C7FF",
      },
      {
        label: `STL Swer3 - ${firstDateSpecific ? firstDateSpecific : "N/A"} - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
        color: "#6F58C9",
      },
      {
        label: `STL Swer3 - ${firstDateDuration ? firstDateDuration : "N/A"} - ${secondDateDuration ? secondDateDuration : "N/A"}`,
        color: "#6F58C9",
      },
      {
        label: `STL Swer4 - ${firstDateSpecific ? firstDateSpecific : "N/A"} - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
        color: "#6F58C9",
      },
      {
        label: `STL Swer4 - ${firstDateDuration ? firstDateDuration : "N/A"} - ${secondDateDuration ? secondDateDuration : "N/A"}`,
        color: "#6F58C9",
      },
    ],
    "Total Winners by Game Type": [
      {
        label: `STL Pares - ${firstDateSpecific ? firstDateSpecific : "N/A"} - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
        color: "#E5C7FF",
      },
      {
        label: `STL Pares - ${firstDateDuration ? firstDateDuration : "N/A"} - ${secondDateDuration ? secondDateDuration : "N/A"}`,
        color: "#E5C7FF",
      },
      {
        label: `STL Swer2 - ${firstDateSpecific ? firstDateSpecific : "N/A"} - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
        color: "#E5C7FF",
      },
      {
        label: `STL Swer2 - ${firstDateDuration ? firstDateDuration : "N/A"} - ${secondDateDuration ? secondDateDuration : "N/A"}`,
        color: "#E5C7FF",
      },
      {
        label: `STL Swer3 - ${firstDateSpecific ? firstDateSpecific : "N/A"} - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
        color: "#6F58C9",
      },
      {
        label: `STL Swer3 - ${firstDateDuration ? firstDateDuration : "N/A"} - ${secondDateDuration ? secondDateDuration : "N/A"}`,
        color: "#6F58C9",
      },
      {
        label: `STL Swer4 - ${firstDateSpecific ? firstDateSpecific : "N/A"} - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
        color: "#6F58C9",
      },
      {
        label: `STL Swer4 - ${firstDateDuration ? firstDateDuration : "N/A"} - ${secondDateDuration ? secondDateDuration : "N/A"}`,
        color: "#6F58C9",
      },
    ],
    "Top Winning Region by Winnings Comparison": [
      {
        label: "Ranking",
        color: "#E5C7FF",
      },
      {
        label: "Ranking",
        color: "##3E2466",
      },
    ],
    "Top Winner Region by Winners Comparison": [
      {
        label: "Ranking",
        color: "#E5C7FF",
      },
      {
        label: "Ranking",
        color: "##3E2466",
      },
    ],
  }

return legendItemsMap[categoryFilter]
}