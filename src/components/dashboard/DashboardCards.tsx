import { Box, Typography } from "@mui/material";
import { cardDashboardStyles } from "../../styles/theme";
import { useEffect } from "react";

import { useBettingStore } from "../../../store/useBettingStore";


const DashboardCardsPage = () => {
const { cardsAggregatedData, fetchAndAggregateData } = useBettingStore();

  useEffect(() => {
    fetchAndAggregateData();
  }, [fetchAndAggregateData]);

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
        { title: "Total Bettors", value: cardsAggregatedData.totalBettors },
        { title: "Total Winners", value: cardsAggregatedData.totalWinners },
        {
          title: "Total Bets Placed",
          value: `₱${cardsAggregatedData.totalBets.toLocaleString()}`,
        },
        {
          title: "Total Payout",
          value: `₱${cardsAggregatedData.totalPayout.toLocaleString()}`,
        },
        {
          title: "Total Revenue",
          value: `₱${cardsAggregatedData.totalRevenue.toLocaleString()}`,
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
