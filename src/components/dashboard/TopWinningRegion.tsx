import React, { useState, useEffect } from "react";
import { fetchHistoricalRegion } from "~/utils/api/transactions";
import { FaMoneyBillAlt } from "react-icons/fa";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

interface RegionData {
  RegionId: number;
  Region: string;
  RegionFull: string;
  TotalWinners: number;
}

const TopWinningRegionPage = () => {
  const [rankedRegions, setRankedRegions] = useState<
    { region: RegionData; rank: number; trend: "up" | "down" | "same" }[]
  >([]);

  const getWinningRegions = async () => {
    const response = await fetchHistoricalRegion();

    if (!response.success || response.data.length === 0) {
      console.warn("No data found in API response!");
      return;
    }

    // Aggregate TotalBettors per RegionId using reduce()
    const regionMap: Map<number, RegionData> = response.data.reduce((map: { get: (arg0: any) => any; set: (arg0: any, arg1: any) => void; }, entry: { RegionId: any; TotalBettors: any; }) => {
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
      .sort((a, b) => b.TotalWinners - a.TotalWinners)
      .filter(region => region.TotalWinners > 0);

    const ranked: { region: RegionData; rank: number; trend: "up" | "down" | "same" }[] =
      sortedRegions.slice(0, 5).map((region, index) => ({
        region,
        rank: index + 1,
        trend: index % 2 === 0 ? "up" : "down",
      }));

    setRankedRegions(ranked);
  };

  useEffect(() => {
    getWinningRegions();
  }, []);

  return (
  <div className="bg-transparent p-4 rounded-xl border border-[#0038A8]">
      <div className="flex mb-2">
        <div className="bg-[#2F2F2F] p-1 rounded-lg">
          <FaMoneyBillAlt size={24} color={"#67ABEB"}/>
        </div>
        <p className="font-light text-base ml-2">
          Top Winning Regions Today
        </p>
      </div>
      <div className="bg-[#303030] h-px mb-4" />

      {/* Display Ranked Regions */}
      {rankedRegions.length > 0 ? (
        rankedRegions.map(({ region, rank, trend }) => (
          <div key={region.RegionId} className="flex items-center py-1">
            <div className="flex items-center w-[15%]">
              <span className={`font-bold ${trend === "up" ? "text-[#4CAF50]" : "text-[#FF7A7A]"}`}>
                {rank}
              </span>
              {trend === "up" ? (
                <ArrowUpwardIcon className="text-[#4CAF50] ml-1 text-lg" />
              ) : (
                <ArrowDownwardIcon className="text-[#FF7A7A] ml-1 text-lg" />
              )}
            </div>
            <p className="text-white font-bold flex-1 ml-4">
              {region.RegionFull}
            </p>
            <p className="text-center flex-1">
              {region.TotalWinners.toLocaleString()}
            </p>
          </div>
        ))
      ) : (
        <p className="text-center text-[#888]">
          No data available
        </p>
      )}
    </div>
  );
};

export default TopWinningRegionPage;