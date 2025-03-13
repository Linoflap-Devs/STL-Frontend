import React, { useState, useEffect } from "react";
import { Box, Typography, Divider } from "@mui/material";
import CasinoIcon from "@mui/icons-material/Casino";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { fetchHistoricalRegion } from "~/utils/api/transactions";

interface RegionData {
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
}

const TopBettingRegionPage = () => {
  const [rankedRegions, setRankedRegions] = useState<
    { region: RegionData; rank: number; trend: "up" | "down" | "same" }[]
  >([]);

  const getRankedRegions = async () => {
    const response = await fetchHistoricalRegion();
    console.log("API Response:", response);

    if (response.success && response.data.length > 0) {
      const regionMap = new Map<number, RegionData>();

      response.data.forEach((entry: RegionData) => {
        console.log(`Processing: ${entry.RegionFull} - Bettors: ${entry.TotalBettors}`);

        if (regionMap.has(entry.RegionId)) {
          const existing = regionMap.get(entry.RegionId)!;
          existing.TotalBettors += entry.TotalBettors;
        } else {
          regionMap.set(entry.RegionId, { ...entry });
        }
      });

      const aggregatedRegions = Array.from(regionMap.values())
        .filter(region => region.TotalBettors > 0); // ✅ Remove regions with 0 bettors

      console.log("Filtered Data (No Zero Bettors):", aggregatedRegions);

      const sortedRegions = aggregatedRegions.sort((a, b) => b.TotalBettors - a.TotalBettors);
      console.log("Sorted Regions:", sortedRegions.slice(0, 5));

      const ranked = sortedRegions.slice(0, 5).map((region, index) => ({
        region,
        rank: index + 1,
        trend: index % 2 === 0 ? "up" : "down" as "up" | "down" | "same",
      }));

      console.log("Final Ranked Data:", ranked);

      setRankedRegions(ranked);
    } else {
      console.warn("No data found in API response!");
    }
  };

  useEffect(() => {
    getRankedRegions();
  }, []);

  return (
    <Box sx={{ backgroundColor: "#171717", padding: 2, borderRadius: "10px" }}>
      <Box sx={{ display: "flex", mb: 1 }}>
        <Box sx={{ backgroundColor: "#2F2F2F" }}>
          <CasinoIcon sx={{ color: "#67ABEB" }} />
        </Box>
        <Typography sx={{ fontWeight: 300, fontSize: "16px", ml: 2 }}>
          Top Betting Regions Today
        </Typography>
      </Box>
      <Divider sx={{ backgroundColor: "#303030", mb: "1rem" }} />

      {/* Display Ranked Regions */}
      {rankedRegions.length > 0 ? (
        rankedRegions.map(({ region, rank, trend }) => (
          <Box key={region.RegionId} sx={{ display: "flex", alignItems: "center", padding: "5px 0" }}>
            {/* Rank with Dynamic Color & Icon */}
            <Box sx={{ display: "flex", alignItems: "center", width: "15%" }}>
              <Typography
                sx={{
                  fontWeight: "bold",
                  color: trend === "up" ? "#4CAF50" : "#FF7A7A",
                }}
              >
                {rank}
              </Typography>
              {trend === "up" ? (
                <ArrowUpwardIcon sx={{ color: "#4CAF50", ml: 0.5, fontSize: 18 }} />
              ) : (
                <ArrowDownwardIcon sx={{ color: "#FF7A7A", ml: 0.5, fontSize: 18 }} />
              )}
            </Box>

            {/* Region Name */}
            <Typography sx={{ color: "#fff", fontWeight: "bold", flex: 1, ml: 2 }}>
              {region.RegionFull}
            </Typography>

            {/* Total Bettors */}
            <Typography sx={{ textAlign: "center", flex: 1 }}>
              {region.TotalBettors.toLocaleString()}
            </Typography>
          </Box>
        ))
      ) : (
        <Typography sx={{ textAlign: "center", color: "#888" }}>
          No data available
        </Typography>
      )}
    </Box>
  );
};

export default TopBettingRegionPage;
