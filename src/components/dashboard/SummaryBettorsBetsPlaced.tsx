import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { fetchHistoricalSummary } from "../../utils/api/transactions";
import { useRouter } from "next/navigation";

// Custom Legend
const CustomLegend = () => (
  <div className="flex flex-row space-x-8 justify-start mt-1 mr-4">
    <div className="flex items-center">
      <div className="w-3.5 h-3.5 rounded-full bg-[#BB86FC] mr-1.5" />
      <p>Bettors</p>
    </div>
    <div className="flex items-center">
      <div className="w-3.5 h-3.5 rounded-full bg-[#5050A5] mr-1.5" />
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

  useEffect(() => {
    const fetchDataDashboard = async () => {
      try {
        const response = await fetchHistoricalSummary();
        //console.log("API Response of Bettors charts:", response);

        if (response.success) {
          //console.log("Processing data...");

          const today = new Date().toISOString().split("T")[0];
          console.log(today); // Output: "2025-03-25T00:00:00.000Z"

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
              TotalBets: number;
              TotalWinners: number;
            }) => {
              if (summaryRecord[item.DrawOrder]) {
                summaryRecord[item.DrawOrder].bettors += item.TotalBettors || 0;
                summaryRecord[item.DrawOrder].bets += item.TotalBets || 0;
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
  <div className="bg-transparent p-4 rounded-xl border border-[#0038A8]">
      <div>
        <div className="flex justify-between items-center w-full">
          <p className="text-xl">
            Summary of Bettors and Bets Placed Today
          </p>
        </div>
        <CustomLegend />
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
              max: Math.max(...data.map((item) => item.bets / 100000), 70),
              valueFormatter: (value: number) => `${value}`,
              tickSize: 2,
              barCategoryGap: 0.3,
              tickLabelProps: { style: { fontSize: "12px" } },
            } as any,
          ]}
        />
      </div>
    </div>
  );
};

export default SummaryBettorsBetsPlacedPage;
