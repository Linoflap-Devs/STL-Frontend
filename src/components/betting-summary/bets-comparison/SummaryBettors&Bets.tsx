// import {useState, useEffect} from 'react';

import {
  Box,
  Typography,
  Stack,
} from "@mui/material";
import { BarChart } from '@mui/x-charts/BarChart';


const CustomLegend = () => (
  <Stack
    direction="row"
    spacing={2}
    justifyContent="left"
    sx={{ mt: 0.5, mr: 4 }}
  >
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box
        sx={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          backgroundColor: "#E5C7FF",
          mr: 1.5,
        }}
      />
        <Typography color="white" sx={{
          fontSize: "12x",
          fontWeight: 400,
          lineHeight: "14px",
        }}>
          Bettors - 02/07/2025
        </Typography>
    </Box>
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box
        sx={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          backgroundColor: "#D2A7FF",
          mr: 1.5,
        }}
      />
        <Typography color="white" sx={{
          fontSize: "12x",
          fontWeight: 400,
          lineHeight: "14px",
        }}>
          Bettors - 02/08/2025
        </Typography>
    </Box>
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box
        sx={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          backgroundColor: "#BB86FC",
          mr: 1.5,
        }}
      />
          <Typography color="white" sx={{
            fontSize: "12x",
            fontWeight: 400,
            lineHeight: "14px",
          }}>
            Bets - 02/07/2025
          </Typography>
    </Box>
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box
        sx={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          backgroundColor: "#A06FE6",
          mr: 1.5,
        }}
      />
        <Typography color="white" sx={{
            fontSize: "12x",
            fontWeight: 400,
            lineHeight: "14px",
          }}>
            Bets - 02/08/2025
        </Typography>
    </Box>
  </Stack>
);
const ChartBettorsAndBetsSummary = () => {
  const xAxisTicks = [0, 1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];

  return (
      <Box
        sx={{
          backgroundColor: "#171717",
          padding: "1rem",
          borderRadius: "8px",
          paddingBottom: "2rem",
          width: "100%",
          height: "511px"
          // display: "flex",
          // justifyContent: "center",
          // alignItems: "center"
        }}
      >
          <Typography color="#FFFFFF" 
            sx={{ 
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "18px",
              mb: "10px"
            }}>
              Summary of Total Bettors and Bets
          </Typography>
          <CustomLegend />
  
          <Box
              sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
            }}
          >
            <BarChart
              height={400}
              // width={{100%}}
              grid={{ vertical: true }}
              layout="horizontal"
              margin={{ left: 90, right: 20, top: 20, bottom: 40 }}
              series={[
                {
                  data: [5, 10,15],
                  color: "#E5C7FF",
                },
                {
                  data: [20, 25, 30],
                  color: "#D2A7FF",
                },
                {
                  data: [35, 40, 45],
                  color: "#D2A7FF",
                },
                {
                  data: [50, 55, 60],
                  color: "#D2A7FF",
                },
              ]}
              yAxis={[
                {
                  scaleType: "band",
                  data: ["First Draw", "Second Draw", "Third Draw"], 
                  // series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }]},
                },
              ]}
              xAxis={[
                {
                  label: "Amount (in 100,000 units)",
                  // scaleType: "linear",
                  min: 0, 
                  max: 100,
                  tickValues: xAxisTicks,
                  tickSpacing:1,
                } ,
              ]}
            />
          </Box>
      </Box>
    );
}

export default ChartBettorsAndBetsSummary;