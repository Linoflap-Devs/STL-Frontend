import React from "react";
import { Box, Typography, Select, MenuItem } from "@mui/material";
import {
  cardDashboardStyles,
  buttonDrawStyles,
  buttonNumberStyles,
} from "../../styles/theme";

const DashboardCardsPage = () => {
  return (
    <Box
      sx={{
        mt: 2,
        display: "flex",
        gap: 2,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Box sx={{ ...cardDashboardStyles, flex: 1 }}>
        <Typography sx={{ fontSize: "12px", lineHeight: 1.5, color: '#D5D5D5', }}>
          Total Bettors
        </Typography>
        <Typography sx={{ fontSize: "30px", fontWeight: 600, lineHeight: 1.1 }}>
          302,329
        </Typography>
      </Box>

      <Box sx={{ ...cardDashboardStyles, flex: 1 }}>
        <Typography sx={{ fontSize: "12px", lineHeight: 1.5, color: '#D5D5D5', }}>
          Total Winners
        </Typography>
        <Typography sx={{ fontSize: "30px", fontWeight: 700, lineHeight: 1.1 }}>
          21
        </Typography>
      </Box>

      <Box sx={{ ...cardDashboardStyles, flex: 1 }}>
        <Typography sx={{ fontSize: "12px", lineHeight: 1.5, color: '#D5D5D5', }}>
          Total Bets Placed
        </Typography>
        <Typography sx={{ fontSize: "30px", fontWeight: 700, lineHeight: 1.1 }}>
          ₱ 1,221,432
        </Typography>
      </Box>

      <Box sx={{ ...cardDashboardStyles, flex: 1 }}>
        <Typography sx={{ fontSize: "12px", lineHeight: 1.5, color: '#D5D5D5', }}>
          Total Payout
        </Typography>
        <Typography sx={{ fontSize: "30px", fontWeight: 700, lineHeight: 1.1 }}>
          ₱ 294,000
        </Typography>
      </Box>
      <Box sx={{ ...cardDashboardStyles, flex: 1 }}>
        <Typography sx={{ fontSize: "12px", lineHeight: 1.5 }}>
          Total Revenue
        </Typography>
        <Typography sx={{ fontSize: "30px", fontWeight: 700, lineHeight: 1.1 }}>
          ₱ 927,432
        </Typography>
      </Box>
    </Box>
  );
};

export default DashboardCardsPage;
