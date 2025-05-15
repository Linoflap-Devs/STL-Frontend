import React, { useState, useEffect } from "react";
import { Box, Typography, Stack, CircularProgress } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import getTransactionsData from "~/utils/api/transactions/get.TransactionsData.service";
import { addLabels } from "./tooltips/dataSet";

const CustomLegend = () => (
  <Stack direction="row" spacing={2} justifyContent="left" sx={{ mt: 0.5, mr: 4 }}>
    <Box sx={{ display: "flex", alignItems: "center"}}>
      <Box sx={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#BB86FC", mr: 1.5 }} />
      <Typography color="#212121">Bettors</Typography>
    </Box>
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#5050A5", mr: 1.5 }} />
      <Typography color="#212121">Bets</Typography>
    </Box>
  </Stack>
);
interface TransactionData {
  TransactionDate: string;
  RegionId: number;
  Region: string;
  ProvinceId: number;
  Province: string;
  GameCategoryId: number;
  GameCategory: string;
  DrawOrder: 1 | 2 | 3;
  TotalBets: number;
  TotalBettors: number;
  TotalWinners: number;
  TotalBetAmount: number;
  TotalTumbok: number;
  TotalSahod: number;
  TotalRamble: number;
  TotalPayout: number;
  TotalEarnings: number;
  CombinationOne: string | null;
  CombinationTwo: string | null;
  CombinationThree: string | null;
  CombinationFour: string | null;
}

const ChartBettorsvsBetsPlacedSummary = (params: { gameCategoryId?: number }) => {
  console.log('BettersvsBetsPlacedChart Params:', params)
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<
    { draw: string; bettors: number; bets: number }[]
  >([]);
  
  console.log('Chart Data', chartData)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getTransactionsData("/transactions/getHistorical", {}) as TransactionData[];
        console.log('BettorsvsBetsPlaceChart', res)
        const drawMap = {
          1: { draw: "First Draw", bettors: 0, bets: 0 },
          2: { draw: "Second Draw", bettors: 0, bets: 0 },
          3: { draw: "Third Draw", bettors: 0, bets: 0 },
        };

        res.forEach((item) => {
          const drawOrder = item.DrawOrder as 1 | 2 | 3;
          if (drawMap[drawOrder]) {
            drawMap[drawOrder].bettors += item.TotalBettors ?? 0;
            drawMap[drawOrder].bets += item.TotalBets ?? 0;
          }
        });

        setChartData(Object.values(drawMap));
      } catch (error) {
        console.error("Error loading BettorsvsBetsPlacedSummary:", (error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // const xAxisTicks = Array.from({ length: 21 }, (_, i) => i * 5); // 0 to 100

  return (
    <Box
      sx={{
        backgroundColor: "#F8F0E3",
        padding: "1rem",
        borderRadius: "8px",
        paddingBottom: "2rem",
        width: "100%",
        border: "1px solid #0038A8"
      }}
    >
      <Typography color="#212121" sx={{ fontSize: "16px" }}>
        Today&apos;s Bettors and Total Bets
      </Typography>
      <CustomLegend />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
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
          <BarChart
            slotProps={{ legend: { hidden: true } }}
            height={300}
            grid={{ vertical: true }}
            layout="horizontal"
            margin={{ left: 90, right: 20, top: 20, bottom: 40 }}
            dataset={chartData}
            yAxis={[
              {
                scaleType: "band",
                data: chartData.map((item) => item.draw),
              },
            ]}
            xAxis={[
              {
                label: "Amount (in 100,000 units)",
                min: 0,
                max: 100,
                // tickValues: xAxisTicks,
              },
            ]}
            series={addLabels([
              { dataKey: "bettors", color: "#E5C7FF" },
              { dataKey: "bets", color: "#D2A7FF" },
            ])}
          />
        </Box>
      )}
    </Box>
  );
};

export default ChartBettorsvsBetsPlacedSummary;
