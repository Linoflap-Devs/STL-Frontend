import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

// Custom Legend
const CustomLegend = () => (
  <Stack direction="row" spacing={2} justifyContent="left" sx={{ mt: 0.5, mr: 4 }}>
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#BB86FC", mr: 1.5 }} />
      <Typography color="white">Winners</Typography>
    </Box>
  </Stack>
);

// Data for Winners
const data = [
  { draw: "First Draw", winners: 100 },
  { draw: "Second Draw", winners: 2500 },
  { draw: "Third Draw", winners: 50 },
];

const SummaryWinnersDrawTimePage = () => {
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
            Summary of Winners
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
            { data: data.map((item) => item.winners), color: "#BB86FC" },
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
              label: "Total",
              scaleType: "linear",
              min: 1,
              max: 10000,
              ticks: [1, 10, 25, 50, 100, 250, 500, 1000, 1500, 2000, 2500, 5000, 7500, 9000, 10000],
              valueFormatter: (value: number) => `${value}`,
              tickSize: 8,
              barCategoryGap: 0.70,
            } as any,
          ]}
        />
      </Box>
    </Box>
  );
};

export default SummaryWinnersDrawTimePage;
