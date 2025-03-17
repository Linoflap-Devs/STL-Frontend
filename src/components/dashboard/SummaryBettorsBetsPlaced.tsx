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

const SummaryBettorsBetsPlacedPage = () => {
  const [data, setData] = useState<{ gameName: string; bettors: number; bets: number }[]>([]);

  useEffect(() => {
    const fetchDataDashboard = async () => {
      try {
        console.log("Fetching historical summary data...");
        const response = await fetchHistoricalSummary();
        console.log("API Response:", response);

        if (response.success) {
          console.log("Processing data...");

          // Aggregate TotalBets and TotalBettors per GameTypeId
          const aggregatedData = response.data.reduce(
            (acc: { gameTypeId: number; gameName: string; bettors: number; bets: number }[],
              item: { GameTypeId: number; TotalBettors: any; TotalBets: any; GameName: any; }) => {
              const existing = acc.find((g) => g.gameTypeId === item.GameTypeId);

              // Map GameTypeId to Custom Labels
              const gameNameMapping: Record<number, string> = {
                1: "First Draw",
                2: "Second Draw",
                3: "Third Draw",
              };

              if (existing) {
                existing.bettors += item.TotalBettors || 0;
                existing.bets += item.TotalBets || 0;
              } else {
                acc.push({
                  gameTypeId: item.GameTypeId,
                  gameName: gameNameMapping[item.GameTypeId] || item.GameName,
                  bettors: item.TotalBettors || 0,
                  bets: item.TotalBets || 0,
                });
              }

              return acc;
            },
            []
          );

          console.log("Aggregated Data:", aggregatedData);
          setData(aggregatedData);
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
            marginLeft: "3rem",
            marginTop: "0px",
            height: "100%",
            width: "100%",
          }}
          height={270}
          width={790} 
          grid={{ vertical: true }}
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
