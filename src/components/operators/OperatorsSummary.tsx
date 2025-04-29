import React from 'react'
import {
  Box,
  Typography,
  Stack,
} from "@mui/material";
import { BarChart } from '@mui/x-charts/BarChart';

function ChartOperatorsSummary() {
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
  const sampleChartData = [
    {
      label: "Total Operators",
      values: [10, 5, 8, 3, 12, 6, 14, 7, 9, 11, 4, 13, 2, 1, 6, 8, 10],
      color: "#E5C7FF",
    },
    {
      label: "Total Active Operators",
      values: [4, 9, 3, 10, 5, 12, 6, 11, 8, 2, 7, 1, 13, 14, 6, 8, 10],
      color: "#D2A7FF",
    },
    {
      label: "Total Deleted Operators",
      values: [7, 13, 5, 9, 10, 8, 3, 6, 12, 2, 1, 4, 11, 14, 6, 8, 10],
      color: "#BB86FC",
    },
    {
      label: "Total Inactive Operators",
      values: [11, 4, 9, 6, 3, 12, 14, 1, 2, 10, 5, 13, 8, 7, 6, 8, 10],
      color: "#A06FE6",
    },
    {
      label: "New Operators",
      values: [11, 4, 9, 6, 3, 12, 14, 1, 2, 10, 5, 13, 8, 7, 6, 8, 10],
      color: "#A06FE6",
    }
  ];
  return (
    <Box
      sx={{
          backgroundColor: "#171717",
          padding: "1rem",
          borderRadius: "8px",
          paddingBottom: "2rem",
          width: "100%",
          height: "600px"
      }}
    >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 0,
          }}
        >
          <Typography 
            color="#FFFFFF"
            sx={{ 
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "18px"
            }}
          >
            Operators Summary
          </Typography>

          <Box>
            <button
              style={{
                backgroundColor: "#67ABEB",
                color: "#000",
                border: "none",
                padding: "10px 24px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: "400",
                cursor: "pointer"
              }}
            >
              Export as CSV
            </button>
          </Box>
        </Box>

        <Stack direction="row" alignItems="center" spacing={1.5} mb={0}>
            <Box
              sx={{
                width: 15,
                height: 15,
                borderRadius: "50%",
                backgroundColor: "#BB86FC",
              }}
            />
            <Typography
              color="white"
              sx={{
                fontSize: "12px",
                fontWeight: 400,
                lineHeight: "14px",
              }}
            >
              Total Operators
            </Typography>
        </Stack>
        <Box
            sx={{
            height: "100%",
            // width: "100%",
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
        }}
        >
            <BarChart
              height={500} 
              margin={{ left: 90, right: 20, top: 20, bottom: 40 }}
              xAxis={[
                {
                  scaleType: "band",
                  data: philippineRegions,
                },
              ]}
              yAxis={[
                {
                  label: "Amount (in 100,000 units)",
                  min: 0,
                  max: 50,
                },
              ]}
              series={sampleChartData.map(item => ({
                data: item.values,
                color: item.color,
                label: item.label,
              }))}
            />
        </Box>
    </Box>
  )
}

export default ChartOperatorsSummary