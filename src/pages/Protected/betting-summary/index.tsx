import React from "react";
import { Box, Typography, Grid, Button } from "@mui/material";
import { useRouter } from 'next/router';

// Components
import DashboardCardsPage from "~/components/dashboard/DashboardCards";
import TableBettingActivityToday from '~/components/betting-summary/BettingActivityTodayTable'
import ChartBettorsvsBetsPlacedSummary from "~/components/betting-summary/BettorsvsBetsPlacedChart";
import ChartBetTypeSummary from "~/components/betting-summary/BetTypeChart";
import TableBettingSummary from "~/components/betting-summary/BettingSummaryTable";


interface BettingSummaryPageProps {
  GameCategory?: string;
}

const BettingSummaryPage: React.FC<BettingSummaryPageProps> = ({ GameCategory = 'dashboard' }) => {

  const router = useRouter();

  const handleViewComparisonClick = ()=> {
    router.push("/comparisons"); 
  };

  return (
    <Box>
      <Typography sx={{ fontWeight: 700 }} variant="h4">
        Small Town Lottery Betting Summary
      </Typography>
      
      <Box>
        <DashboardCardsPage />
      </Box>
      
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={0.5} alignItems="stretch">
          <Grid item xs={12} md={5}>
            <TableBettingActivityToday/>
          </Grid>
          
          <Grid item xs={12} md={7}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%", width: "100%" }}>
              <ChartBettorsvsBetsPlacedSummary/>
              <ChartBetTypeSummary/>
            </Box>
          </Grid>
        </Grid>
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

      <Box sx={{ width: '100%', mt: 2 }}>
        <TableBettingSummary 
          // GameCategory={GameCategory as string } 
        />
      </Box>
    </Box>
  );
};

export default BettingSummaryPage;


// Update Child Components:
// Example for TableBettingActivityToday
// interface TableBettingActivityTodayProps {
//   gameCategory?: string;
// }

// const TableBettingActivityToday: React.FC<TableBettingActivityTodayProps> = ({ gameCategory }) => {