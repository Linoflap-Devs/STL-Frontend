import React, { useState } from "react";
import { Box, Typography, Grid, Button } from "@mui/material";

import DashboardCardsPage from "~/components/dashboard/DashboardCards";
import TableBettingActivityToday from '~/components/betting-summary/BettingActivityTodayTable'

import ChartBettorsvsBetsPlacedSummary from "~/components/betting-summary/BettorsvsBetsPlacedChart";
import ChartBetTypeSummary from "~/components/betting-summary/BetTypeChart";

import TableBettingSummary from "~/components/betting-summary/BettingSummaryTable";

const BettingSummaryPage = () => {
  const [managers, setManagers] = useState([]); // Example state for managers

  const handleCreate = () => {
    // Handle create action
  };

  const handleEdit = (user, action) => {
    // Handle edit action
  };

  const handleDelete = (ids) => {
    // Handle delete action
  };


  const hardcodedData = [
      {
        "transactionNumber": "2025040300000001",
        "date": "2025/01/22 13:05:32",
        "drawTime": "First Draw",
        "betAmount": "P 20",
        "gameType": "STL Pares",
        "betType": "Tumbok",
        "selectedPair": "25-12",
        "status": "Confirm"
      },
      {
        "transactionNumber": "2025040300000002",
        "date": "2025/01/22 13:05:32",
        "drawTime": "First Draw",
        "betAmount": "P 20",
        "gameType": "STL Pares",
        "betType": "Sahod",
        "selectedPair": "5-17",
        "status": "Void"
      },
      {
        "transactionNumber": "2025040300000003",
        "date": "2025/01/22 13:05:32",
        "drawTime": "First Draw",
        "betAmount": "P 20",
        "gameType": "STL Pares",
        "betType": "Tumbok",
        "selectedPair": "8-29",
        "status": "Confirm"
      },
      {
        "transactionNumber": "2025040300000004",
        "date": "2025/01/22 13:05:32",
        "drawTime": "First Draw",
        "betAmount": "P 20",
        "gameType": "STL Pares",
        "betType": "Tumbok",
        "selectedPair": "21-39",
        "status": "Confirm"
      },
      {
        "transactionNumber": "2025040300000005",
        "date": "2025/01/22 13:05:32",
        "drawTime": "First Draw",
        "betAmount": "P 20",
        "gameType": "STL Pares",
        "betType": "Sahod",
        "selectedPair": "3-27",
        "status": "Confirm"
      },
      {
        "transactionNumber": "2025040300000006",
        "date": "2025/01/22 13:05:32",
        "drawTime": "First Draw",
        "betAmount": "P 20",
        "gameType": "STL Pares",
        "betType": "Tumbok",
        "selectedPair": "14-36",
        "status": "Confirm"
      },
      {
        "transactionNumber": "2025040300000007",
        "date": "2025/01/22 13:05:32",
        "drawTime": "First Draw",
        "betAmount": "P 20",
        "gameType": "STL Pares",
        "betType": "Tumbok",
        "selectedPair": "19-25",
        "status": "Confirm"
      },
      {
        "transactionNumber": "2025040300000008",
        "date": "2025/01/22 13:05:32",
        "drawTime": "First Draw",
        "betAmount": "P 20",
        "gameType": "STL Pares",
        "betType": "Tumbok",
        "selectedPair": "6-31",
        "status": "Confirm"
      },
      {
        "transactionNumber": "2025040300000009",
        "date": "2025/01/22 13:05:32",
        "drawTime": "First Draw",
        "betAmount": "P 20",
        "gameType": "STL Pares",
        "betType": "Tumbok",
        "selectedPair": "10-40",
        "status": "Confirm"
      },
      {
        "transactionNumber": "2025040300000010",
        "date": "2025/01/22 13:05:32",
        "drawTime": "First Draw",
        "betAmount": "P 20",
        "gameType": "STL Pares",
        "betType": "Tumbok",
        "selectedPair": "12-33",
        "status": "Confirm"
      }
    ]

  return (
    <>
      <Box>
        <Typography sx={{ fontWeight: 700 }} variant="h4">
          Small Town Lottery Betting Summary
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
                  <TableBettingActivityToday />
                </Box>
              </Box>
            </Grid>

            {/* Column 2 (2 Cards) */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%" }}>
                <Box sx={{ flex: 1 }}>
                  <ChartBettorsvsBetsPlacedSummary />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <ChartBetTypeSummary />
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
          <TableBettingSummary
            managers={hardcodedData}
            onCreate={handleCreate}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Box>
      </Box>
    </>
  )
};

export default BettingSummaryPage;