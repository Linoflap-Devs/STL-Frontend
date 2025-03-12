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
  { draw: "First\nDraw", bettors: 5, bets: 2900000 },
  { draw: "Second\nDraw", bettors: 5, bets: 2600000 },
  { draw: "Third\nDraw", bettors: 8, bets: 2700000 },
];

// Ensure maxX reaches at least 70
const maxX = Math.max(
  70, // Ensures the x-axis can display up to 70
  ...data.map((item) => item.bettors),
  ...data.map((item) => item.bets / 100000) // Scale bets down to match
);

// Explicit tick values
const xAxisTicks = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70];

const ChartBettorsvsBetsPlacedSummary = () => {
  console.log("xAxisTicks:", xAxisTicks);
  console.log("maxX:", maxX);
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography color="#FFFFFF" sx={{ fontSize: "20px" }}>
              <strong>Total Summary:</strong> Bettors vs. Bets Placed
            </Typography>
            <Typography
              color="#67ABEB"
              sx={{ fontSize: "12px", cursor: "pointer", textAlign: "right" }}
            >
              View Bet Summary
            </Typography>
          </Box>
        </Box>
        <CustomLegend />
      </Box>

      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          "& svg": {
            marginRight: 0, // Remove right margin
          },
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
            "& svg": {
              marginRight: 0, // Remove right margin
            },
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
              tickLabelProps: {
                style: {
                  fontSize: "12px",
                  whiteSpace: "pre-line",
                  paddingLeft: "2px",
                },
              },
            } as any,
          ]}
          xAxis={[
            {
              label: "Amount (in 100,000 units)",
              scaleType: "linear",
              min: 0, // Ensure it starts from zero
              max: 70, // Ensures at least 70 is covered
              tickValues: xAxisTicks, // Use tickValues instead of ticks
              valueFormatter: (value: number) => `${value}`,
              tickSize: 5,
              barCategoryGap: 0.3,
            } as any,
          ]}
        />
      </Box>
    </Box>
  );
};

export default ChartBettorsvsBetsPlacedSummary;
