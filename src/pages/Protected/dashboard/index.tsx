import React, { Suspense } from "react";
import { Box, Typography, Grid } from "@mui/material";
import DashboardSkeleton from "~/components/dashboard/DashboardSkeleton"; // Skeleton Loader

const DashboardCardsPage = React.lazy(() => import("~/components/dashboard/DashboardCards"));
const DrawResultsPage = React.lazy(() => import("~/components/dashboard/DrawResults"));
const TopBettingRegionPage = React.lazy(() => import("~/components/dashboard/TopBettingRegion"));
const TopWinningRegionPage = React.lazy(() => import("~/components/dashboard/TopWinningRegion"));
const SummaryBettorsBetsPlacedPage = React.lazy(() => import("~/components/dashboard/SummaryBettorsBetsPlaced"));
const SummaryWinnersDrawTimePage = React.lazy(() => import("~/components/dashboard/SummaryWinnersDrawTime"));

const DashboardPage = () => {
  return (
    <Box>
      <Suspense fallback={<DashboardSkeleton />}>
      <Typography sx={{ fontWeight: 700 }} variant="h4">
        Dashboard
      </Typography>
        <DashboardCardsPage />
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Grid container spacing={2} alignItems="stretch">
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <DrawResultsPage />
                <TopBettingRegionPage />
                <TopWinningRegionPage />
              </Box>
            </Grid>
            <Grid item xs={12} md={8} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <SummaryBettorsBetsPlacedPage />
              <SummaryWinnersDrawTimePage />
            </Grid>
          </Grid>
        </Box>
      </Suspense>
    </Box>
  );  
};

export default DashboardPage;
