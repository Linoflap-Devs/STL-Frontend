import React from 'react';
import Typography from '@mui/material/Typography';
import { Box, TextField, InputAdornment } from '@mui/material';
import RegionSection from '~/components/draw-summary/RegionSection';
import SearchIcon from '@mui/icons-material/Search';

const DrawSummaryPage = () => {
  return (
    <>
      <Box sx={{ mb: 2 }}>
        {/* Page Title */}
        <Typography sx={{ fontWeight: 700, fontSize: 20, mb: 4 }}>
          Small Town Lottery Draw Summary
        </Typography>

        {/* Search Input Bar with Magnifying Glass */}
        <TextField
          fullWidth
          placeholder="Search ..."
          variant="outlined"
          sx={{ width: '300px', mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'gray' }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Region I */}
        <RegionSection regionName="Region I - Ilocos Region" />

        {/* Region II */}
        <RegionSection regionName="Region II - Cagayan Valley" />

        {/* Region III */}
        <RegionSection regionName="Region III - Central Luzon" />
      </Box>
    </>
  );
};

export default DrawSummaryPage;
