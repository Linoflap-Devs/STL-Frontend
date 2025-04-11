import React, { useEffect, useState } from "react";
import { Box, Typography, Stack } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

import fetchHistoricalSummary from "~/utils/api/transactions/getHistoricalSummary";

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

const ChartBettorsvsBetsPlacedSummary = () => {
  const [data, setData] = useState<
    { draw: string; bettors: number; bets: number }[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetchHistoricalSummary({}); // Add query params if needed

        console.log(
          "Result Data from BettorsvsBetsPlacedChart: " +
            JSON.stringify(res.data, null, 2)
        );

        if (res.success && Array.isArray(res.data)) {
          // Aggregate data by GameTypeId
          const aggregatedData: Record<
            number,
            { bettors: number; bets: number }
          > = {};

          res.data.forEach(
            (item: {
              GameTypeId: number;
              TotalBettors: number;
              TotalBetsPlaced: number;
            }) => {
              if (!aggregatedData[item.GameTypeId]) {
                aggregatedData[item.GameTypeId] = { bettors: 0, bets: 0 };
              }

              aggregatedData[item.GameTypeId].bettors += item.TotalBettors;
              aggregatedData[item.GameTypeId].bets += item.TotalBetsPlaced;
            }
          );

          // Convert aggregated data into the required format
          const formattedData = [
            {
              draw: "First Draw",
              bettors: aggregatedData[1]?.bettors || 0,
              bets: aggregatedData[1]?.bets || 0,
            },
            {
              draw: "Second Draw",
              bettors: aggregatedData[2]?.bettors || 0,
              bets: aggregatedData[2]?.bets || 0,
            },
            {
              draw: "Third Draw",
              bettors: aggregatedData[3]?.bettors || 0,
              bets: aggregatedData[3]?.bets || 0,
            },
          ];

          setData(formattedData);
          setLoading(false);
        }
      } catch (error) {
        console.log(
          "Error loading BettorsvsBetsPlacedSummary: " +
            (error as Error).message
        );
      }
    };

    fetchData();
    console.log(`Bettors vs Bets Placed Summary Data: ${data}`);
  }, []);

  // const maxX = Math.max(
  //   100,
  //   ...data.map((item) => item.bettors / 10000),
  //   ...data.map((item) => item.bets / 100000)
  // );
  const xAxisTicks = [0, 1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100]

  return (
    <Box
      sx={{
        backgroundColor: "#171717",
        padding: "1rem",
        borderRadius: "8px",
        paddingBottom: "2rem",
        width: "100%",
        // display: "flex",
        // justifyContent: "center",
        // alignItems: "center"
      }}
    >
      <Typography color="#FFFFFF" sx={{ fontSize: "16px" }}>
        Today&apos;s Bettors and Total Bets
      </Typography>
      <CustomLegend />
      <Box sx={{ height: 270, width: 690 }}>
        <BarChart
          height={270}
          // width={{100%}}
          grid={{ vertical: true }}
          layout="horizontal"
          margin={{ left: 90, right: 20, top: 20, bottom: 40 }}
          series={[
            {
              data: [10, 20,30],
              color: "#E5C7FF",
            },
            {
              data: [40, 50, 60],
              color: "#D2A7FF",
            },
          ]}
          yAxis={[
            {
              scaleType: "band",
              data: ["First Draw", "Second Draw", "Third Draw"], 
              // series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }]},
            } as any,
          ]}
          xAxis={[
            {
              label: "Amount (in 100,000 units)",
              // scaleType: "linear",
              min: 0,
              max: 100,
              tickValues: xAxisTicks,
              tickSpacing:1 ,
            } as any,
          ]}
        />
      </Box>
    </Box>
  );
};

export default ChartBettorsvsBetsPlacedSummary;
