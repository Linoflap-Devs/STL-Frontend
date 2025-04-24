import React from "react";
import { Box, Typography, Stack} from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import {
  BettorsandBetsSummaryProps,
  getLegendItemsMap_Specific,
  getLegendItemsMap_Duration,
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
      : getLegendItemsMap_Duration(
          categoryFilter,
          firstDateSpecific,
          secondDateSpecific,
          firstDateDuration,
          secondDateDuration
        );

  return (
    <Stack direction="row" spacing={4} sx={{ mt: 0.5, mr: 4 }}>
      {legendItems.map((item, index) => (
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
  );
};

const ChartTopRegionByBets: React.FC<BettorsandBetsSummaryProps> = ({
  categoryFilter,
  dateFilter,
  firstDateSpecific,
  secondDateSpecific,
  firstDateDuration,
  secondDateDuration,
}) => {
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
    "NCR",
  ];

  //  Array.from({ length: philippineRegions.length })
  //  new array w/ length equal to the number of regions in phRegions. initially filled with undefined values.

  //(_, index) => index + 1
  // (currentValue, currentIndex)
  // index = 0, returns 1.
  // index = 1, returns 2.

  // The result is an array of numbers starting from 1 up to the length of philippineRegions.
  const seriesData = Array.from({ length: philippineRegions.length }, (_, index) => index + 1);

  console.log("philippineRegions:", philippineRegions);
  console.log("series data:", seriesData);

  return (
    <Box
      sx={{
        backgroundColor: "#171717",
        padding: "1rem",
        borderRadius: "8px",
        paddingBottom: "2rem",
        width: "100%",
        height: "585px",
      }}
    >
      <Typography
        color="#FFFFFF"
        sx={{
          fontSize: "16px",
          fontWeight: 400,
          lineHeight: "18px",
          mb: "10px",
        }}
      >
        {`${categoryFilter}`}
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
        <LineChart
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
              max: 18, 
            },
          ]}
          series={[
            {
              data: [7,18,2,1,16,10,5,4,1,6,8,14,12,15,10,1,2], // Example data
              color: "#E5C7FF",
              curve: "linear"
            },
            {
              data: [8,17,3,2,15,9,4,5,11,12,7,6,13,14,11,2,3],
              color: "#3E2466",
              curve: "linear"
            }
            
          ]}
          grid={{ horizontal: true }}
        />
      </Box>
    </Box>
  );
};

export default ChartTopRegionByBets;