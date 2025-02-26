import React from "react";
import { Box, Typography, Divider, Button } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

const data = [
  { time: "10:30 AM", amount: 1000000 },
  { time: "3:00 PM", amount: 3000000 },
  { time: "7:00 PM", amount: 10000000 },
];

const SummaryBetsPlacedTimePage = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#383838",
        padding: "1rem",
        borderRadius: "8px",
        paddingBottom: "0rem",
      }}
    >
      <Box sx={{ marginBottom: "-30px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
            mt: 1,
          }}
        >
          <Box>
            <Typography color="#B3B3B3" sx={{ fontSize: "14px", lineHeight: 1 }}>
              Daily Summary of
            </Typography>
            <Typography
              color="#D4AEFE"
              sx={{ fontSize: "24px", lineHeight: 1.2, fontWeight: "700" }}
            >
              Bets Placed by Draw Time
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ backgroundColor: "#B3B3B3", opacity: 1, height: "2px" }} />
      </Box>

      <BarChart
        sx={{
          display: "flex",
          justifyContent: "center",
          marginLeft: "2rem",
          "& .MuiChartsGrid-root line": {
            stroke: "white",
            strokeDasharray: "4 4",
          },
          "& .MuiChartsAxis-line": {
            stroke: "none !important",
          },
          "& .MuiChartsAxis-tick text": {
            "&:empty": { display: "none !important" },
          },
        }}
        grid={{ vertical: true }}
        layout="horizontal"
        height={300}
        series={[
          {
            data: data.map((item) => item.amount), // Actual values
            color: "#D4AEFE",
            stack: "total",
          },
          {
            data: data.map((item) => 10000000 - item.amount), // Remaining part
            color: "white",
            stack: "total",
          },
        ]}
        xAxis={[
          {
            scaleType: "linear",
            min: 0,
            max: 10000000,
            ticks: [0, 1000000, 3000000, 5000000, 10000000],
            valueFormatter: (value: number) => {
              const labels: Record<number, string> = {
                0: "0",
                1000000: "1m",
                3000000: "3m",
                5000000: "5m",
                10000000: "10m",
              };
              return labels[value] || "";
            },
            tickInterval: [0, 1000000, 3000000, 5000000, 10000000],
            tickSize: 8,
            nice: false,
          } as any,
        ]}
        yAxis={[
          {
            scaleType: "band",
            data: data.map((item) => item.time),
            categoryGapRatio: 0.80,
            tickLabelProps: {
              style: { fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
            },
          } as any,
        ]}
      />
    </Box>
  );
};

export default SummaryBetsPlacedTimePage;
