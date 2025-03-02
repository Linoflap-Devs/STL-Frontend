import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

// Custom Legend
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

// Data for Bettors and Bets
const data = [
  { draw: "First Draw", bettors: 10, bets: 1000000 },
  { draw: "Second Draw", bettors: 30, bets: 3000000 },
  { draw: "Third Draw", bettors: 70, bets: 7000000 },
];

const SummaryBettorsBetsPlacedPage = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#171717",
        padding: "1rem",
        borderRadius: "8px",
        paddingBottom: "2rem",
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
          <Typography color="#FFFFFF" sx={{ fontSize: "20px" }}>
            Summary of Bettors and Bets Placed Today
          </Typography>
        </Box>
        <CustomLegend />
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
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "stretch",
            flexGrow: 1,
            marginLeft: "1rem",
            marginTop: "-10px",
            height: "100%",
            width: "100%",
          }}
          height={270}
          grid={{ vertical: true }}
          layout="horizontal"
          series={[
            { data: data.map((item) => item.bettors), color: "#BB86FC" },
            { data: data.map((item) => item.bets / 100000), color: "#5050A5" },
          ]}
          yAxis={[
            {
              scaleType: "band",
              data: data.map((item) => item.draw),
              tickLabelProps: { style: { fontSize: "12px" } },
            } as any,
          ]}
          xAxis={[
            {
              label: "Amount (in 100,000 units)",
              scaleType: "linear",
              min: 1,
              max: 70,
              ticks: [10, 20, 30, 40, 50, 60, 70],
              valueFormatter: (value: number) => `${value}`,
              tickSize: 2,
              barCategoryGap: 0.3,
            } as any,
          ]}
        />
      </Box>
    </Box>
  );
};

export default SummaryBettorsBetsPlacedPage;
