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
          backgroundColor: "#BB86FC",
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
          backgroundColor: "#5050A5",
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

  const maxX = Math.max(
    70,
    ...data.map((item) => item.bettors / 10000),
    ...data.map((item) => item.bets / 100000)
  );
  const xAxisTicks = [0, 10, 20, 30, 40, 50, 60, 70];

  return (
    <Box
      sx={{
        backgroundColor: "#171717",
        padding: "1rem",
        borderRadius: "8px",
        paddingBottom: "2rem",
      }}
    >
      <Typography color="#FFFFFF" sx={{ fontSize: "20px" }}>
        <strong>Total Summary:</strong> Bettors vs. Bets Placed
      </Typography>
      <CustomLegend />
      <Box sx={{ height: 270 }}>
        <BarChart
          height={270}
          grid={{ vertical: true }}
          layout="horizontal"
          series={[
            {
              data: data.map((item) => item.bettors),
              color: "#BB86FC",
              label: "Bettors",
            },
            {
              data: data.map((item) => item.bets),
              color: "#5050A5",
              label: "Bets",
            },
          ]}
          yAxis={[
            {
              scaleType: "band",
              data: data.map((item) => item.draw),
            } as any,
          ]}
          xAxis={[
            {
              label: "Amount (in 100,000 units)",
              scaleType: "linear",
              min: 0,
              max: maxX,
              tickValues: xAxisTicks,
            } as any,
          ]}
        />
      </Box>
    </Box>
  );
};

export default ChartBettorsvsBetsPlacedSummary;
