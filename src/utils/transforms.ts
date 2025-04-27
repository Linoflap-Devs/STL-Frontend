interface HistoricalSummary {
    TransactionDate: Date,
    RegionId: number,
    Region: string,
    ProvinceId: number,
    Province: string,
    GameCategoryId: number,
    GameCategory: string,
    DrawOrder: number,
    TotalBets: number,
    TotalBettors: number,
    TotalWinners: number,
    TotalBetAmount: number,
    TotalPayout: number,
    TotalEarnings: number,
    CombinationOne: number,
    CombinationTwo: number,
    CombinationThree: number,
    CombinationFour: number
}

interface HistoricalRegion {
    TransactionDate: Date,
    RegionId: number,
    Region: string,
    RegionFull: string,
    TotalBets: number,
    TotalBettors: number,
    TotalWinners: number,
    TotalBetAmount: number,
    TotalPayout: number,
    TotalEarnings: number
}

export const historicalSummaryByRegionCategory = (data: HistoricalSummary[], gameCategory?: number): HistoricalRegion[] => {

  const regionMap = new Map();
  
  let filteredData = gameCategory ? 
    data.filter(item => item.GameCategoryId === gameCategory) : 
    data;

  filteredData.forEach(transaction => {
    const regionId = transaction.RegionId;
    
    if (!regionMap.has(regionId)) {
      regionMap.set(regionId, {
        TransactionDate: transaction.TransactionDate,
        RegionId: regionId,
        Region: transaction.Region,
        RegionFull: getRegionFull(transaction.Region), 
        TotalBets: 0,
        TotalBettors: 0,
        TotalWinners: 0,
        TotalBetAmount: 0,
        TotalPayout: 0,
        TotalEarnings: 0
      });
    }
    
    const regionData = regionMap.get(regionId);
    
    regionData.TotalBets += transaction.TotalBets;
    regionData.TotalBettors += transaction.TotalBettors;
    regionData.TotalWinners += transaction.TotalWinners;
    regionData.TotalBetAmount += transaction.TotalBetAmount;
    regionData.TotalPayout += transaction.TotalPayout;
    regionData.TotalEarnings += transaction.TotalEarnings;
  });
  
  // Convert the Map values to an array
  return Array.from(regionMap.values());
}

const getRegionFull = (region: string): string => {
    const regionMap: Record<string, string> = {
        'NCR': 'National Capital Region',
        'CAR': 'Cordillera Administrative Region',
        'Region I': 'Ilocos Region',
        'Region II': 'Cagayan Valley',
        'Region III':'Central Luzon',
        'Region IV-A': 'CALABARZON',
        'Region IV-B': 'MIMAROPA',
        'Region V': 'Bicol Region',
        'Region VI': 'Western Visayas',
        'Region VII': 'Central Visayas',
        'Region VIII': 'Eastern Visayas',
        'Region IX': 'Zamboanga Peninsula',
        'Region X': 'Northern Mindanao',
       ' Region XI': 'Davao Region',
        'Region XII': 'SOCCSKARGEN',
        'Region XIII': 'CARAGA',
        'BARMM':'Bangsamoro Autonomous Region in Muslim Mindanao'
      };
      
    return regionMap[region] || region;
}