import { useEffect, useState } from "react";
import { Box, Typography, Divider, CircularProgress } from "@mui/material";
import CasinoIcon from '@mui/icons-material/Casino';
import { fetchHistoricalRegion, fetchHistoricalSummary } from "~/utils/api/transactions";
import { historicalSummaryByRegionCategory } from "~/utils/transforms";
import { FaDiceSix } from "react-icons/fa";

interface RegionData {
  Region: string;
  TotalBetAmount: number;
  trend?: number | undefined;
}

const TableBettingActivityToday = (params: {gameCategoryId?: number}) => {
  const [rankedRegions, setRankedRegions] = useState<
      { region: RegionData; rank: number; trend: number }[]
    >([]);
  const [ isLoading, setIsLoading ] = useState(false);
  
    const getBettingRegions = async () => {
      setIsLoading(true)
      const today = new Date().toISOString().split('T')[0];
  
      console.log("Date Today, TopBettingRegion: ", today)
    
      // Assuming fetchHistoricalRegion accepts a date parameter
      const response = await fetchHistoricalRegion({ date: today });
    
      if (!response.success || response.data.length === 0) {
        console.warn("No data found in API response!");
        return;
      }

      let filteredData = response.data.filter(
        (item: { TransactionDate: string }) =>
          item.TransactionDate.startsWith(today)
      );

      if(params.gameCategoryId && params.gameCategoryId > 0) {
        const historicalSummary = await fetchHistoricalSummary();
        const filteredSummary = historicalSummary.data.filter(
          (item: { TransactionDate: string }) =>
            item.TransactionDate.startsWith(today)
        )
        filteredData = historicalSummaryByRegionCategory(filteredSummary, params.gameCategoryId);
        console.log(filteredData)
      }
    
      // Aggregate TotalBettors per RegionId using reduce()
      const regionMap: Map<number, RegionData> = filteredData.reduce((map: { get: (arg0: any) => any; set: (arg0: any, arg1: any) => void; }, entry: { RegionId: any; TotalBettors: any; }) => {
        const existing = map.get(entry.RegionId);
        if (existing) {
          existing.TotalBettors += entry.TotalBettors;
        } else {
          map.set(entry.RegionId, { ...entry });
        }
        return map;
      }, new Map<number, RegionData>());
    
      // Convert to array and explicitly cast to RegionData[]
      const sortedRegions = Array.from(regionMap.values() as Iterable<RegionData>)
        .sort((a, b) => b.TotalBetAmount - a.TotalBetAmount)
        // .filter(region => region.TotalBetAmount > 0);
    
      const ranked: { region: RegionData; rank: number; trend: number }[] =
        sortedRegions.map((region, index) => ({
          region,
          rank: index + 1,
          trend: index,
        }));
    
      setRankedRegions(ranked);
      setIsLoading(false)
    };
    
    useEffect(() => {
      getBettingRegions();
    }, [params.gameCategoryId]);

  // Hardcoded data for all Philippine regions
  // const [regionData] = useState<RegionData[]>([
  //   { Region: "National Capital Region (NCR)", TotalBetAmount: 1850000, trend: 3 },
  //   { Region: "Cordillera Administrative Region (CAR)", TotalBetAmount: 320000, trend: 1 },
  //   { Region: "Ilocos Region (Region I)", TotalBetAmount: 450000, trend: -1 },
  //   { Region: "Cagayan Valley (Region II)", TotalBetAmount: 380000, trend: 2 },
  //   { Region: "Central Luzon (Region III)", TotalBetAmount: 920000, trend: 1 },
  //   { Region: "Calabarzon (Region IV-A)", TotalBetAmount: 1150000, trend: 2 },
  //   { Region: "Mimaropa (Region IV-B)", TotalBetAmount: 280000, trend: 2 },
  //   { Region: "Bicol Region (Region V)", TotalBetAmount: 350000, trend: -1 },
  //   { Region: "Western Visayas (Region VI)", TotalBetAmount: 510000, trend: 1 },
  //   { Region: "Central Visayas (Region VII)", TotalBetAmount: 680000, trend: 3 },
  //   { Region: "Eastern Visayas (Region VIII)", TotalBetAmount: 290000, trend: -2 },
  //   { Region: "Zamboanga Peninsula (Region IX)", TotalBetAmount: 310000, trend: 2 },
  //   { Region: "Northern Mindanao (Region X)", TotalBetAmount: 390000, trend: 1 },
  //   { Region: "Davao Region (Region XI)", TotalBetAmount: 550000, trend: 2 },
  //   { Region: "Soccsksargen (Region XII)", TotalBetAmount: 330000, trend: -1 },
  // ]);

  return (
    <div className="w-full flex-1 bg-transparent p-4 rounded-xl border border-[#0038A8] flex flex-col">
      <div className="flex mb-2 items-center w-full">
        <div className="bg-[#0038A8] rounded-lg p-1">
          <FaDiceSix size={24} color={"#F6BA12"} />
        </div>
        <div className="flex items-center justify-between flex-1 ml-3">
          <p className="text-base">Top Betting Regions Today</p>
          <button className="text-xs bg-[#0038A8] hover:bg-blue-700 text-white px-3 py-2 rounded-lg">
            View Comparison
          </button>
        </div>
      </div>
      <div className="h-px bg-[#303030] mb-4" />
      <div className="mt-2 w-full max-h-[720px] overflow-y-auto">
        {rankedRegions.map((item, index) => (
          <div
            key={index}
            className={`flex items-center py-2 ${
              index === rankedRegions.length - 1 ? "border-none" : ""
            }`}
          >
            <div className="flex items-center w-[15%]">
              <span
                className={`font-bold text-[0.85rem] ${
                  item.trend > 0
                    ? "text-[#046115]"
                    : item.trend < 0
                      ? "text-[#CE1126]"
                      : "text-[#aaa]"
                }`}
              >
                {item.trend > 0
                  ? `↑${item.trend}`
                  : item.trend < 0
                    ? `↓${Math.abs(item.trend)}`
                    : "→"}
              </span>
            </div>

            <p className="text-[#0038A8] flex-1 ml-2 text-[0.9rem] whitespace-nowrap overflow-hidden text-ellipsis">
              {item.region.Region}
            </p>

            <p className="text-[#212121] font-bold text-right flex-1 text-[0.95rem]">
              ₱{item.region.TotalBetAmount.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
    <Box 
      sx={{ 
        backgroundColor: "#F8F0E3", padding: 2, 
        borderRadius: "10px", 
        width: "100%", 
        height: "720px",
        border: "1px solid #0038A8"
      }}>
      <Box sx={{ display: "flex", mb: 1}}>
        <Box
          sx={{
            backgroundColor: "#2F2F2F",
            padding: "5px",
            borderRadius: "5px",
          }}
        >
          <CasinoIcon 
          sx={{ color: "#67ABEB" }} />
        </Box>
        <Typography
          sx={{ 
            fontWeight: 300,
            fontSize: "16px", 
            ml: 1, 
            color: "#0038A8" 
          }}
        >
          Today&apos;s Total Bets Placed by Region 
        </Typography>
      </Box>
      <Divider 
      sx={{ 
        backgroundColor: "#303030", 
        mb: "1rem" 
        }} 
      />

      {
        isLoading ? (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "720px" }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box 
            sx={{ 
              mt: 2,
              width: "100%", 
              maxHeight: "720px", 
              overflowY: "auto" 
              }}
          >
            {rankedRegions.map((item, index) => (
              <Box
                key={index}
                sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  padding: "8px 0",
                  borderBottom: "1px solid #303030",
                  '&:last-child': {
                    borderBottom: "none"
                  }
                }}
              >
                <Box 
                  sx={{ 
                    display: "flex", alignItems: "center", width: "15%" 
                    }}
                >
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      fontSize: "0.85rem",
                      color:
                        item.trend! > 0
                          ? "#046115"
                          : item.trend! < 0
                            ? "#CE1126"
                            : "#aaa",
                    }}
                  >
                    {item.trend! > 0
                      ? `↑${item.trend}`
                      : item.trend! < 0
                        ? `↓${Math.abs(item.trend ?? 0)}`
                        : "→"}
                  </Typography>
                </Box>
                <Typography 
                  sx={{ 
                    color: "#0038A8", 
                    flex: 1, 
                    ml: 2, 
                    fontSize: "0.9rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                >
                  {item.region.Region}
                </Typography>
                <Typography
                  sx={{
                    color: "#212121",
                    fontWeight: "bold",
                    textAlign: "right",
                    flex: 1,
                    fontSize: "0.95rem",
                  }}
                >
                  ₱{item.region.TotalBetAmount.toLocaleString()}
                </Typography>
              </Box>
            ))}
          </Box>

        )
      }

    </Box>
  );
};

export default TableBettingActivityToday;
