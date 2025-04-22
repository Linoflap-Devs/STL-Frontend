import React from "react";
import { Box, Typography, Grid, Button } from "@mui/material";
import { useRouter } from 'next/router';

import DashboardCardsPage from "~/components/dashboard/DashboardCards";

import TableWinningActivityToday from "~/components/winning-summary/WinningActivityTodayTable";
import ChartWinnersvsWinningsSummary from "~/components/winning-summary/WinnersvsWinningsChart";
import TableWinningSummary from "~/components/winning-summary/WinningSummaryTable";
import ChartWinnersSummary from "~/components/winning-summary/WinnerCountChart";

interface WinningSummaryPageProps {
  GameCategory?: string;
}

const WinningSummaryPage: React.FC<WinningSummaryPageProps> = ({GameCategory = 'dashboard'}) => {

  const router = useRouter();

  const handleViewComparisonClick = () => {
    router.push("/wins-comparisons")
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
        
        <Box 
        sx={{
          mt: 2 
        }}>
          <Grid container spacing={0.5} alignItems="stretch">
            <Grid item xs={12} md={5}>
              <TableWinningActivityToday/>
            </Grid>
            
            <Grid item xs={12} md={7}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%", width: "100%" }}>
                <ChartWinnersvsWinningsSummary/>
                <ChartWinnersSummary/>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={5} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#67ABEB",
                borderRadius: "10px",
                textTransform: "none",
                paddingX: 4,
              }}
              onClick={handleViewComparisonClick}
            >
              View Comparison
            </Button>
          </Grid>
          <Grid item xs={12} md={7} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#67ABEB",
                borderRadius: "10px",
                textTransform: "none",
                paddingX: 4,
              }}
              onClick={handleViewComparisonClick}
            >
              View Comparison
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box>
        {/* TableBettingSummary component */}
        <Box sx={{ width: '100%', mt: 2 }}>
          <TableWinningSummary/>
        </Box>
      </Box>
    </>
  );
};

export default WinningSummaryPage;