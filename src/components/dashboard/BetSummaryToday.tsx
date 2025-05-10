import React from "react";
import { Box, Typography, Divider, Button } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

const data = [
  { time: "10:30 AM", amount: 1000000 },
  { time: "3:00 PM", amount: 3000000 },
  { time: "7:00 PM", amount: 10000000 },
];

const BetSummaryTodayPage = () => {
  return (
    <Box sx={{ marginTop: "2rem" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          sx={{ color: "#E3C9FF", fontWeight: 700, marginBottom: "1rem" }}
          variant="h6"
        >
          Bet Summary Today
        </Typography>
        <Box>
          <Button
            sx={{
              fontSize: "12px",
              textAlign: "left",
              color: "#3F3F3F",
              textTransform: "none",
              backgroundColor: "#CCA1FD",
              mb: 0.7,
              paddingX: 3,
              paddingY: 0.9,
              width: "auto",
              "&:hover": {
                backgroundColor: "#B389E0",
              },
            }}
            variant="contained"
          >
            View Bet Summary
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: "flex" }}>
        <Box
          sx={{
            backgroundColor: "#F8F0E3",
            padding: "1rem",
            paddingBottom: "0px",
            borderRadius: "8px",
            maxWidth: "50%",
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
                <Typography
                  color="#B3B3B3"
                  sx={{ fontSize: "14px", lineHeight: 1 }}
                >
                  Daily Summary of
                </Typography>
                <Typography
                  color="#FFFFFF"
                  sx={{
                    fontSize: "24px",
                    lineHeight: 1.2,
                    fontWeight: "700",
                    color: "#D4AEFE",
                  }}
                >
                  Bets Placed by Draw Time
                </Typography>
              </Box>
            </Box>
            <Divider
              sx={{ backgroundColor: "#B3B3B3", opacity: 1, height: "2px" }}
            />
          </Box>
          <BarChart
            sx={{
              display: "flex",
              justifyContent: "center",
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
            slotProps={{
              bar: {
                style: {
                  borderTopLeftRadius: 5,
                  borderBottomLeftRadius: 5,
                  borderBottomRightRadius: 5,
                  borderTopRightRadius: 5,
                },
              },
            }}
            grid={{ vertical: true }}
            layout="horizontal"
            width={600}
            height={260}
            series={[
              { data: data.map((item) => item.amount), color: "#D4AEFE" },
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
                tickMinStep: 1000000,
                tickSize: 8,
              } as any,
            ]}
            yAxis={[
              {
                scaleType: "band",
                data: data.map((item) => item.time),
                categoryGapRatio: 0.7,
              } as any,
            ]}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default BetSummaryTodayPage;
