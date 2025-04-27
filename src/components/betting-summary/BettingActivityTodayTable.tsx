import { useEffect, useState } from "react";
import { Box, Typography, Divider } from "@mui/material";
import CasinoIcon from '@mui/icons-material/Casino';
import { fetchHistoricalRegion, fetchHistoricalSummary } from "~/utils/api/transactions";
import { historicalSummaryByRegionCategory } from "~/utils/transforms";

interface RegionData {
  Region: string;
  TotalBetAmount: number;
  trend?: number | undefined;
}

const TableBettingActivityToday = (params: {gameCategoryId?: number}) => {
  const [rankedRegions, setRankedRegions] = useState<
      { region: RegionData; rank: number; trend: number }[]
    >([]);
  
    const getBettingRegions = async () => {
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
    };
    
    useEffect(() => {
      getBettingRegions();
    }, []);

  // Hardcoded data for all Philippine regions
  const [regionData] = useState<RegionData[]>([
    { Region: "National Capital Region (NCR)", TotalBetAmount: 1850000, trend: 3 },
    { Region: "Cordillera Administrative Region (CAR)", TotalBetAmount: 320000, trend: 1 },
    { Region: "Ilocos Region (Region I)", TotalBetAmount: 450000, trend: -1 },
    { Region: "Cagayan Valley (Region II)", TotalBetAmount: 380000, trend: 2 },
    { Region: "Central Luzon (Region III)", TotalBetAmount: 920000, trend: 1 },
    { Region: "Calabarzon (Region IV-A)", TotalBetAmount: 1150000, trend: 2 },
    { Region: "Mimaropa (Region IV-B)", TotalBetAmount: 280000, trend: 2 },
    { Region: "Bicol Region (Region V)", TotalBetAmount: 350000, trend: -1 },
    { Region: "Western Visayas (Region VI)", TotalBetAmount: 510000, trend: 1 },
    { Region: "Central Visayas (Region VII)", TotalBetAmount: 680000, trend: 3 },
    { Region: "Eastern Visayas (Region VIII)", TotalBetAmount: 290000, trend: -2 },
    { Region: "Zamboanga Peninsula (Region IX)", TotalBetAmount: 310000, trend: 2 },
    { Region: "Northern Mindanao (Region X)", TotalBetAmount: 390000, trend: 1 },
    { Region: "Davao Region (Region XI)", TotalBetAmount: 550000, trend: 2 },
    { Region: "Soccsksargen (Region XII)", TotalBetAmount: 330000, trend: -1 },
  ]);

  return (
    <Box 
      sx={{ 
        backgroundColor: "#171717", padding: 2, 
        borderRadius: "10px", 
        width: "100%", 
        height: "720px" 
      }}>
      <Box sx={{ display: "flex", mb: 1 }}>
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
            color: "#fff" 
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
                      ? "#3d8440"
                      : item.trend! < 0
                        ? "#894747"
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
                color: "#fff", 
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
                color: "#67ABEB",
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
    </Box>
  );
};

export default TableBettingActivityToday;