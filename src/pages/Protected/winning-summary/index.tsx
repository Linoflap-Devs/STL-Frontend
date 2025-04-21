import React from "react";
import { Box, Typography, Grid, Button } from "@mui/material";
import { useRouter } from 'next/router';

import DashboardCardsPage from "~/components/dashboard/DashboardCards";

import WinningActivityToday from "~/components/winning-summary/WinningActivityTodayTable";
import WinnersvsWinningsSummary from "~/components/winning-summary/WinnersvsWinningsChart";
import TableWinningSummary from "~/components/winning-summary/WinningSummaryTable";
import WinnersSummary from "~/components/winning-summary/WinnersSummaryChart";

interface WinningSummaryPageProps {
  GameCategory?: string;
}

const WinningSummaryPage: React.FC<WinningSummaryPageProps> = ({GameCategory = 'dashboard'}) => {

  const router = useRouter();

  const handleViewComparisonClick = () => {
    router.push("/comparisons")
  }
  return (
    <>
      <Box>
        <Typography sx={{ fontWeight: 700 }} variant="h4">
          Small Town Lottery Winning Summary
        </Typography>

        <Box>
          <DashboardCardsPage />
        </Box>
        
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Grid container spacing={2} alignItems="stretch">
            {/* Column 1 (3 Cards) */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <WinningActivityToday />
                </Box>
              </Box>
            </Grid>

            {/* Column 2 (2 Cards) */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%" }}>
                <Box sx={{ flex: 1 }}>
                  <WinnersvsWinningsSummary />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <WinnersSummary />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
        {/* New Grid container for buttons */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Grid container spacing={2} alignItems="stretch">
            <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#67ABEB",
                  borderRadius: "20px",
                  textTransform: "none",
                }}
              >
                Show Comparison
              </Button>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#67ABEB",
                  borderRadius: "20px",
                  textTransform: "none",
                }}
              >
                Show Comparison
              </Button>
            </Grid>
          </Grid>
        </Box>
        {/* TableBettingSummary component */}
        <Box sx={{ width: '100%', mt: 2 }}>
          <TableWinningSummary/>
        </Box>
      </Box>
    </>
  )
};

export default WinningSummaryPage;