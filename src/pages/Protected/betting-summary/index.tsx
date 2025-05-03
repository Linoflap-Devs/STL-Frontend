import React from "react";
import { Box, Typography, Grid, Button } from "@mui/material";
import { useRouter } from 'next/router';

// Components
import DashboardCardsPage from "~/components/dashboard/DashboardCards";
import TableBettingActivityToday from '~/components/betting-summary/BettingActivityTodayTable'
import ChartBettorsvsBetsPlacedSummary from "~/components/betting-summary/BettorsvsBetsPlacedChart";
import ChartBettorsSummary from "~/components/betting-summary/BettorCountChart";
import TableBettingSummary from "~/components/betting-summary/BettingSummaryTable";
import ChartBettorsBetTypeSummary from "~/components/betting-summary/BettorCountByBetType";


const BettingSummaryPage = (params: {gameCategoryId?: number}) => {

  const router = useRouter();

  console.log('Game Category: ',params.gameCategoryId)

  const handleViewComparisonClick = ()=> {
    router.push("/bets-comparisons"); 
  };

  return (
    <Box>
      <Typography sx={{ fontWeight: 700 }} variant="h4">
        Small Town Lottery Betting Summary
      </Typography>
      
      <Box>
        <DashboardCardsPage gameCategoryId={params.gameCategoryId} />
      </Box>
      
      <Box 
        sx={{
          mt: 2 
        }}>
        <Grid container spacing={0.5} alignItems="stretch">
          <Grid item xs={12} md={5}>
            <TableBettingActivityToday gameCategoryId={params.gameCategoryId}/>
          </Grid>
          
          <Grid item xs={12} md={7}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%", width: "100%" }}>
              <ChartBettorsvsBetsPlacedSummary gameCategoryId={params.gameCategoryId}/>
              {
                params.gameCategoryId && params.gameCategoryId > 0 ? <ChartBettorsBetTypeSummary gameCategoryId={params.gameCategoryId}/> : <ChartBettorsSummary />
              }
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
          gameCategoryId={params.gameCategoryId}
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