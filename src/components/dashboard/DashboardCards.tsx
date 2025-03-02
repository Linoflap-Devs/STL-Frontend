import React from "react";
import { Box, Typography } from "@mui/material";
import {
  cardDashboardStyles,
} from "../../styles/theme";

const DashboardCardsPage = () => {
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
        { title: "Total Bettors", value: "302,329" },
        { title: "Total Winners", value: "21" },
        { title: "Total Bets Placed", value: "₱ 1,221,432" },
        { title: "Total Payout", value: "₱ 294,000" },
        { title: "Total Revenue", value: "₱ 927,432" },
      ].map((item, index) => (
        <Box 
          key={index} 
          sx={{ 
            ...cardDashboardStyles, 
            flex: "1 1 200px", // Ensures responsiveness
            minWidth: "200px", // Prevents shrinking too much
          }}
        >
          <Typography sx={{ fontSize: "12px", lineHeight: 1.5, color: '#D5D5D5' }}>
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
