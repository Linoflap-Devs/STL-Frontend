import React, { useState, useEffect } from "react";
import { Box, Typography, Stack, CircularProgress } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { fetchTransactions } from "~/utils/api/transactions";
import { TodaysBettorCountByGameTypeData, addLabelsBets, addLabelsGameTypes } from "~/components/betting-summary/tooltips/dataSet";
// import fetchHistoricalSummary from "~/utils/api/transactions/getHistoricalSummary";



// Custom Legend (Dynamically Handles Bet Types)
const CustomLegend = () => (
  <Stack
    direction="row"
    spacing={2}
    justifyContent="left"
    sx={{ mt: 0.5, mr: 4 }}
    fontSize={12}
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
      <Typography color="#212121">Tumbok</Typography>
    </Box>
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box
        sx={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          backgroundColor: "#5050A5",
          mr: 1.5,
        }}
      />
      <Typography color="#212121">Sahod</Typography>
    </Box>
    {/* <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box
        sx={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          backgroundColor: "#7266C9",
          mr: 1.5,
        }}
      />
      <Typography color="#212121">Ramble</Typography>
    </Box> */}
  </Stack>
);

const ChartBettorsBetTypeSummary = (params: {gameCategoryId?: number}) => {

  // const ChartBettorsBetTypeSummary = () => {
  const [data, setData] = useState<
      { draw: string; tumbok: number, sahod: number, ramble: number }[]
    >([]);
  const [loading] = useState(false);

  const xAxisTicks = [
    0, 1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90,
    95, 100,
  ];

  useEffect(() => {
      const fetchData = async () => {
        // setLoading(true);
        try {
          const today = new Date().toISOString().split("T")[0];
          console.log(today); // Output: "2025-03-25T00:00:00.000Z"
          const response = await fetchTransactions({from: today, to: today}); // Add query params if needed
          console.log(response)

          // Filter Data for Today's Date
          let res = response.data.filter((item: { DateOfTransaction: string, GameCategoryId: number }) =>
            item.DateOfTransaction.startsWith(today)
          );

          if(params.gameCategoryId && params.gameCategoryId > 0) {
            res = res.filter((item: { GameCategoryId: number }) =>
              item.GameCategoryId === params.gameCategoryId
            );
          }
          
          console.log("BettorCountByBetType Response:", res)
  
          if (response.success && Array.isArray(res)) {
            // Aggregate data by GameTypeId
            const aggregatedData: Record<
              number,
              { tumbok: number; sahod: number; ramble: number }
            > = {};
  
            res.forEach(
              (item: {
                DrawOrder: number;
                Tumbok: number;
                Sahod: number;
                Ramble: number;
                GameCategoryId: number;
              }) => {
                if (!aggregatedData[item.DrawOrder]) {
                  aggregatedData[item.DrawOrder] = { tumbok: 0, sahod: 0, ramble: 0 };
                }
  
                aggregatedData[item.DrawOrder].tumbok += item.Tumbok;
                aggregatedData[item.DrawOrder].sahod += item.Sahod;
                aggregatedData[item.DrawOrder].ramble += item.Ramble;
              }
            );
  
            // Convert aggregated data into the required format
            const formattedData = [
              {
                draw: "First Draw",
                tumbok: aggregatedData[1]?.tumbok || 0,
                sahod: aggregatedData[1]?.sahod || 0,
                ramble: aggregatedData[1]?.ramble || 0,
              },
              {
                draw: "Second Draw",
                tumbok: aggregatedData[2]?.tumbok || 0,
                sahod: aggregatedData[2]?.sahod || 0,
                ramble: aggregatedData[2]?.ramble || 0,
              },
              {
                draw: "Third Draw",
                tumbok: aggregatedData[3]?.tumbok || 0,
                sahod: aggregatedData[3]?.sahod || 0,
                ramble: aggregatedData[3]?.ramble || 0,
              },
            ];
  
            setData(formattedData.map((item) => ({
                ...item,
                tumbok: item.tumbok / 100000,
                sahod: item.sahod / 100000,
                ramble: item.ramble / 100000
              }))
            );
            console.log("Formatted Data ",formattedData)
            // setLoading(false);
          }
        } catch (error) {
          console.log(
            "Error loading BettorsvsBetsPlacedSummary: " +
              (error as Error).message
          );
        }
      };
  
      fetchData();
      console.log(`Bettors vs Bets Placed Summary Data: ${data}`);
    }, []);

  return (
    <Box
      sx={{
        backgroundColor: "#F8F0E3",
        padding: "1rem",
        borderRadius: "8px",
        paddingBottom: "2rem",
        marginRight: 0,
        border: "1px solid #0038A8"
      }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography 
            color="#212121" 
            sx={{ 
              fontSize: "16px" 
            }}>
            Today&apos;s Bets Placed by Bet Type
          </Typography>
        </Box>
        <CustomLegend/>
      </Box>
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
          }}
        >
        { loading ? (
          <CircularProgress/>
        ) : (
        <BarChart
            height={300}
            // width={{100%}}
            grid={{ vertical: true }}
            slotProps={{ legend: { hidden: true } }}
            layout="horizontal"
            margin={{ left: 90, right: 20, top: 20, bottom: 40 }}
            dataset={data}
          yAxis={[
            {
              scaleType: "band",
              data: data.map(item => item.draw), // Use the draw names from your data
            },
          ]}
          xAxis={[
            {
              label: "Amount (in 100,000 units)",
              min: 0, 
              max: 100,
              //tickValues: xAxisTicks,
              //tickSpacing: 1,
            },
          ]}
          series={addLabelsBets([
            { 
              dataKey: 'tumbok', 
              label: 'Tumbok',
              color: '#E5C7FF' 
            },
            { 
              dataKey: 'sahod', 
              label: 'Sahod',
              color: '#5050A5' 
            },
            { 
              dataKey: 'ramble', 
              label: 'Ramble',
              color: '#7266C9' 
            },
            {
              dataKey: 'casas',
              label: 'Casas',
              color: '#E5C7FF'
            }
          ])}
          />
        )}
        </Box>
    </Box>
  );
};

export default ChartBettorsBetTypeSummary;
