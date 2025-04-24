import React from 'react'
import {
  Box,
  Typography,
  Stack,
} from '@mui/material'
import { LineChart } from '@mui/x-charts/LineChart';
import { categoryType } from '../../../../store/useBettingStore';



const ChartTopRegionByBets 

  => {

  const philippineRegions = [
    "I",
    "II",
    "III",
    "IV-A",
    "IV-B",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
    "XI",
    "XII",
    "XIII",
    "BARMM",
    "CAR",
    "NCR"
  ];

  return (
    <Box
    sx={{
        backgroundColor: "#171717",
        padding: "1rem",
        borderRadius: "8px",
        paddingBottom: "2rem",
        width: "100%",
        height: "585px"
    }}
    >
        <Typography color="#FFFFFF" 
        sx={{ 
            fontSize: "16px",
            fontWeight: 400,
            lineHeight: "18px",
            mb: "10px"
        }}>
            {/* { `Regional Summary of ${categoryFilter}`} */}
        </Typography>
        {/* <CustomLegend
            categoryFilter={categoryFilter}
            dateFilter={dateFilter}
            firstDateSpecific={firstDateSpecific}
            secondDateSpecific={secondDateSpecific}
            firstDateDuration={firstDateDuration}
            secondDateDuration={secondDateDuration}
        /> */}
        <Box
            sx={{
            height: "100%",
            // width: "100%",
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
        }}
        >
            <LineChart
              height={500} 
              margin={{ left: 90, right: 20, top: 20, bottom: 40 }}
              xAxis={[
                {
                  scaleType: "band",
                  // data: philippineRegions, // Ensure this matches the number of data points
                },
              ]}
              yAxis={[
                {
                  label: "Amount (in 100,000 units)",
                  min: 0,
                  max: 100, // Adjust max to fit your data range
                  // tickValues: yAxisTicks, // Ensure all ticks are displayed
                  // tickSpacing: 5, // Optional: Adjust spacing between ticks
                },
              ]}
              series={[
                {
                  data: Array.from({ length: 17 }, (_, index) => index + 1), // 17 data points
                  color: "#E5C7FF",
                },
                {
                  data: Array.from({ length: 17 }, (_, index) => (index + 1) * 2), // 17 data points
                  color: "#D2A7FF",
                },
                {
                  data: Array.from({ length: 17 }, (_, index) => (index + 1) * 3), // 17 data points
                  color: "#BB86FC",
                },
                {
                  data: Array.from({ length: 17 }, (_, index) => (index + 1) * 4), // 17 data points
                  color: "#A06FE6",
                },
              ]}
              // Optional: Increase width for better x-axis spacing
            />
        </Box>
    </Box>
  )
}

export default ChartTopRegionByBets