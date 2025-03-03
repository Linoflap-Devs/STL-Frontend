import React from "react";
import { Box, Typography } from "@mui/material";
import {
  cardDashboardStyles,
} from "../../styles/theme";

const ManagerDashboardPage = () => {
  return (
    <Box
      sx={{
        mt: 2,
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {[
        { title: "Total Managers", value: "17,329" },
        { title: "Active Managers", value: "17,326" },
        { title: "Inactive Managers", value: "3" },
        { title: "Suspended Managers", value: "15" },
        { title: "New Managers", value: "0" },
      ].map((item, index) => (
        <Box 
          key={index} 
          sx={{ 
            ...cardDashboardStyles, 
            flex: "1 1 200px",
            minWidth: "200px",
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

export default ManagerDashboardPage;
