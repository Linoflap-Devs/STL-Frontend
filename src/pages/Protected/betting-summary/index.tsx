import React from "react";
import BettingSummary from "~/components/betting-summary/BettorsvsBetsPlaced";
import { Box, Typography } from '@mui/material';

const BettingSummaryPage = () => {
  return (
    <div>
      <Box sx={{ mb: 2, }}>
        <Typography sx={{ fontWeight: 700, fontSize: 20 }}>
          Small Town Lottery Betting Summary
        </Typography>
      </Box>
      <BettingSummary />
    </div>
  );
};

export default BettingSummaryPage;