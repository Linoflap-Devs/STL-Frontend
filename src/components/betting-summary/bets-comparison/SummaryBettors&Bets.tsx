// import {useState, useEffect} from 'react';

import {Box,Typography,Stack,} from "@mui/material";
import { BarChart } from '@mui/x-charts/BarChart';
import { 
    BettorsandBetsSummaryProps,
    getLegendItemsMap_Specific,
    getLegendItemsMap_Duration
  } from "../../../../store/useBettingStore";

const CustomLegend: React.FC<BettorsandBetsSummaryProps> = ({
  categoryFilter,
  dateFilter,
  firstDateSpecific,
  secondDateSpecific,
  firstDateDuration,
  secondDateDuration,
}) => {
  // Determine which legend items map to use based on the dateFilter
  const legendItems =
    dateFilter === "Specific Date"
      ? getLegendItemsMap_Specific(categoryFilter, firstDateSpecific, secondDateSpecific)
      : getLegendItemsMap_Duration(categoryFilter, firstDateSpecific, secondDateSpecific, firstDateDuration, secondDateDuration);

  // Group legend items into rows of 4 for a 4x2 grid layout
  const chunkedLegendItems = legendItems.reduce(
    (result, item, index) => {
      const chunkIndex = Math.floor(index / 4); // Group into rows of 4
      if (!result[chunkIndex]) {
        result[chunkIndex] = [];
      }
      result[chunkIndex].push(item);
      return result;
    },
    [] as { label: string; color: string }[][]
  );

  return (
    <Stack direction="column" spacing={1} sx={{ mt: 0.5, mr: 4 }}>
      {chunkedLegendItems.map((chunk, rowIndex) => (
        <Stack key={rowIndex} direction="row" spacing={2} justifyContent="left">
          {chunk.map((item, index) => (
            <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  backgroundColor: item.color,
                  mr: 1.5,
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
                {item.label}
              </Typography>
            </Box>
          ))}
        </Stack>
      ))}
    </Stack>
  );
};

const ChartBettorsAndBetsSummary: React.FC<BettorsandBetsSummaryProps> = ({
  categoryFilter,
  dateFilter,
  firstDateSpecific,
  secondDateSpecific,
  firstDateDuration,
  secondDateDuration,
}) => {

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
              {`Summary ${categoryFilter}`}
          </Typography>
          <CustomLegend
            categoryFilter={categoryFilter}
            dateFilter={dateFilter}
            firstDateSpecific={firstDateSpecific}
            secondDateSpecific={secondDateSpecific}
            firstDateDuration={firstDateDuration}
            secondDateDuration={secondDateDuration}
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

export default ChartBettorsAndBetsSummary;