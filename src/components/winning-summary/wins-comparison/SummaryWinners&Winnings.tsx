// import {useState, useEffect} from 'react';

import {
  Box,
  Typography,
  Stack,
} from "@mui/material";
import { BarChart } from '@mui/x-charts/BarChart';



type categoryType = 
  'Total Bettors and Bets' |
  'Total Bets by Bet Type' |
  'Total Bettors by Bet Type' |
  'Total Bets by Game Type' |
  'Total Bettors by Game Type';

// Map here, for Custom Legend if the Selected Date Type (Specific)
const getLegendItemsMap_Specific = (
  firstDateSpecific: Date | null,
  secondDateSpecific: Date | null,
): Record<categoryType, { label: string; color: string }[]> => ({
  'Total Bettors and Bets': [
    {
      label: `Bettors - ${firstDateSpecific ? firstDateSpecific.toLocaleDateString() : 'N/A'}`,
      color: '#E5C7FF',
    },
    {
      label: `Bettors - ${secondDateSpecific ? secondDateSpecific.toLocaleDateString() : 'N/A'}`,
      color: '#D2A7FF',
    },
    {
      label: `Bets - ${firstDateSpecific ? firstDateSpecific.toLocaleDateString() : 'N/A'}`,
      color: '#D2A7FF',
    },
    {
      label: `Bets - ${secondDateSpecific ? secondDateSpecific.toLocaleDateString() : 'N/A'}`,
      color: '#D2A7FF',
    },
  ],
  'Total Bets by Bet Type': [
    {
      label: `Tumbok - ${firstDateSpecific ? firstDateSpecific.toLocaleDateString() : 'N/A'}`,
      color: '#E5C7FF',
    },
    {
      label: `Tumbok - ${secondDateSpecific ? secondDateSpecific.toLocaleDateString() : 'N/A'}`,
      color: '#D2A7FF',
    },
    {
      label: `Sahod - ${firstDateSpecific ? firstDateSpecific.toLocaleDateString() : 'N/A'}`,
      color: '#D2A7FF',
    },
    {
      label: `Sahod - ${secondDateSpecific ? secondDateSpecific.toLocaleDateString() : 'N/A'}`,
      color: '#D2A7FF',
    },
  ],
  'Total Bettors by Bet Type': [
    {
      label: `Tumbok - ${firstDateSpecific ? firstDateSpecific.toLocaleDateString() : 'N/A'}`,
      color: '#E5C7FF',
    },
    {
      label: `Tumbok - ${secondDateSpecific ? secondDateSpecific.toLocaleDateString() : 'N/A'}`,
      color: '#D2A7FF',
    },
    {
      label: `Sahod - ${firstDateSpecific ? firstDateSpecific.toLocaleDateString() : 'N/A'}`,
      color: '#D2A7FF',
    },
    {
      label: `Sahod - ${secondDateSpecific ? secondDateSpecific.toLocaleDateString() : 'N/A'}`,
      color: '#D2A7FF',
    },
  ],
  'Total Bets by Game Type': [
    {
      label: `STL Pares - ${firstDateSpecific ? firstDateSpecific.toLocaleDateString() : 'N/A'}`,
      color: '#E5C7FF',
    },
    {
      label: `STL Pares - ${secondDateSpecific ? secondDateSpecific.toLocaleDateString() : 'N/A'}`,
      color: '#E5C7FF',
    },
    {
      label: `STL Swer2 - ${firstDateSpecific ? firstDateSpecific.toLocaleDateString() : 'N/A'}`,
      color: '#E5C7FF',
    },
    {
      label: `STL Swer2 - ${secondDateSpecific ? secondDateSpecific.toLocaleDateString() : 'N/A'}`,
      color: '#E5C7FF',
    },
    {
      label: `STL Swer3 - ${firstDateSpecific ? firstDateSpecific.toLocaleDateString() : 'N/A'}`,
      color: '#6F58C9',
    },
    {
      label: `STL Swer3 - ${secondDateSpecific ? secondDateSpecific.toLocaleDateString() : 'N/A'}`,
      color: '#6F58C9',
    }
    ,
    {
      label: `STL Swer4 - ${firstDateSpecific ? firstDateSpecific.toLocaleDateString() : 'N/A'}`,
      color: '#6F58C9',
    },
    {
      label: `STL Swer4 - ${secondDateSpecific ? secondDateSpecific.toLocaleDateString() : 'N/A'}`,
      color: '#6F58C9',
    }
  ],
  'Total Bettors by Game Type': [
    {
      label: `STL Pares - ${firstDateSpecific ? firstDateSpecific.toLocaleDateString() : 'N/A'}`,
      color: '#E5C7FF',
    },
    {
      label: `STL Pares - ${secondDateSpecific ? secondDateSpecific.toLocaleDateString() : 'N/A'}`,
      color: '#E5C7FF',
    },
    {
      label: `STL Swer2 - ${firstDateSpecific ? firstDateSpecific.toLocaleDateString() : 'N/A'}`,
      color: '#E5C7FF',
    },
    {
      label: `STL Swer2 - ${secondDateSpecific ? secondDateSpecific.toLocaleDateString() : 'N/A'}`,
      color: '#E5C7FF',
    },
    {
      label: `STL Swer3 - ${firstDateSpecific ? firstDateSpecific.toLocaleDateString() : 'N/A'}`,
      color: '#6F58C9',
    },
    {
      label: `STL Swer3 - ${secondDateSpecific ? secondDateSpecific.toLocaleDateString() : 'N/A'}`,
      color: '#6F58C9',
    }
    ,
    {
      label: `STL Swer4 - ${firstDateSpecific ? firstDateSpecific.toLocaleDateString() : 'N/A'}`,
      color: '#6F58C9',
    },
    {
      label: `STL Swer4 - ${secondDateSpecific ? secondDateSpecific.toLocaleDateString() : 'N/A'}`,
      color: '#6F58C9',
    }
  ]
});
// Map here, for Custom Legend if the Selected Date Type (Specific)
const getLegendItemsMap_Duration = (
  firstDateSpecific: Date | null,
  secondDateSpecific: Date | null,
  firstDateDuration: Date | null,
  secondDateDuration: Date | null,
): Record<categoryType, { label: string; color: string }[]> => ({
  'Total Bettors and Bets': [
    {
      label: `Bettors - ${firstDateSpecific ? firstDateSpecific.toLocaleDateString() : 'N/A'} - ${secondDateSpecific ? secondDateSpecific.toLocaleDateString() : 'NA'}`,
      color: '#E5C7FF',
    },
    {
      label: `Bettors - ${firstDateDuration ? firstDateDuration.toLocaleDateString() : 'N/A'} -  ${secondDateDuration ? secondDateDuration.toLocaleDateString() : 'N/A'}`,
      color: '#D2A7FF',
    },
    {
      label: `Bets - ${firstDateSpecific ? firstDateSpecific.toLocaleDateString() : 'N/A'} - ${secondDateSpecific ? secondDateSpecific.toLocaleDateString() : 'NA'}`,
      color: '#D2A7FF',
    },
    {
      label: `Bets - ${firstDateDuration ? firstDateDuration.toLocaleDateString() : 'N/A'} -  ${secondDateDuration ? secondDateDuration.toLocaleDateString() : 'N/A'}`,
      color: '#D2A7FF',
    },
  ],
  'Total Bets by Bet Type': [
    {
      label: `Tumbok - ${firstDateSpecific ? firstDateSpecific.toLocaleDateString() : 'N/A'} - ${secondDateSpecific ? secondDateSpecific.toLocaleDateString() : 'NA'}`,
      color: '#E5C7FF',
    },
    {
      label: `Tumbok - ${firstDateDuration ? firstDateDuration.toLocaleDateString() : 'N/A'} -  ${secondDateDuration ? secondDateDuration.toLocaleDateString() : 'N/A'}`,
      color: '#D2A7FF',
    },
    {
      label: `Sahod - ${firstDateSpecific ? firstDateSpecific.toLocaleDateString() : 'N/A'} - ${secondDateSpecific ? secondDateSpecific.toLocaleDateString() : 'NA'}`,
      color: '#D2A7FF',
    },
    {
      label: `Sahod - ${firstDateDuration ? firstDateDuration.toLocaleDateString() : 'N/A'} - ${secondDateDuration ? secondDateDuration.toLocaleDateString() : 'N/A'}`,
      color: '#D2A7FF',
    },
  ],
  'Total Bettors by Bet Type': [
    {
      label: `Tumbok - ${firstDateSpecific ? firstDateSpecific.toLocaleDateString() : 'N/A'} - ${secondDateSpecific ? secondDateSpecific.toLocaleDateString() : 'NA'}`,
      color: '#E5C7FF',
    },
    {
      label: `Tumbok - ${firstDateDuration ? firstDateDuration.toLocaleDateString() : 'N/A'} -  ${secondDateDuration ? secondDateDuration.toLocaleDateString() : 'N/A'}`,
      color: '#D2A7FF',
    },
    {
      label: `Sahod - ${firstDateSpecific ? firstDateSpecific.toLocaleDateString() : 'N/A'} - ${secondDateSpecific ? secondDateSpecific.toLocaleDateString() : 'NA'}`,
      color: '#D2A7FF',
    },
    {
      label: `Sahod - ${firstDateDuration ? firstDateDuration.toLocaleDateString() : 'N/A'} - ${secondDateDuration ? secondDateDuration.toLocaleDateString() : 'N/A'}`,
      color: '#D2A7FF',
    },
  ],
  'Total Bets by Game Type': [
    {
      label: `STL Pares - ${firstDateSpecific ? firstDateSpecific.toLocaleDateString() : 'N/A'} - ${secondDateSpecific ? secondDateSpecific.toLocaleDateString() : 'NA'}`,
      color: '#E5C7FF',
    },
    {
      label: `STL Pares - ${firstDateDuration ? firstDateDuration.toLocaleDateString() : 'N/A'} -  ${secondDateDuration ? secondDateDuration.toLocaleDateString() : 'N/A'}`,
      color: '#E5C7FF',
    },
    {
      label: `STL Swer2 - ${firstDateSpecific ? firstDateSpecific.toLocaleDateString() : 'N/A'} - ${secondDateSpecific ? secondDateSpecific.toLocaleDateString() : 'NA'}`,
      color: '#E5C7FF',
    },
    {
      label: `STL Swer2 - ${firstDateDuration ? firstDateDuration.toLocaleDateString() : 'N/A'} -  ${secondDateDuration ? secondDateDuration.toLocaleDateString() : 'N/A'}`,
      color: '#E5C7FF',
    },
    {
      label: `STL Swer3 - ${firstDateSpecific ? firstDateSpecific.toLocaleDateString() : 'N/A'} - ${secondDateSpecific ? secondDateSpecific.toLocaleDateString() : 'NA'}`,
      color: '#6F58C9',
    },
    {
      label: `STL Swer3 - ${firstDateDuration ? firstDateDuration.toLocaleDateString() : 'N/A'} -  ${secondDateDuration ? secondDateDuration.toLocaleDateString() : 'N/A'}`,
      color: '#6F58C9',
    }
    ,
    {
      label: `STL Swer4 - ${firstDateSpecific ? firstDateSpecific.toLocaleDateString() : 'N/A'} - ${secondDateSpecific ? secondDateSpecific.toLocaleDateString() : 'NA'}`,
      color: '#6F58C9',
    },
    {
      label: `STL Swer4 - ${firstDateDuration ? firstDateDuration.toLocaleDateString() : 'N/A'} -  ${secondDateDuration ? secondDateDuration.toLocaleDateString() : 'N/A'}`,
      color: '#6F58C9',
    }
  ],
  'Total Bettors by Game Type': [
    {
      label: `STL Pares - ${firstDateSpecific ? firstDateSpecific.toLocaleDateString() : 'N/A'} - ${secondDateSpecific ? secondDateSpecific.toLocaleDateString() : 'NA'}`,
      color: '#E5C7FF',
    },
    {
      label: `STL Pares - ${firstDateDuration ? firstDateDuration.toLocaleDateString() : 'N/A'} -  ${secondDateDuration ? secondDateDuration.toLocaleDateString() : 'N/A'}`,
      color: '#E5C7FF',
    },
    {
      label: `STL Swer2 - ${firstDateSpecific ? firstDateSpecific.toLocaleDateString() : 'N/A'} - ${secondDateSpecific ? secondDateSpecific.toLocaleDateString() : 'NA'}`,
      color: '#E5C7FF',
    },
    {
      label: `STL Swer2 - ${firstDateDuration ? firstDateDuration.toLocaleDateString() : 'N/A'} -  ${secondDateDuration ? secondDateDuration.toLocaleDateString() : 'N/A'}`,
      color: '#E5C7FF',
    },
    {
      label: `STL Swer3 - ${firstDateSpecific ? firstDateSpecific.toLocaleDateString() : 'N/A'} - ${secondDateSpecific ? secondDateSpecific.toLocaleDateString() : 'NA'}`,
      color: '#6F58C9',
    },
    {
      label: `STL Swer3 - ${firstDateDuration ? firstDateDuration.toLocaleDateString() : 'N/A'} -  ${secondDateDuration ? secondDateDuration.toLocaleDateString() : 'N/A'}`,
      color: '#6F58C9',
    }
    ,
    {
      label: `STL Swer4 - ${firstDateSpecific ? firstDateSpecific.toLocaleDateString() : 'N/A'} - ${secondDateSpecific ? secondDateSpecific.toLocaleDateString() : 'NA'}`,
      color: '#6F58C9',
    },
    {
      label: `STL Swer4 - ${firstDateDuration ? firstDateDuration.toLocaleDateString() : 'N/A'} -  ${secondDateDuration ? secondDateDuration.toLocaleDateString() : 'N/A'}`,
      color: '#6F58C9',
    }
  ]
});

