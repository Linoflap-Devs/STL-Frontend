import React from "react";
import { Box, Typography } from '@mui/material';
import BetsPlacedvsTotalWinningsPage from "~/components/betting-summary/BetsPlacedvsTotalWinnings";
import BettorsvsBetsPlacedPage from "~/components/betting-summary/BettorsvsBetsPlaced";
import BetTimePage from "~/components/betting-summary/BetTime";

const BettingSummaryPage = () => {
  return (
    <div>
      <Box sx={{ mb: 2, }}>
        <Typography sx={{ fontWeight: 700, fontSize: 20 }}>
          Small Town Lottery Betting Summary
        </Typography>
        <BettorsvsBetsPlacedPage />
        <BetsPlacedvsTotalWinningsPage />
        <BetTimePage />
      </Box>
    </div>
  );
};

export default BettingSummaryPage;