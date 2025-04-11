import React, { useState, useEffect } from "react";
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

  // Map game categories to display names
  // const getPageTitle = () => {
  //   const categoryNames: Record<string, string> = {
  //     'dashboard': 'Small Town Lottery Betting Summary',
  //     'stl-pares': 'STL Pares Betting Summary',
  //     'stl-swer2': 'STL Swer2 Betting Summary',
  //     'stl-swer3': 'STL Swer3 Betting Summary',
  //     'stl-swer4': 'STL Swer4 Betting Summary',
  //   };
  //   return categoryNames[gameCategory] || categoryNames.dashboard;
  // };

  // Redirect to dashboard if no category specified
  // useEffect(() => {
  //   if (router.pathname.startsWith("/betting-summary")) {
  //     router.replace('/betting-summary/dashboard');
  //   }
  // }, [router.pathname]);

  return (
    <Box>
      <Typography sx={{ fontWeight: 700 }} variant="h4">
        {/* {getPageTitle()} */}
      </Typography>
      
      <Box>
        <DashboardCardsPage />
        {/* <DashboardCardsPage gameCategory={gameCategory === 'dashboard' ? undefined : gameCategory} /> */}
      </Box>
      
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={0.5} alignItems="stretch">
          <Grid item xs={12} md={5}>
            <TableBettingActivityToday 
              // gameCategory={gameCategory === 'dashboard' ? undefined : gameCategory} 
            />
            {/* <TableBettingActivityToday 
              gameCategory={gameCategory === 'dashboard' ? undefined : gameCategory} 
            /> */}
          </Grid>
          
          <Grid item xs={12} md={7}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%", width: "100%" }}>
              <ChartBettorsvsBetsPlacedSummary/>
              {/* <ChartBettorsvsBetsPlacedSummary 
                gameCategory={gameCategory === 'dashboard' ? undefined : gameCategory} 
              /> */}
              <ChartBetTypeSummary/>
              {/* <ChartBetTypeSummary 
                gameCategory={gameCategory === 'dashboard' ? undefined : gameCategory} 
              /> */}
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
            >
              View Comparison
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ width: '100%', mt: 2 }}>
        <TableBettingSummary 
          GameCategory={GameCategory as string } 
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