interface WinnersandWinningsSummaryProps {
  categoryFilter: string;
  dateFilter: string;
  firstDateSpecific: Date | null;
  secondDateSpecific: Date | null;
  firstDateDuration: Date | null;
  secondDateDuration: Date | null;
}
const CustomLegend:React.FC<WinnersandWinningsSummaryProps>= ({    
  categoryFilter,
  dateFilter
  firstDateSpecific,
  secondDateSpecific,
  firstDateDuration,
  secondDateDuration,
}) => (
  
  // const legendItems = dateFilter === 
  // SPecific Date"

  <Stack
    direction="row"
    spacing={2}
    justifyContent="left"
    sx={{ mt: 0.5, mr: 4 }}
  >
    {legendItems.map((item, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              backgroundColor: item.color,
              mr: 1.5,
            }}
          />
          <Typography
            color="white"
            sx={{
              fontSize: '12px',
              fontWeight: 400,
              lineHeight: '14px',
            }}
          >
            {item.label}
          </Typography>
        </Box>
      ))}
  </Stack>
);

const ChartWinnersandWinningsSummary:React.FC<WinnersandWinningsSummaryProps> = 
({  
  categoryFilter,
  dateFilter,
  firstDateSpecific,
  secondDateSpecific,
  firstDateDuration,
  secondDateDuration, 

}) => {
  // const xAxisTicks = [0, 1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];

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
              Summary of Total Winners and and Winnings
          </Typography>
          <CustomLegend
            categoryFilter = { categoryFilter }
            firstDateSpecific = { firstDateSpecific }
            secondDateSpecific = { secondDateSpecific }
            firstDateDuration = { firstDateDuration }
            secondDateDuration = { secondDateDuration }
          />
  
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
                  // tickValues: xAxisTicks,
                  // tickSpacing:1,
                } ,
              ]}
            />
          </Box>
      </Box>
    );
}

export default ChartWinnersandWinningsSummary;