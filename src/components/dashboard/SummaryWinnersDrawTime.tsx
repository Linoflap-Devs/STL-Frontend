import React, { useState, useEffect } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { fetchHistoricalSummary } from "../../utils/api/transactions";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";
import { buttonStyles } from "~/styles/theme";

// Custom Legend Component
const CustomLegend = () => (
  <div className="flex flex-row text-sm space-x-8 justify-start mt-1 mr-4">
    <div className="flex items-center">
      <div className="w-3.5 h-3.5 rounded-full bg-[#BB86FC] mr-1.5" />
      <p>Winners</p>
    </div>
  </div>
);

const CustomNoDataOverlay = () => (
  <div className="h-full flex flex-col items-center justify-end pb-4 text-gray-500 text-base">
    <span>Summary of Winners</span>
    <span>data will be displayed once available.</span>
  </div>
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
  const [data, setData] =
    useState<{ gameName: string; winners: number }[]>(defaultGameData);
  const router = useRouter();

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
        let filteredData = response.data.filter(
          (item: { [key: string]: string }) => {
            const itemDate = new Date(item[dateField]);
            itemDate.setUTCHours(0, 0, 0, 0);
            const itemISO = itemDate.toISOString().split("T")[0];

            //console.log(`Checking Date: ${itemISO} === ${todayISO} -> ${itemISO === todayISO}`);
            return itemISO === todayISO;
          }
        );

        console.log("Filtered Data (Winners Summary):", filteredData);

        // Aggregate data by game type
        const aggregatedData = filteredData.reduce(
          (
            acc: { gameName: string; winners: any }[],
            item: { DrawOrder: any; TotalWinners: any }
          ) => {
            const gameTypeId = item.DrawOrder;
            const gameName =
              gameNameMapping[gameTypeId] || `Game ${gameTypeId}`;

            const existing = acc.find((g) => {
              console.log(g);
              return g.gameName === gameName;
            });

            if (existing) {
              existing.winners += item.TotalWinners || 0;
            } else {
              acc.push({
                gameName,
                winners: item.TotalWinners || 0,
              });
            }

            return acc;
          },
          [] as { gameName: string; winners: number }[]
        );

        // Ensure labels always exist, even if winners are 0
        const finalData =
          aggregatedData.length > 0 ? aggregatedData : defaultGameData;

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
    <div className="bg-transparent px-4 py-7 rounded-xl border border-[#0038A8]">
      <div>
        <div className="flex justify-between items-center w-full">
          <div className="flex flex-col leading-none">
            <p className="text-lg leading-none">Summary of Winners</p>
            <CustomLegend />
          </div>
          <Button sx={buttonStyles} variant="contained">
            Export as CSV
          </Button>
        </div>
      </div>
      <div>
        <BarChart
          height={300}
          grid={{ vertical: true }}
          layout="horizontal"
          margin={{ left: 90, right: 20, top: 20, bottom: 40 }}
          slotProps={{ 
            noDataOverlay: { message: 'Summary of Winners data will be displayed once available.' },
            legend: { hidden: true } }}
          series={[
            {
              data: data.map((item) => item.winners),
              color: "#BB86FC",
              label: "Winners",
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
              max: Math.max(...data.map((item) => item.winners), 70),
              valueFormatter: (value: number) => `${value}`,
              tickSize: 8,
              barCategoryGap: 0.7,
            } as any,
          ]}
        />
      </div>
    </div>
  );
};

export default SummaryWinnersDrawTimePage;
