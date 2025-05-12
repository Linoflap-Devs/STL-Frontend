import React, {useState, useEffect, useCallback} from "react";
import { Box, Typography, Stack, CircularProgress} from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import {
  BettorsandBetsSummaryProps,
  getLegendItemsMap_Specific,
  getLegendItemsMap_Duration,
  useBettingStore,
} from "../../../../store/useBettingStore";

// API Endpoints
import getCompareHistoricalDate from "~/utils/api/transactions/get.CompareHistoricalDate.service";
import getCompareHistoricalDuration from "~/utils/api/transactions/get.CompareHistoricalDuration.service";

interface ChartData {
  region: string;
  firstValue: number;
  secondValue: number;
}
interface Region {
  TransactionDate: string; // ISO date string
  DrawOrder: number | null;
  Region: string;
  GameCategory: string | null;
  TotalBets: number;
  TotalBettors: number;
  TotalTumbok: number;
  TotalSahod: number;
  TotalRamble: number;
}
interface DateSpecific{
  TransactionDate: string;
  DrawOrder: null | undefined;
  Region: string;
  GameCategory: null | undefined;
  TotalBets: number;
  TotalBettors: number;
  TotalTumbok: number | undefined;
  TotalSahod: number | undefined;
  TotalRamble: number | undefined;
  Rank: number;
}
interface DateRange{
  DrawOrder: null | undefined;
  Region: string;
  GameCategory: null | undefined;
  TotalBets: number;
  TotalBettors: number;
  TotalTumbok: number | undefined;
  TotalSahod: number | undefined;
  TotalRamble: number | undefined;
  DateRange: {
    StartDate: string;
    EndDate: string;
  }
  Rank: string;
}
const formatDate = (date: string | null): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};


// Helper to turn e.g. "IV-A" → "Region IV-A", but leave "NCR"/"CAR"/"BARMM" alone
const apiRegionLabel = (r: string) =>
  ["NCR", "CAR", "BARMM"].includes(r) ? r : `Region ${r}`;


const CustomLegend: React.FC<BettorsandBetsSummaryProps> = ({
  categoryFilter,
  dateFilter,
  firstDateSpecific,
  secondDateSpecific,
  firstDateDuration,
  secondDateDuration,
}) => {

  // Determine which legend items map to use based on the dateFilter
  const legendItems =
    dateFilter === "Specific Date"
      ? getLegendItemsMap_Specific(categoryFilter, firstDateSpecific, secondDateSpecific)
      : getLegendItemsMap_Duration(
          categoryFilter,
          firstDateSpecific,
          secondDateSpecific,
          firstDateDuration,
          secondDateDuration
        );
  
  return (
    <Stack direction="row" spacing={4} sx={{ mt: 0.5, mr: 4 }}>
      {legendItems.map((item, index) => (
        <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              backgroundColor: item.color,
              mr: 1.5,
            }}
          />
          <Typography
            color="white"
            sx={{
              fontSize: "12px",
              fontWeight: 400,
              lineHeight: "14px",
            }}
          >
            {item.label}
          </Typography>
        </Box>
      ))}
    </Stack>
  );
};

