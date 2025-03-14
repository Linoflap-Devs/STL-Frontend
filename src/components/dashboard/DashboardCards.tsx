import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { cardDashboardStyles } from "../../styles/theme";
import { fetchHistoricalSummary } from "../../utils/api/transactions";

const DashboardCardsPage = () => {
  const [dashboardData, setDashboardData] = useState({
    totalBettors: 0,
    totalWinners: 0,
    totalBetsPlaced: 0,
    totalPayout: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchDataDashboard = async () => {
      try {
        const response = await fetchHistoricalSummary();

        if (response.success) {
          // Aggregate the totals by summing the respective columns
          const totals = response.data.reduce(
            (acc: { totalBettors: any; totalWinners: any; totalBetsPlaced: any; totalPayout: any; totalRevenue: any; }, 
                item: { TotalBettors: any; TotalWinners: any; TotalBetAmount: any; TotalPayout: any; TotalEarnings: any; }) => {
              acc.totalBettors += item.TotalBettors || 0;
              acc.totalWinners += item.TotalWinners || 0;
              acc.totalBetsPlaced += item.TotalBetAmount || 0;
              acc.totalPayout += item.TotalPayout || 0;
              acc.totalRevenue += item.TotalEarnings || 0;
              return acc;
            },
            { totalBettors: 0, totalWinners: 0, totalBetsPlaced: 0, totalPayout: 0, totalRevenue: 0 }
          );

          // console.log("Aggregated Totals:", totals);
          setDashboardData(totals);
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
    <Box
      sx={{
        mt: 2,
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      {[
        { title: "Total Bettors", value: dashboardData.totalBettors },
        { title: "Total Winners", value: dashboardData.totalWinners },
        { title: "Total Bets Placed", value: `${dashboardData.totalBetsPlaced.toLocaleString()}` },
        { title: "Total Payout", value: `₱ ${dashboardData.totalPayout.toLocaleString()}` },
        { title: "Total Revenue", value: `₱ ${dashboardData.totalRevenue.toLocaleString()}` },
      ].map((item, index) => (
        <Box
          key={index}
          sx={{
            ...cardDashboardStyles,
            flex: "1 1 200px",
            minWidth: "200px",
          }}
        >
          <Typography sx={{ fontSize: "12px", lineHeight: 1.5, color: "#D5D5D5" }}>
            {item.title}
          </Typography>
          <Typography sx={{ fontSize: "30px", fontWeight: 700, lineHeight: 1.1 }}>
            {item.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default DashboardCardsPage;
