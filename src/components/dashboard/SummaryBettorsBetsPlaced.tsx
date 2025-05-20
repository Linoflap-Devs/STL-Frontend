import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { fetchHistoricalSummary } from "../../utils/api/transactions";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";
import { buttonStyles } from "~/styles/theme";

// Custom Legend circle
const CustomLegend = () => (
  <div className="flex flex-row text-sm space-x-8 justify-start mt-1 mr-4">
    <div className="flex items-center">
      <div className="w-3.5 h-3.5 rounded-full bg-[#BB86FC] mr-2" />
      <p>Bettors</p>
    </div>
    <div className="flex items-center">
      <div className="w-3.5 h-3.5 rounded-full bg-[#5050A5] mr-2" />
      <p>Bets</p>
    </div>
  </div>
);

const summary: Record<
  number,
  { gameName: string; bettors: number; bets: number; winners: number }
> = {
  1: { gameName: "First Draw", bettors: 0, bets: 0, winners: 0 },
  2: { gameName: "Second Draw", bettors: 0, bets: 0, winners: 0 },
  3: { gameName: "Third Draw", bettors: 0, bets: 0, winners: 0 },
};

const SummaryBettorsBetsPlacedPage = () => {
  const [data, setData] = useState<
    { gameName: string; bettors: number; bets: number; winners: number }[]
  >([]);
  const summaryRecord = summary as Record<
    number,
    { gameName: string; bettors: number; bets: number; winners: number }
  >;

  const router = useRouter();
  const maxValue = Math.max(...data.map((item) => item.bets));
  const safeMax = maxValue < 1000 ? 1000 : maxValue;
  useEffect(() => {
    const fetchDataDashboard = async () => {
      try {
        const response = await fetchHistoricalSummary();
        console.log("API Response of Bettors charts:", response);

        if (response.success) {
          console.log("Processing data...");

          const today = new Date().toISOString().split("T")[0];
          console.log(today);

          // Filter Data for Today's Date
          const filteredData = response.data.filter(
            (item: { TransactionDate: string }) =>
              item.TransactionDate.startsWith(today)
          );

          // Initialize Data Aggregation
          const summary = {
            1: { gameName: "First Draw", bettors: 0, bets: 0, winners: 0 },
            2: { gameName: "Second Draw", bettors: 0, bets: 0, winners: 0 },
            3: { gameName: "Third Draw", bettors: 0, bets: 0, winners: 0 },
          };

          // Loop through filtered data and update summary
          filteredData.forEach(
            (item: {
              DrawOrder: number;
              TotalBettors: number;
              TotalBetAmount: number;
              TotalWinners: number;
            }) => {
              if (summaryRecord[item.DrawOrder]) {
                summaryRecord[item.DrawOrder].bettors += item.TotalBettors || 0;
                summaryRecord[item.DrawOrder].bets += item.TotalBetAmount || 0;
                summaryRecord[item.DrawOrder].winners += item.TotalWinners || 0;
              }
            }
          );

          // Convert summary object to an array
          const formattedData = Object.values(summaryRecord);

          console.log(formattedData);

          //console.log("Aggregated Data:", formattedData);
          setData(formattedData);
        } else {
          console.error("API Request Failed:", response.message);
        }
      } catch (error) {
        console.error("Error Fetching Data:", error);
      }
    };

    fetchDataDashboard();
  }, []);

  const moveToBetSummary = () => {
    router.push("/betting-summary/dashboard");
  };

  return (
    <div className="bg-transparent px-4 py-7 rounded-xl border border-[#0038A8]">
      <div>
        <div className="flex justify-between items-center w-full">
          <div className="flex flex-col leading-none">
            <p className="text-lg leading-none">Summary of Bettors and Bets Placed Today</p>
            <CustomLegend />
          </div>
          <Button sx={buttonStyles} variant="contained">
            Export as CSV
          </Button>
        </div>
      </div>
      <div className="h-full w-full">
        <BarChart
          height={300}
          grid={{ vertical: true }}
          layout="horizontal"
          margin={{ left: 90, right: 20, top: 20, bottom: 40 }}
          slotProps={{ legend: { hidden: true } }}
          series={[
            {
              data: data.map((item) => item.bettors),
              color: "#BB86FC",
              label: "Bettors",
            },
            {
              data: data.map((item) => item.bets),
              color: "#5050A5",
              label: "Bets",
            },
          ]}
          yAxis={[
            {
              scaleType: "band",
              data: data.map((item) => item.gameName),
              tickLabelProps: { style: { fontSize: "14px" } },
            } as any,
          ]}
          xAxis={[
            {
              label: "Amount (in 100,000 units)",
              scaleType: "linear",
              min: 0,
              max: safeMax,
              valueFormatter: (value: number) => `${value.toLocaleString()}`,
              tickSize: 2,
              barCategoryGap: 0.2,
              tickLabelProps: { style: { fontSize: "12px" } },
            } as any,
          ]}
        />
      </div>
    </div>
  );
};

export default SummaryBettorsBetsPlacedPage;