const ChartTopRegionByBetsandBettors
: React.FC<BettorsandBetsSummaryProps> = ({
  categoryFilter,
  dateFilter,
  firstDateSpecific,
  secondDateSpecific,
  firstDateDuration,
  secondDateDuration,
  activeGameType
}) => {
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const philippineRegions = [
  "NCR", "CAR", "I", "II", "III", "IV-A", "IV-B",
  "V", "VI", "VII", "VIII", "IX", "X", "XI",
  "XII", "XIII", "BARMM"
];
console.log('Active Game Category:', activeGameType)
  // Determine which field to aggregated based on categoryFilter
  const aggregateField = categoryFilter.includes("Bets") ? "TotalBets" : "TotalBettors";
  // Determine chart number based on category
  const chartMap: Record<string, string> = {
    "Total Bettors and Bets": "1",
    "Total Bets by Bet Type": "2",
    "Total Bets by Game Type": "3",
    "Total Bettors by Bet Type": "5",
    "Total Bettors by Game Type": "6",
    "Top Betting Region by Total Bets": "4",
    "Top Betting Region by Total Bettors": "4",
  };
  const urlParam = chartMap[categoryFilter];
  const gameCategoryMap: Record<string, number> = {
    "Dashboard": 0,
    "STL Pares": 1,
    "STL Swer2": 2,
    "STL Swer3": 3,
    "STL Swer4": 4,
  }
  const gameCategoryParam = gameCategoryMap[activeGameType];
  console.log('Game Category Param:', gameCategoryParam)

  // Add gameType parameter if activeGameType is valid (1-4)
  const getGameCategoryParam = () => {
    if(gameCategoryParam && gameCategoryParam >=1 && gameCategoryParam <= 4) {
      return { gameCategory: gameCategoryParam };
    }
    return {};
  }
  // SpecificDate
  const processSpecificPayloadData = (payload: {
    FirstDate: DateSpecific[];
    SecondDate: DateSpecific[];
  }) => {
    const data: ChartData[] = philippineRegions.map(region => {
      const apiLabel = apiRegionLabel(region);
      const firstItem  = payload.FirstDate.find(r => r.Region === apiLabel);
      const secondItem = payload.SecondDate.find(r => r.Region === apiLabel);

      return {
        region,
        firstValue: firstItem?.Rank ?? 0,
        secondValue: secondItem?.Rank ?? 0,
      };
    });
    setChartData(data);
  };
  // SpecificDate
  const processRangePayloadData = (payload: {
    FirstRange: DateRange[];
    SecondRange: DateRange[];
  }) => {
    const data: ChartData[] = philippineRegions.map(region => {
      const apiLabel = apiRegionLabel(region);
      const firstItem  = payload.FirstRange.find(r => r.Region === apiLabel);
      const secondItem = payload.SecondRange.find(r => r.Region === apiLabel);

      return {
        region,
        firstValue: firstItem?.Rank ? parseInt(firstItem.Rank) : 0,
        secondValue: secondItem?.Rank ? parseInt(secondItem.Rank) : 0,
      };
    });
    setChartData(data);
  };
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const gameCategoryParam = getGameCategoryParam();
      if (dateFilter === "Specific Date" && firstDateSpecific && secondDateSpecific) {
        console.log("Fetching Specific Date:", formatDate(firstDateSpecific), formatDate(secondDateSpecific));
        const resp = await getCompareHistoricalDate(
          "/transactions/compareHistoricalDate/chartType/",
          urlParam,
          { 
            first: formatDate(firstDateSpecific), 
            second: formatDate(secondDateSpecific),
            ...gameCategoryParam
          }
        );
        console.log("Payload (Specific Date):", resp);
        // resp now has { FirstDate: [...], SecondDate: [...] }
        if (resp && resp.FirstDate && resp.SecondDate) {
          processSpecificPayloadData(resp);
        } else {
          console.warn("Unexpected payload:", resp);
        }

      } else if (
        dateFilter === "Date Duration" &&
        firstDateSpecific && secondDateSpecific &&
        firstDateDuration && secondDateDuration
      ) {
        console.log("Fetching Date Duration ranges");
        const resp = await getCompareHistoricalDuration(
          "/transactions/compareHistoricalRange/chartType/",
          urlParam,
          {
            firstStart: formatDate(firstDateSpecific),
            firstEnd: formatDate(secondDateSpecific),
            secondStart: formatDate(firstDateDuration),
            secondEnd: formatDate(secondDateDuration),
            ...gameCategoryParam
          }
        );
        console.log("Payload (Date Duration):", resp);
        // resp now has { FirstDate: [...], SecondDate: [...] }
        if (resp && resp.FirstRange && resp.SecondRange) {
          processRangePayloadData(resp);
        } else {
          console.warn("Unexpected payload:", resp);
        }
      }
    } catch (err) {
      console.error("Error fetching chart data:", err);
    } finally {
      setLoading(false);
    }
  }, [
    dateFilter,
    firstDateSpecific,
    secondDateSpecific,
    firstDateDuration,
    secondDateDuration,
    urlParam,
    aggregateField,
    gameCategoryParam
  ]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return (
    <Box
      sx={{
        backgroundColor: "#171717",
        padding: "1rem",
        borderRadius: "8px",
        paddingBottom: "2rem",
        width: "100%",
        height: "685px",
      }}
    >
      <Typography
        color="#FFFFFF"
        sx={{
          fontSize: "16px",
          fontWeight: 400,
          lineHeight: "18px",
          mb: "10px",
        }}
      >
        {`${categoryFilter}`}
      </Typography>
      <CustomLegend
            activeGameType={activeGameType}
            categoryFilter={categoryFilter}
            dateFilter={dateFilter}
            firstDateSpecific={firstDateSpecific}
            secondDateSpecific={secondDateSpecific}
            firstDateDuration={firstDateDuration}
            secondDateDuration={secondDateDuration}
      />
      { loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <CircularProgress />
      </Box>
      ) : (
        <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        <LineChart
          height={600}
          margin={{ left: 90, right: 20, top: 20, bottom: 40 }}
          xAxis={[{ scaleType: "band", data: philippineRegions }]}
            yAxis={[{ label: "Ranking", min: 0, max: 18 }]}
            series={[
              {
                data: chartData.map(item => item.firstValue),
                label: dateFilter === "Specific Date" ? `Ranking\n${firstDateSpecific}`: `${firstDateSpecific} to ${secondDateSpecific}`,
                color: "#E5C7FF",
                curve: "linear"
              },
              {
                data: chartData.map(item => item.secondValue),
                label: dateFilter === "Specific Date" ? `Ranking\n${secondDateSpecific}` : `${firstDateDuration} to ${secondDateDuration}`,
                color: "#3E2466",
                curve: "linear"
              }
            ]}
            grid={{ horizontal: true }}
        />
      </Box>
      )}
    </Box>
  );
};

export default ChartTopRegionByBetsandBettors
;