import React, { useEffect } from "react";
import { Box, Typography, Stack } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { fetchHistoricalSummary } from "~/utils/api/transactions";

import { TodaysBettorsAndBetsData, addLabels } from "./tooltips/dataSet";
const CustomLegend = () => (
  <Stack
    direction="row"
    spacing={2}
    justifyContent="left"
    sx={{ mt: 0.5, mr: 4 }}
  >
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box
        sx={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          backgroundColor: "#E5C7FF",
          mr: 1.5,
        }}
      />
      <Typography color="white">Bettors</Typography>
    </Box>
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box
        sx={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          backgroundColor: "#D2A7FF",
          mr: 1.5,
        }}
      />
      <Typography color="white">Bets</Typography>
    </Box>
  </Stack>
);

const ChartBettorsvsBetsPlacedSummary = (params: {
  gameCategoryId?: number;
}) => {
  // const [data, setData] = useState<
  //   { draw: string; bettors: number; bets: number }[]
  // >([]);
  // const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // setLoading(true);
      try {
        const response = await fetchHistoricalSummary(); // Add query params if needed

        const today = new Date().toISOString().split("T")[0];
        console.log(today); // Output: "2025-03-25T00:00:00.000Z"

        // Filter Data for Today's Date
        let res = response.data.filter((item: { TransactionDate: string }) =>
          item.TransactionDate.startsWith(today)
        );

        if (params.gameCategoryId && params.gameCategoryId > 0) {
          res = res.filter(
            (item: { GameCategoryId: number }) =>
              item.GameCategoryId === params.gameCategoryId
          );
        }

        // console.log(
        //   "Result Data from BettorsvsBetsPlacedChart: " +
        //     JSON.stringify(res, null, 2)
        // );

        if (response.success && Array.isArray(res)) {
          // Aggregate data by GameTypeId
          const aggregatedData: Record<
            number,
            { bettors: number; bets: number }
          > = {};

          res.forEach(
            (item: {
              DrawOrder: number;
              TotalBettors: number;
              TotalBets: number;
            }) => {
              if (!aggregatedData[item.DrawOrder]) {
                aggregatedData[item.DrawOrder] = { bettors: 0, bets: 0 };
              }
              aggregatedData[item.DrawOrder].bettors += item.TotalBettors;
              aggregatedData[item.DrawOrder].bets += item.TotalBets;
            }
          );

          // Convert aggregated data into the required format
          // const formattedData = [
          //   {
          //     draw: "First Draw",
          //     bettors: aggregatedData[1]?.bettors || 0,
          //     bets: aggregatedData[1]?.bets || 0,
          //   },
          //   {
          //     draw: "Second Draw",
          //     bettors: aggregatedData[2]?.bettors || 0,
          //     bets: aggregatedData[2]?.bets || 0,
          //   },
          //   {
          //     draw: "Third Draw",
          //     bettors: aggregatedData[3]?.bettors || 0,
          //     bets: aggregatedData[3]?.bets || 0,
          //   },
          // ];

          // setData(formattedData);
          // setLoading(false);
        }
      } catch (error) {
        console.log(
          "Error loading BettorsvsBetsPlacedSummary: " +
            (error as Error).message
        );
      }
    };

    fetchData();
    //console.log(`Bettors vs Bets Placed Summary Data: ${data}`);
  }, []);

  // const maxX = Math.max(
  //   100,
  //   ...data.map((item) => item.bettors / 10000),
  //   ...data.map((item) => item.bets / 100000)
  // );
  const xAxisTicks = [
    0, 1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90,
    95, 100,
  ];

  return (
    <Box
      sx={{
        backgroundColor: "#171717",
        padding: "1rem",
        borderRadius: "8px",
        paddingBottom: "2rem",
        width: "100%",
      }}
    >
      <Typography
        color="#FFFFFF"
        sx={{
          fontSize: "16px",
        }}
      >
        Today&apos;s Bettors and Total Bets
      </Typography>
      <CustomLegend />

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
          // series={[
          //   {
          //     data: data.map((item) => item.bettors),
          //     color: "#E5C7FF",
          //   },
          //   {
          //     data: data.map((item) => item.bets),
          //     color: "#D2A7FF",
          //   },
          // ]}
          dataset={TodaysBettorsAndBetsData}
          yAxis={[
            {
              scaleType: "band",
              data: ["First Draw", "Second Draw", "Third Draw"],
              // series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }]},
            },
          ]}
          xAxis={[
            {
              label: "Amount (in 100,000 units)",
              // scaleType: "linear",
              min: 0,
              max: 100,
              tickValues: xAxisTicks,
              tickSpacing: 1,
            },
          ]}
          series={addLabels([
            { dataKey: "bettors", color: "#E5C7FF" },
            { dataKey: "bets", color: "#D2A7FF" },
          ])}
        />
      </Box>
    </Box>
  );
};

export default ChartBettorsvsBetsPlacedSummary;
