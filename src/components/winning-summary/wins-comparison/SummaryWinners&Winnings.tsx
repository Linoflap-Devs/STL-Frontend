// import {useState, useEffect} from 'react';

import { Box, Typography, Stack,  } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { categoryType } from "../../../../store/useWinningStore";

// Map here, for Custom Legend if the Selected Date Type (Specific)
const getLegendItemsMap_Specific = (
  firstDateSpecific: string | null,
  secondDateSpecific: string | null
): Record<categoryType, { label: string; color: string }[]> => ({
  "Total Winners and Winnings": [
    {
      label: `Bettors - ${firstDateSpecific ? firstDateSpecific : "N/A"}`,
      color: "#E5C7FF",
    },
    {
      label: `Bettors - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
      color: "#D2A7FF",
    },
    {
      label: `Bets - ${firstDateSpecific ? firstDateSpecific : "N/A"}`,
      color: "#D2A7FF",
    },
    {
      label: `Bets - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
      color: "#D2A7FF",
    },
  ],
  "Total Winnings by Bet Type": [
    {
      label: `Tumbok - ${firstDateSpecific ? firstDateSpecific : "N/A"}`,
      color: "#E5C7FF",
    },
    {
      label: `Tumbok - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
      color: "#D2A7FF",
    },
    {
      label: `Sahod - ${firstDateSpecific ? firstDateSpecific : "N/A"}`,
      color: "#D2A7FF",
    },
    {
      label: `Sahod - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
      color: "#D2A7FF",
    },
  ],
  "Total Winners by Bet Type": [
    {
      label: `Tumbok - ${firstDateSpecific ? firstDateSpecific : "N/A"}`,
      color: "#E5C7FF",
    },
    {
      label: `Tumbok - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
      color: "#D2A7FF",
    },
    {
      label: `Sahod - ${firstDateSpecific ? firstDateSpecific : "N/A"}`,
      color: "#D2A7FF",
    },
    {
      label: `Sahod - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
      color: "#D2A7FF",
    },
  ],
  "Total Winnings by Game Type": [
    {
      label: `STL Pares - ${firstDateSpecific ? firstDateSpecific : "N/A"}`,
      color: "#E5C7FF",
    },
    {
      label: `STL Pares - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
      color: "#E5C7FF",
    },
    {
      label: `STL Swer2 - ${firstDateSpecific ? firstDateSpecific : "N/A"}`,
      color: "#BB86FC",
    },
    {
      label: `STL Swer2 - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
      color: "#BB86FC",
    },
    {
      label: `STL Swer3 - ${firstDateSpecific ? firstDateSpecific : "N/A"}`,
      color: "#6F58C9",
    },
    {
      label: `STL Swer3 - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
      color: "#6F58C9",
    },
    {
      label: `STL Swer4 - ${firstDateSpecific ? firstDateSpecific : "N/A"}`,
      color: "#3E2466",
    },
    {
      label: `STL Swer4 - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
      color: "#3E2466",
    },
  ],
  "Total Winners by Game Type": [
    {
      label: `STL Pares - ${firstDateSpecific ? firstDateSpecific : "N/A"}`,
      color: "#E5C7FF",
    },
    {
      label: `STL Pares - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
      color: "#E5C7FF",
    },
    {
      label: `STL Swer2 - ${firstDateSpecific ? firstDateSpecific : "N/A"}`,
      color: "#BB86FC",
    },
    {
      label: `STL Swer2 - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
      color: "#BB86FC",
    },
    {
      label: `STL Swer3 - ${firstDateSpecific ? firstDateSpecific : "N/A"}`,
      color: "#6F58C9",
    },
    {
      label: `STL Swer3 - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
      color: "#6F58C9",
    },
    {
      label: `STL Swer4 - ${firstDateSpecific ? firstDateSpecific : "N/A"}`,
      color: "#3E2466",
    },
    {
      label: `STL Swer4 - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
      color: "#3E2466",
    },
  ],
  "Top Winning Region by Winnings Comparison": [
    {
      label: "Ranking",
      color: "#E5C7FF",
    },
    {
      label: "Ranking",
      color: "##3E2466",
    },
  ],
  "Top Winner Region by Winners Comparison": [
    {
      label: "Ranking",
      color: "#E5C7FF",
    },
    {
      label: "Ranking",
      color: "##3E2466",
    },
  ],
});
// Map here, for Custom Legend if the Selected Date Type (Specific)
const getLegendItemsMap_Duration = (
  firstDateSpecific: string | null,
  secondDateSpecific: string | null,
  firstDateDuration: string | null,
  secondDateDuration: string | null
): Record<categoryType, { label: string; color: string }[]> => ({
  "Total Winners and Winnings": [
    {
      label: `Bettors - ${firstDateSpecific ? firstDateSpecific : "N/A"} - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
      color: "#E5C7FF",
    },
    {
      label: `Bettors - ${firstDateDuration ? firstDateDuration : "N/A"} - ${secondDateDuration ? secondDateDuration : "N/A"}`,
      color: "#D2A7FF",
    },
    {
      label: `Bets - ${firstDateSpecific ? firstDateSpecific : "N/A"} - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
      color: "#D2A7FF",
    },
    {
      label: `Bets - ${firstDateDuration ? firstDateDuration : "N/A"} - ${secondDateDuration ? secondDateDuration : "N/A"}`,
      color: "#D2A7FF",
    },
  ],
  "Total Winnings by Bet Type": [
    {
      label: `Tumbok - ${firstDateSpecific ? firstDateSpecific : "N/A"} - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
      color: "#E5C7FF",
    },
    {
      label: `Tumbok - ${firstDateDuration ? firstDateDuration : "N/A"} - ${secondDateDuration ? secondDateDuration : "N/A"}`,
      color: "#D2A7FF",
    },
    {
      label: `Sahod - ${firstDateSpecific ? firstDateSpecific : "N/A"} - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
      color: "#D2A7FF",
    },
    {
      label: `Sahod - ${firstDateDuration ? firstDateDuration : "N/A"} - ${secondDateDuration ? secondDateDuration : "N/A"}`,
      color: "#D2A7FF",
    },
  ],
  "Total Winners by Bet Type": [
    {
      label: `Tumbok - ${firstDateSpecific ? firstDateSpecific : "N/A"} - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
      color: "#E5C7FF",
    },
    {
      label: `Tumbok - ${firstDateDuration ? firstDateDuration : "N/A"} - ${secondDateDuration ? secondDateDuration : "N/A"}`,
      color: "#D2A7FF",
    },
    {
      label: `Sahod - ${firstDateSpecific ? firstDateSpecific : "N/A"} - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
      color: "#D2A7FF",
    },
    {
      label: `Sahod - ${firstDateDuration ? firstDateDuration : "N/A"} - ${secondDateDuration ? secondDateDuration : "N/A"}`,
      color: "#D2A7FF",
    },
  ],
  "Total Winnings by Game Type": [
    {
      label: `STL Pares - ${firstDateSpecific ? firstDateSpecific : "N/A"} - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
      color: "#E5C7FF",
    },
    {
      label: `STL Pares - ${firstDateDuration ? firstDateDuration : "N/A"} - ${secondDateDuration ? secondDateDuration : "N/A"}`,
      color: "#E5C7FF",
    },
    {
      label: `STL Swer2 - ${firstDateSpecific ? firstDateSpecific : "N/A"} - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
      color: "#E5C7FF",
    },
    {
      label: `STL Swer2 - ${firstDateDuration ? firstDateDuration : "N/A"} - ${secondDateDuration ? secondDateDuration : "N/A"}`,
      color: "#E5C7FF",
    },
    {
      label: `STL Swer3 - ${firstDateSpecific ? firstDateSpecific : "N/A"} - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
      color: "#6F58C9",
    },
    {
      label: `STL Swer3 - ${firstDateDuration ? firstDateDuration : "N/A"} - ${secondDateDuration ? secondDateDuration : "N/A"}`,
      color: "#6F58C9",
    },
    {
      label: `STL Swer4 - ${firstDateSpecific ? firstDateSpecific : "N/A"} - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
      color: "#6F58C9",
    },
    {
      label: `STL Swer4 - ${firstDateDuration ? firstDateDuration : "N/A"} - ${secondDateDuration ? secondDateDuration : "N/A"}`,
      color: "#6F58C9",
    },
  ],
  "Total Winners by Game Type": [
    {
      label: `STL Pares - ${firstDateSpecific ? firstDateSpecific : "N/A"} - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
      color: "#E5C7FF",
    },
    {
      label: `STL Pares - ${firstDateDuration ? firstDateDuration : "N/A"} - ${secondDateDuration ? secondDateDuration : "N/A"}`,
      color: "#E5C7FF",
    },
    {
      label: `STL Swer2 - ${firstDateSpecific ? firstDateSpecific : "N/A"} - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
      color: "#E5C7FF",
    },
    {
      label: `STL Swer2 - ${firstDateDuration ? firstDateDuration : "N/A"} - ${secondDateDuration ? secondDateDuration : "N/A"}`,
      color: "#E5C7FF",
    },
    {
      label: `STL Swer3 - ${firstDateSpecific ? firstDateSpecific : "N/A"} - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
      color: "#6F58C9",
    },
    {
      label: `STL Swer3 - ${firstDateDuration ? firstDateDuration : "N/A"} - ${secondDateDuration ? secondDateDuration : "N/A"}`,
      color: "#6F58C9",
    },
    {
      label: `STL Swer4 - ${firstDateSpecific ? firstDateSpecific : "N/A"} - ${secondDateSpecific ? secondDateSpecific : "N/A"}`,
      color: "#6F58C9",
    },
    {
      label: `STL Swer4 - ${firstDateDuration ? firstDateDuration : "N/A"} - ${secondDateDuration ? secondDateDuration : "N/A"}`,
      color: "#6F58C9",
    },
  ],
  "Top Winning Region by Winnings Comparison": [
    {
      label: "Ranking",
      color: "#E5C7FF",
    },
    {
      label: "Ranking",
      color: "##3E2466",
    },
  ],
  "Top Winner Region by Winners Comparison": [
    {
      label: "Ranking",
      color: "#E5C7FF",
    },
    {
      label: "Ranking",
      color: "##3E2466",
    },
  ],
});

interface WinnersandWinningsSummaryProps {
  categoryFilter: categoryType;
  dateFilter: string;
  firstDateSpecific: string | null;
  secondDateSpecific: string | null;
  firstDateDuration: string | null;
  secondDateDuration: string | null;
}

const CustomLegend: React.FC<WinnersandWinningsSummaryProps> = ({
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
      ? getLegendItemsMap_Specific(firstDateSpecific, secondDateSpecific)[
          categoryFilter
        ] || []
      : getLegendItemsMap_Duration(
          firstDateSpecific,
          secondDateSpecific,
          firstDateDuration,
          secondDateDuration
        )[categoryFilter] || [];

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

const ChartWinnersandWinningsSummary: React.FC<WinnersandWinningsSummaryProps> = ({
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
        height: "511px",
        // display: "flex",
        // justifyContent: "center",
        // alignItems: "center"
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
              data: [5, 10, 15],
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
            },
          ]}
        />
      </Box>
    </Box>
  );
};

export default ChartWinnersandWinningsSummary;
