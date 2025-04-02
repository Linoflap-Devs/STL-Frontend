import React, { Suspense } from "react";
import { Typography, Stack } from "@mui/material";
import DashboardSkeleton from "~/components/dashboard/DashboardSkeleton";

const DashboardCardsPage = React.lazy(() => import("~/components/dashboard/DashboardCards"));
const DrawResultsPage = React.lazy(() => import("~/components/dashboard/DrawResults"));
const TopBettingRegionPage = React.lazy(() => import("~/components/dashboard/TopBettingRegion"));
const TopWinningRegionPage = React.lazy(() => import("~/components/dashboard/TopWinningRegion"));
const SummaryBettorsBetsPlacedPage = React.lazy(() => import("~/components/dashboard/SummaryBettorsBetsPlaced"));
const SummaryWinnersDrawTimePage = React.lazy(() => import("~/components/dashboard/SummaryWinnersDrawTime"));

const DashboardPage = () => {
  return (
    <Stack spacing={2}>
      <Suspense fallback={<DashboardSkeleton />}>
        <Typography sx={{ fontWeight: 700 }} variant="h4">
          Dashboard
        </Typography>
        <DashboardCardsPage />
        <Stack spacing={2} alignItems="center">
          <Stack spacing={2} width="100%">
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} width="100%">
              {/* Left Column */}
              <Stack spacing={2} flex={1}>
                <DrawResultsPage />
                <TopBettingRegionPage />
                <TopWinningRegionPage />
              </Stack>
              {/* Right Column */}
              <Stack spacing={2} flex={2}>
                <SummaryBettorsBetsPlacedPage />
                <SummaryWinnersDrawTimePage />
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Suspense>
    </Stack>
  );
};

export default DashboardPage;
