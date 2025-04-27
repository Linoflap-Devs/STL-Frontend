import React, { useEffect, useState } from "react";
import { Box, Typography, Stack } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { fetchHistoricalSummary } from "../../utils/api/transactions";

// Custom Legend
const CustomLegend = () => (
  <Stack direction="row" spacing={2} justifyContent="left" sx={{ mt: 0.5, mr: 4 }}>
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#BB86FC", mr: 1.5 }} />
      <Typography color="white">Bettors</Typography>
    </Box>
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#5050A5", mr: 1.5 }} />
      <Typography color="white">Bets</Typography>
    </Box>
  </Stack>
);

const summary: Record<number, { gameName: string; bettors: number; bets: number; winners: number }> = {
  1: { gameName: "First Draw", bettors: 0, bets: 0, winners: 0 },
  2: { gameName: "Second Draw", bettors: 0, bets: 0, winners: 0 },
  3: { gameName: "Third Draw", bettors: 0, bets: 0, winners: 0 },
};

const SummaryBettorsBetsPlacedPage = () => {
  const [data, setData] = useState<{ gameName: string; bettors: number; bets: number; winners: number }[]>([]);
  const summaryRecord = summary as Record<number, { gameName: string; bettors: number; bets: number; winners: number }>;

  useEffect(() => {
    const fetchDataDashboard = async () => {
      try {
        const response = await fetchHistoricalSummary();
        //console.log("API Response of Bettors charts:", response);

        if (response.success) {
          //console.log("Processing data...");

          const today = new Date().toISOString().split("T")[0];
          console.log(today); // Output: "2025-03-25T00:00:00.000Z"

          // Filter Data for Today's Date
          const filteredData = response.data.filter((item: { TransactionDate: string }) =>
            item.TransactionDate.startsWith(today)
          );

          // Initialize Data Aggregation
          const summary = {
            1: { gameName: "First Draw", bettors: 0, bets: 0, winners: 0 },
            2: { gameName: "Second Draw", bettors: 0, bets: 0, winners: 0 },
            3: { gameName: "Third Draw", bettors: 0, bets: 0, winners: 0 },
          };

          // Loop through filtered data and update summary
          filteredData.forEach((item: { DrawOrder: number; TotalBettors: number; TotalBets: number; TotalWinners: number }) => {
            if (summaryRecord[item.DrawOrder]) {
              summaryRecord[item.DrawOrder].bettors += item.TotalBettors || 0;
              summaryRecord[item.DrawOrder].bets += item.TotalBets || 0;
              summaryRecord[item.DrawOrder].winners += item.TotalWinners || 0;
            }
          });

          // Convert summary object to an array
          const formattedData = Object.values(summaryRecord);

          console.log(formattedData)

          //console.log("Aggregated Data:", formattedData);
          setData(formattedData);
        } else {
          console.error("API Request Failed:", response.message);
        }
      } catch (error) {
        console.error("Error Fetching Data:", error);
      }
    };

    fetchDataDashboard();
  }, []);

  return (
    <Box sx={{ backgroundColor: "#171717", padding: "1rem", borderRadius: "8px", paddingBottom: "2rem" }}>
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <Typography color="#FFFFFF" sx={{ fontSize: "20px" }}>
            Summary of Bettors and Bets Placed Today
          </Typography>
          <Typography color="#67ABEB" sx={{ fontSize: "12px", cursor: "pointer", textAlign: "right" }}>
            View Bet Summary
          </Typography>
        </Box>
        <CustomLegend />
      </Box>

      <Box sx={{ height: "100%", display: "flex", flexGrow: 1, flexDirection: "row" }}>
        <BarChart
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "stretch",
            flexGrow: 1,
            marginLeft: "1rem",
            marginTop: "0px",
            height: "100%",
            width: "100%",
          }}
          height={270}
          width={790} 
          grid={{ vertical: true }}
          margin={{left: 90}}
          layout="horizontal"
          series={[
            { data: data.map((item) => item.bettors), color: "#BB86FC" },
            { data: data.map((item) => item.bets), color: "#5050A5" },
          ]}
          yAxis={[
            {
              scaleType: "band",
              data: data.map((item) => item.gameName),
              tickLabelProps: { style: { fontSize: "12px" } },
            } as any,
          ]}
          xAxis={[
            {
              label: "Amount (in 100,000 units)",
              scaleType: "linear",
              min: 0,
              max: Math.max(...data.map((item) => item.bets / 100000), 70),
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
