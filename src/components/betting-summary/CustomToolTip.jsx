import React from 'react';
import { Box, Typography } from '@mui/material';

interface TooltipProps {
  draw: string;
  bettors: number;
  bets: number;
  ratio: string;
}

const CustomTooltip: React.FC<TooltipProps> = ({ draw, bettors, bets, ratio }) => {
  return (
    <Box
      sx={{
        backgroundColor: '#222', // Adjust background color as needed
        color: 'white',
        padding: '1rem',
        borderRadius: '8px',
        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.3)', // Add a subtle shadow
        minWidth: '250px', // Set a minimum width for the tooltip
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
        {draw}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <Box
          sx={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            backgroundColor: '#E5C7FF', // Bettors color
            mr: 1.5,
          }}
        />
        <Typography>Bettors</Typography>
        <Typography sx={{ ml: 'auto', fontWeight: 'bold' }}>
          {bettors.toLocaleString()}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <Box
          sx={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            backgroundColor: '#D2A7FF', // Bets color
            mr: 1.5,
          }}
        />
        <Typography>Bets</Typography>
        <Typography sx={{ ml: 'auto', fontWeight: 'bold' }}>
          ₱ {bets.toLocaleString()}
        </Typography>
      </Box>
      <Typography sx={{ mt: 2 }}>
        Ratio of Bettors to Bets is <Typography component="span" sx={{ fontWeight: 'bold' }}>
          {ratio}
        </Typography>.
      </Typography>
    </Box>
  );
};

export default CustomTooltip;