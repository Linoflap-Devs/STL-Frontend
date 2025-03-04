import React, { useEffect } from 'react';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import { Box, TextField, InputAdornment } from '@mui/material';
import RegionSection from '~/components/draw-summary/RegionSection';
import SearchIcon from '@mui/icons-material/Search';

// transfer to api/drawSummary
import axios from 'axios';


const DrawSummaryPage = () => {

  // transfer to api/drawSummary
  // const [regionData, setRegionData] = useState([]);
  // useEffect (() =>  {
  //   async function fetchData() {
  //     try {
  //       const res = await axios.get('https://api.example.com/draws');
  //         setRegionData(res.data);
  //         console.log('Response Data: ', res.data);
  //       } catch (error) {
  //         console.error('Error fetching data: ', error)
  //       }
  //   }

  //   fetchData();
  // }, [])


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

        {/* Render Region Sections with API Data
        {regionData.map((region: any, index: number) => (
          <RegionSection key={index} regionName={region.region} cards={region.cards} />
        ))} */}

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
