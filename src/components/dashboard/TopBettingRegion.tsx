import React, { useState, useEffect } from "react";
import { FaDiceSix } from "react-icons/fa";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { fetchHistoricalRegion } from "~/utils/api/transactions";

interface RegionData {
  RegionId: number;
  Region: string;
  RegionFull: string;
  TotalBettors: number;
}

const TopBettingRegionPage = () => {
  const [rankedRegions, setRankedRegions] = useState<
    { region: RegionData; rank: number; trend: "up" | "down" | "same" }[]
  >([]);

  const getBettingRegions = async () => {
    const today = new Date().toISOString().split("T")[0];

    console.log("Date Today, TopBettingRegion: ", today);

    // Assuming fetchHistoricalRegion accepts a date parameter
    const response = await fetchHistoricalRegion({ date: today });

    if (!response.success || response.data.length === 0) {
      console.warn("No data found in API response!");
      return;
    }
    const filteredData = response.data.filter(
      (item: { TransactionDate: string }) =>
        item.TransactionDate.startsWith(today)
    );

    // Aggregate TotalBettors per RegionId using reduce()
    const regionMap: Map<number, RegionData> = filteredData.reduce(
      (
        map: { get: (arg0: any) => any; set: (arg0: any, arg1: any) => void },
        entry: { RegionId: any; TotalBettors: any }
      ) => {
        const existing = map.get(entry.RegionId);
        if (existing) {
          existing.TotalBettors += entry.TotalBettors;
        } else {
          map.set(entry.RegionId, { ...entry });
        }
        return map;
      },
      new Map<number, RegionData>()
    );

    // Convert to array and explicitly cast to RegionData[]
    const sortedRegions = Array.from(regionMap.values() as Iterable<RegionData>)
      .sort((a, b) => b.TotalBettors - a.TotalBettors)
      .filter((region) => region.TotalBettors > 0);

    const ranked: {
      region: RegionData;
      rank: number;
      trend: "up" | "down" | "same";
    }[] = sortedRegions.slice(0, 5).map((region, index) => ({
      region,
      rank: index + 1,
      trend: index % 2 === 0 ? "up" : "down",
    }));

    setRankedRegions(ranked);
  };

  useEffect(() => {
    getBettingRegions();
  }, []);

  return (
    <div className="bg-[#171717] p-4 rounded-xl">
      <div className="flex mb-2">
        <div className="bg-[#2F2F2F] p-1 rounded-lg">
          <FaDiceSix size={24} className="text-[#67ABEB]" />
        </div>
        <p className="font-light text-base ml-2">Top Betting Regions Today</p>
      </div>
      <div className="h-px bg-[#303030] mb-4" />

      {/* Display Ranked Regions */}
      {rankedRegions.length > 0 ? (
        rankedRegions.map(({ region, rank, trend }) => (
          <div key={region.RegionId} className="flex items-center py-1">
            <div className="flex items-center w-[15%]">
              <p
                className={`font-bold ${
                  trend === "up" ? "text-[#4CAF50]" : "text-[#FF7A7A]"
                }`}
              >
                {rank}
              </p>
              {trend === "up" ? (
                <ArrowUpward className="text-[#4CAF50] ml-1 w-4 h-4" />
              ) : (
                <ArrowDownward className="text-[#FF7A7A] ml-1 w-4 h-4" />
              )}
            </div>
            <p className="text-white font-bold flex-1 ml-2">
              {region.RegionFull}
            </p>
            <p className="text-center flex-1">
              {region.TotalBettors.toLocaleString()}
            </p>
          </div>
        ))
      ) : (
        <p className="text-center text-[#888]">No data available</p>
      )}
    </div>
  );
};

export default TopBettingRegionPage;
