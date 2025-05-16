import React, { useEffect, useState } from "react";
import { Box, Typography, Stack, CircularProgress } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { fetchHistoricalSummary } from "~/utils/api/transactions";
// import fetchHistoricalSummary from "~/utils/api/transactions/getHistoricalSummary";

// Mapping GameTypeId to Draw Names
// const drawNames: Record<number, string> = {
//   1: "First Draw",
//   2: "Second Draw",
//   3: "Third Draw",
// };

// Custom Legend (Dynamically Handles Bet Types)
const CustomLegend = () => (
  <Stack
    direction="row"
    spacing={2}
    justifyContent="left"
    sx={{ mt: 0.5, mr: 4 }}
    fontSize={12}
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
      <Typography color="#212121">STL Pares</Typography>
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
      <Typography color="#212121">STL Swer2</Typography>
    </Box>
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box
        sx={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          backgroundColor: "#7266C9",
          mr: 1.5,
        }}
      />
      <Typography color="#212121">STL Swer3</Typography>
    </Box>
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box
        sx={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          backgroundColor: "#3B3B81",
          mr: 1.5,
        }}
      />
      <Typography color="#212121">STL Swer4</Typography>
    </Box>
  </Stack>
);

const ChartBettorsSummary = () => {

  const [data, setData] = useState<
      { draw: string; pares: number, swer2: number, swer3: number, swer4: number }[]
    >([]);
  const [loading, setLoading] = useState(false);

  const xAxisTicks = [
    0, 1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90,
    95, 100,
  ];

  useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await fetchHistoricalSummary(); // Add query params if needed
          
          const today = new Date().toISOString().split("T")[0];
          console.log(today); // Output: "2025-03-25T00:00:00.000Z"

          // Filter Data for Today's Date
          const res = response.data.filter((item: { TransactionDate: string }) =>
            item.TransactionDate.startsWith(today)
          );

          console.log(
            "Result Data from BettorsvsBetsPlacedChart: " +
              JSON.stringify(res.data, null, 2)
          );
  
          if (response.success && Array.isArray(res)) {
            // Aggregate data by GameTypeId
            const aggregatedData: Record<
              number,
              { pares: number; swer2: number; swer3: number; swer4: number }
            > = {};
  
            res.forEach(
              (item: {
                DrawOrder: number;
                TotalBettors: number;
                TotalBets: number;
                GameCategoryId: number;
              }) => {
                if (!aggregatedData[item.DrawOrder]) {
                  aggregatedData[item.DrawOrder] = { pares: 0, swer2: 0, swer3: 0, swer4: 0 };
                }
  
                aggregatedData[item.DrawOrder].pares += item.GameCategoryId == 1 ? item.TotalBets : 0;
                aggregatedData[item.DrawOrder].swer2 += item.GameCategoryId == 2 ? item.TotalBets : 0;
                aggregatedData[item.DrawOrder].swer3 += item.GameCategoryId == 3 ? item.TotalBets : 0;
                aggregatedData[item.DrawOrder].swer4 += item.GameCategoryId == 4 ? item.TotalBets : 0;
              }
            );
  
            // Convert aggregated data into the required format
            const formattedData = [
              {
                draw: "First Draw",
                pares: aggregatedData[1]?.pares || 0,
                swer2: aggregatedData[1]?.swer2 || 0,
                swer3: aggregatedData[1]?.swer3 || 0,
                swer4: aggregatedData[1]?.swer4 || 0,
              },
              {
                draw: "Second Draw",
                pares: aggregatedData[2]?.pares || 0,
                swer2: aggregatedData[2]?.swer2 || 0,
                swer3: aggregatedData[2]?.swer3 || 0,
                swer4: aggregatedData[2]?.swer4 || 0,
              },
              {
                draw: "Third Draw",
                pares: aggregatedData[3]?.pares || 0,
                swer2: aggregatedData[3]?.swer2 || 0,
                swer3: aggregatedData[3]?.swer3 || 0,
                swer4: aggregatedData[3]?.swer4 || 0,
              },
            ];
  
            setData(formattedData);
            console.log(formattedData)
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

  return (
    <Box
      sx={{
        backgroundColor: "#F8F0E3",
        padding: "1rem",
        borderRadius: "8px",
        paddingBottom: "2rem",
        marginRight: 0,
        border: "1px solid #0038A8"
      }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography 
            color="#FFFFFF" 
            sx={{ 
              fontSize: "16px" 
            }}>
            Today&apos;s Bettor Count by Game Type
          </Typography>
        </Box>
        <CustomLegend/>
      </Box>
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
          }}
        >
          <BarChart
            height={350}
            // width={{100%}}
            grid={{ vertical: true }}
            layout="horizontal"
            margin={{ left: 90, right: 20, top: 20, bottom: 40 }}
            series={[
              {
                data: data.map((item) => item.pares),
                color: "#E5C7FF",
              },
              {
                data: data.map((item) => item.swer2),
                color: "#5050A5",
              },
              {
                data: data.map((item) => item.swer3),  
                color: "#7266C9",
              },
              {
                data: data.map((item) => item.swer4),
                color: "#3B3B81",
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
                max: 50,
                tickValues: xAxisTicks,
                tickSpacing: 1,
              } as any,
            ]}
          />
        </Box>
    </Box>
  );
};

export default ChartBettorsSummary;
