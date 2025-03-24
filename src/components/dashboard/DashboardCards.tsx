import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { cardDashboardStyles } from "../../styles/theme";
import { useEffect } from "react";

import fetchHistoricalSummary from "~/utils/api/getHistoricalSummary";

const DashboardCardsPage = () => {
  const [summary, setSummary] = useState({
    totalBettors: 0,
    totalWinners: 0,
    totalBets: 0,
    totalPayout: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const getData = async () => {
      const response = await fetchHistoricalSummary({}); // Pass necessary query params
      if (response.success) {
        const data = response.data;

        // Aggregate data
        const totalBettors = data.reduce(
          (acc: any, item: any) => acc + item.TotalBettors,
          0
        );
        const totalWinners = data.reduce(
          (acc: any, item: any) => acc + item.TotalWinners,
          0
        );
        const totalBets = data.reduce(
          (acc: any, item: any) => acc + item.TotalBetAmount,
          0
        );
        const totalPayout = data.reduce(
          (acc: any, item: any) => acc + item.TotalPayout,
          0
        );
        const totalRevenue = data.reduce(
          (acc: any, item: any) => acc + item.TotalEarnings,
          0
        );

        setSummary({
          totalBettors,
          totalWinners,
          totalBets,
          totalPayout,
          totalRevenue,
        });
      }
    };

    getData();
  }, []);
  return (
    <Box
      sx={{
        mt: 2,
        display: "flex",
        flexWrap: "wrap", // Wrap items on smaller screens
        gap: 2,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      {[
        { title: "Total Bettors", value: summary.totalBettors },
        { title: "Total Winners", value: summary.totalWinners },
        {
          title: "Total Bets Placed",
          value: `₱${summary.totalBets.toLocaleString()}`,
        },
        {
          title: "Total Payout",
          value: `₱${summary.totalPayout.toLocaleString()}`,
        },
        {
          title: "Total Revenue",
          value: `₱${summary.totalRevenue.toLocaleString()}`,
        },
      ].map((item, index) => (
        <Box
          key={index}
          sx={{
            ...cardDashboardStyles,
            flex: "1 1 200px", // Ensures responsiveness
            minWidth: "200px", // Prevents shrinking too much
          }}
        >
          <Typography
            sx={{ fontSize: "12px", lineHeight: 1.5, color: "#D5D5D5" }}
          >
            {item.title}
          </Typography>
          <Typography
            sx={{ fontSize: "30px", fontWeight: 700, lineHeight: 1.1 }}
          >
            {item.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default DashboardCardsPage;
