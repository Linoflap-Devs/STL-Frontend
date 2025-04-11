import React, { useEffect, useState } from "react";
import { Box, Typography, Stack, CircularProgress } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
// import fetchHistoricalSummary from "~/utils/api/transactions/getHistoricalSummary";

// Mapping GameTypeId to Draw Names
// const drawNames: Record<number, string> = {
//   1: "First Draw",
//   2: "Second Draw",
//   3: "Third Draw",
// };

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
      <Typography color="white">STL Pares</Typography>
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
      <Typography color="white">STL Swer2</Typography>
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
      <Typography color="white">STL Swer3</Typography>
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
      <Typography color="white">STL Swer4</Typography>
    </Box>
  </Stack>
);

const ChartBetTypeSummary = () => {
  // const [chartData, setChartData] = useState<
  //   Array<{ gameType: string } & Record<string, number>>
  // >([]);
  // const [loading, setLoading] = useState(true);
  // const [betTypes, setBetTypes] = useState<string[]>([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       const res = await fetchHistoricalSummary({});

  //       console.log(
  //         "Result Data from BetTypeChart:",
  //         JSON.stringify(res.data, null, 2)
  //       );

  //       if (res.success && Array.isArray(res.data)) {
  //         // Aggregate TotalBetAmount by GameTypeId and BetType
  //         // Aggregated Data is an object where
  //         // keys - number
  //         // values - object where:
  //         // key(string) value(number)
  //         const aggregatedData: Record<number, Record<string, number>> = {};

  //         res.data.forEach(
  //           (item: {
  //             GameTypeId: number;
  //             BetType: string;
  //             TotalBetAmount: number;
  //           }) => {
  //             if (!aggregatedData[item.GameTypeId]) {
  //               aggregatedData[item.GameTypeId] = {};
  //             }

  //             if (!aggregatedData[item.GameTypeId][item.BetType]) {
  //               aggregatedData[item.GameTypeId][item.BetType] = 0;
  //             }

  //             aggregatedData[item.GameTypeId][item.BetType] +=
  //               item.TotalBetAmount;
  //           }
  //         );

  //         console.log(
  //           "Aggregated Data from BetTypeChart:",
  //           JSON.stringify(aggregatedData, null, 2)
  //         );

  //         // Extract unique Bet Types
  //         const uniqueBetTypes = Array.from(
  //           new Set(res.data.map((item) => item.BetType))
  //         );

  //         // Format Data for Chart
  //         const formattedData = Object.entries(aggregatedData).map(
  //           ([gameTypeId, betTypes]) => ({
  //             gameTypeId: Number(gameTypeId),
  //             ...uniqueBetTypes.reduce(
  //               (acc, betType) => {
  //                 acc[betType] = betTypes[betType] || 0;
  //                 return acc;
  //               },
  //               {} as Record<string, number>
  //             ),
  //           })
  //         );

  //         console.log("Formatted Chart Data:", formattedData);

  //         setChartData(formattedData);
  //         setBetTypes(uniqueBetTypes); // Store unique bet types for reference
  //       }
  //     } catch (error) {
  //       console.error("Error loading data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // const maxX =
  //   chartData.length > 0
  //     ? Math.max(
  //         70,
  //         ...chartData.flatMap((item) =>
  //           betTypes.map((bet) => (item[bet] || 0) / 100000)
  //         )
  //       )
  //     : 70;
  // const xAxisTicks = Array.from({ length: 15 }, (_, i) => (i + 1) * 5); // Generates [5, 10, ..., 70]

  const xAxisTicks = [
    0, 1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90,
    95, 100,
  ];

  return (
    <Box
      sx={{
        backgroundColor: "#171717",
        padding: "1rem",
        borderRadius: "8px",
        paddingBottom: "2rem",
        marginRight: 0,
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
          <Typography color="#FFFFFF" sx={{ fontSize: "16px" }}>
            Today&apos;s Bettor Count by Game Type
          </Typography>
        </Box>
        <CustomLegend/>
      </Box>
      {/* {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 200,
          }}
        >
          <CircularProgress />
        </Box>
      ) : ( */}
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        <BarChart
          height={270}
          // width={{100%}}
          grid={{ vertical: true }}
          layout="horizontal"
          margin={{ left: 90, right: 20, top: 20, bottom: 40 }}
          series={[
            {
              data: [2, 4, 6],
              color: "#E5C7FF",
            },
            {
              data: [8, 10, 12],
              color: "#D2A7FF",
            },
            {
              data: [14, 16,18],  
              color: "#BB86FC",
            },
            {
              data: [20, 22, 24],
              color: "#A06FE6",
            },
          ]}
          yAxis={[
            {
              scaleType: "band",
              data: ["First Draw", "Second Draw", "Third Draw"],
              // series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }]},
            } as any,
          ]}
          xAxis={[
            {
              label: "Amount (in 100,000 units)",
              // scaleType: "linear",
              min: 0,
              max: 100,
              tickValues: xAxisTicks,
              tickSpacing: 1,
            } as any,
          ]}
        />
      </Box>
    </Box>
  );
};

export default ChartBetTypeSummary;
