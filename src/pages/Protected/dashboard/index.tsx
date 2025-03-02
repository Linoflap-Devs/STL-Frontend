import React from "react";
import { Box, Button, Typography, Grid,  } from "@mui/material";

import DashboardCardsPage from "~/components/dashboard/DashboardCards";
import DrawResultsPage from "~/components/dashboard/DrawResults";
import TopBettingRegionPage from "~/components/dashboard/TopBettingRegion";
import TopWinningRegionPage from "~/components/dashboard/TopWinningRegion";

import SummaryBettorsBetsPlacedPage from "~/components/dashboard/SummaryBettorsBetsPlaced";
import SummaryWinnersDrawTimePage from "~/components/dashboard/SummaryWinnersDrawTime";

const DashboardPage = () => {
  return (
<Box>
  <Typography sx={{ fontWeight: 700 }} variant="h4">
    Dashboard
  </Typography>
  <Box><DashboardCardsPage/></Box>

  <Box sx={{ display: "flex", justifyContent: "center", mt: 2, }}>
    <Grid container spacing={2}>
      {/* Column 1 (3 Cards) */}
      <Grid item xs={12} md={6}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{mt: 1, }} ><DrawResultsPage /></Box>
          <Box><TopBettingRegionPage/></Box>
          <Box><TopWinningRegionPage /></Box>
        </Box>
      </Grid>

      {/* Column 2 (2 Cards) */}
      <Grid item xs={12} md={6}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{mt: 1, }}><SummaryBettorsBetsPlacedPage /></Box>
          <Box sx={{mt: 2, }}><SummaryWinnersDrawTimePage /></Box>
        </Box>
      </Grid>
    </Grid>
  </Box>
</Box>

  );
};

export default DashboardPage;
