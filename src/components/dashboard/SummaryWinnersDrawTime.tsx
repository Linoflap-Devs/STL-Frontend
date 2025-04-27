import React, { useState, useEffect } from "react";
import { Box, Typography, Stack } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { fetchHistoricalSummary } from "../../utils/api/transactions";

// Custom Legend Component
const CustomLegend = () => (
  <Stack direction="row" spacing={2} justifyContent="left" sx={{ mt: 0.5, mr: 4 }}>
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#BB86FC", mr: 1.5 }} />
      <Typography color="white">Winners</Typography>
    </Box>
  </Stack>
);

// Mapping for game names
const gameNameMapping: { [key: number]: string } = {
  1: "First Draw",
  2: "Second Draw",
  3: "Third Draw",
};

// Default data structure when no data is available
const defaultGameData = [
  { gameName: "First Draw", winners: 0 },
  { gameName: "Second Draw", winners: 0 },
  { gameName: "Third Draw", winners: 0 },
];

const SummaryWinnersDrawTimePage = () => {
  const [data, setData] = useState<{ gameName: string; winners: number }[]>(defaultGameData);

  useEffect(() => {
    const fetchDataDashboard = async () => {
      try {
        const response = await fetchHistoricalSummary();
        //console.log("Full Response:", response);

        if (!response.success) {
          //console.error("API Request Failed:", response.message);
          return;
        }

        if (!Array.isArray(response.data) || response.data.length === 0) {
          //console.warn("No data available, using default dataset.");
          setData(defaultGameData);
          return;
        }

        // Determine today's date in UTC
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const todayISO = today.toISOString().split("T")[0];

        // Detect the correct date field dynamically
        const dateField = Object.keys(response.data[0]).find((key) =>
          key.toLowerCase().includes("date")
        );

        if (!dateField) {
          console.error("No valid date field found in response data.");
          setData(defaultGameData);
          return;
        }

        // Filter data by today's date
        let filteredData = response.data.filter((item: { [key: string]: string }) => {
          const itemDate = new Date(item[dateField]);
          itemDate.setUTCHours(0, 0, 0, 0);
          const itemISO = itemDate.toISOString().split("T")[0];

          //console.log(`Checking Date: ${itemISO} === ${todayISO} -> ${itemISO === todayISO}`);
          return itemISO === todayISO;
        });

        console.log("Filtered Data (Winners Summary):", filteredData);

        // Aggregate data by game type
        const aggregatedData = filteredData.reduce((acc: { gameName: string; winners: any; }[], item: { DrawOrder: any; TotalWinners: any; }) => {
          const gameTypeId = item.DrawOrder;
          const gameName = gameNameMapping[gameTypeId] || `Game ${gameTypeId}`;

          const existing = acc.find((g) => {console.log(g); return g.gameName === gameName});

          if (existing) {
            existing.winners += item.TotalWinners || 0;
          } else {
            acc.push({
              gameName,
              winners: item.TotalWinners || 0,
            });
          }

          return acc;
        }, [] as { gameName: string; winners: number }[]);

        // Ensure labels always exist, even if winners are 0
        const finalData = aggregatedData.length > 0 ? aggregatedData : defaultGameData;

        console.log("Final Aggregated Data:", finalData);
        setData(finalData);
      } catch (error) {
        console.error("Error Fetching Data:", error);
        setData(defaultGameData);
      }
    };

    fetchDataDashboard();
  }, []);

  return (
    <Box sx={{ backgroundColor: "#171717", padding: "1rem", borderRadius: "8px", paddingBottom: "2rem" }}>
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <Typography color="#FFFFFF" sx={{ fontSize: "20px" }}>
            Summary of Winners
          </Typography>
          <Typography color="#67ABEB" sx={{ fontSize: "12px", cursor: "pointer", textAlign: "right" }}>
            View Winners Summary
          </Typography>
        </Box>
        <CustomLegend />
      </Box>
      <Box sx={{ height: "100%", display: "flex", flexDirection: "row", flexGrow: 1 }}>
        <BarChart
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "stretch",
            flexGrow: 1,
            marginLeft: "3rem",
            marginTop: "-10px",
            height: "100%",
            width: "100%",
          }}
          height={270}
          width={790}
          margin={{left: 90}}
          grid={{ vertical: true }}
          layout="horizontal"
          series={[
            {
              data: data.map((item) => item.winners),
              color: "#BB86FC",
            },
          ]}
          yAxis={[
            {
              scaleType: "band",
              data: data.map((item) => item.gameName),
              tickLabelProps: { style: { fontSize: "12px" } },
            } as any,
          ]}
          xAxis={[
            {
              label: "Total Winners",
              scaleType: "linear",
              min: 0,
              max: Math.max(...data.map((item) => item.winners), 100),
              valueFormatter: (value: number) => `${value}`,
              tickSize: 8,
              barCategoryGap: 0.7,
            } as any,
          ]}
        />
      </Box>
    </Box>
  );
};

export default SummaryWinnersDrawTimePage;
