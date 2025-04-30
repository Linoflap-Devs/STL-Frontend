export const translations = {
  winners: "Winners",
  winnings: "Winnings",
} as const
export const translationsGameTypes = {
  STL_Pares: "STL Pares",
  STL_Swer2: "STL Swer 2",
  STL_Swer3: "STL Swer 3",
  STL_Swer4: "STL Swer 4",
} as const;
//  labels and value formatters
//  T a generic of type, but with restriction
//  Any object of type T must have a property called dataKey
//  The value of that dataKey must be one of the keys of translations.
//  series is a parameter, an array of type T
//  each element in the array must match the rules of T.
export function addLabels<
  T extends { dataKey: keyof typeof translations }
  >(series: T[]) {
  
  // creates new object based on each item
  // adds extra props (label and valueFormatter)
  return series.map((item) => ({
    ...item,
    label: translations[item.dataKey],
    valueFormatter: (v: number | null) => {
      if (v === null) return '-';
      const formattedValue = (v * 100000).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      // Add peso sign for 'bets'
      return item.dataKey === 'winnings' ? `₱ ${formattedValue}` : formattedValue;
    },
  }));
}
export function addLabelsGameTypes<
  T extends { dataKey: keyof typeof translationsGameTypes }
>(series: T[]) {
  return series.map((item) => ({
    ...item,
    label: translationsGameTypes[item.dataKey],
    valueFormatter: (v: number | null) => {
      if (v === null) return '-';
      return (v * 100000).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },
  }));
}

// sample data
export const TodaysWinnersAndWinsData = [
  { 
    draw: "First Draw", 
    winners: 30.44695, 
    winnings: 92.11335 
  },
  { 
    draw: "Second Draw", 
    winners: 27.81, 
    winnings: 82.15   
  },
  { draw: "Third Draw", 
    winners: 21.67, 
    winnings: 78.90       
  },
];

// sample data
export const TodaysWinnerCountByGameTypeData = [
  { 
    draw: "First Draw", 
    STL_Pares: 23.45, 
    STL_Swer2: 18.67,
    STL_Swer3: 22.14,
    STL_Swer4: 19.88,
  },
  { 
    draw: "Second Draw", 
    STL_Pares: 30.25, 
    STL_Swer2: 22.09,
    STL_Swer3: 25.78,
    STL_Swer4: 23.01,    
  },
  { draw: "Third Draw", 
    STL_Pares: 27.81, 
    STL_Swer2: 20.43,
    STL_Swer3: 24.65,
    STL_Swer4: 21.76,
  },
];
