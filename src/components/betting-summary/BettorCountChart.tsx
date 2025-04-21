import React, { useEffect, useState } from "react";
import { Box, Typography, Stack, CircularProgress } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
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
      <Typography color="white">STL Pares</Typography>
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
      <Typography color="white">STL Swer2</Typography>
    </Box>
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
      <Typography color="white">STL Swer3</Typography>
    </Box>
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box
        sx={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          backgroundColor: "#A06FE6",
          mr: 1.5,
        }}
      />
      <Typography color="white">STL Swer4</Typography>
    </Box>
  </Stack>
);

const ChartBettorsSummary = () => {

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
        marginRight: 0,
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
                data: [2, 4, 6],
                color: "#E5C7FF",
              },
              {
                data: [8, 10, 12],
                color: "#D2A7FF",
              },
              {
                data: [14, 16,18],  
                color: "#BB86FC",
              },
              {
                data: [20, 22, 24],
                color: "#A06FE6",
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
                tickSpacing: 1,
              } as any,
            ]}
          />
        </Box>
    </Box>
  );
};

export default ChartBettorsSummary;
