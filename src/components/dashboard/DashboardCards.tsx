import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { cardDashboardStyles } from "../../styles/theme";
import { fetchHistoricalSummary } from "../../utils/api/transactions";

const DashboardCardsPage = () => {
  const [dashboardData, setDashboardData] = useState({
    totalBettors: 0,
    totalWinners: 0,
    totalBetsPlaced: 0,
    totalPayout: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchDataDashboard = async () => {
      try {
        const response = await fetchHistoricalSummary();

        if (response.success) {
          const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD

          // Filter data for today's date
          const filteredData = response.data.filter(
            (item: { TransactionDate: string }) =>
              item.TransactionDate.startsWith(today)
          );

          // Aggregate the totals
          const totals = filteredData.reduce(
            (
              acc: {
                totalBettors: number;
                totalWinners: number;
                totalBetsPlaced: number;
                totalPayout: number;
                totalRevenue: number;
              },
              item: {
                TotalBettors: number;
                TotalWinners: number;
                TotalBetAmount: number;
                TotalPayout: number;
                TotalEarnings: number;
              }
            ) => {
              acc.totalBettors += item.TotalBettors || 0;
              acc.totalWinners += item.TotalWinners || 0;
              acc.totalBetsPlaced += item.TotalBetAmount || 0;
              acc.totalPayout += item.TotalPayout || 0;
              acc.totalRevenue += item.TotalEarnings || 0;
              return acc;
            },
            {
              totalBettors: 0,
              totalWinners: 0,
              totalBetsPlaced: 0,
              totalPayout: 0,
              totalRevenue: 0,
            }
          );

          setDashboardData(totals);
        } else {
          console.error("API Request Failed:", response.message);
        }
      } catch (error) {
        console.error("Error Fetching Data:", error);
      }
    };

    fetchDataDashboard();
  }, []);

  return (
    <div className="mt-3 flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-3">
      {[
        { title: "Total Bettors", value: dashboardData.totalBettors },
        { title: "Total Winners", value: dashboardData.totalWinners },
        {
          title: "Total Bets Placed",
          value: `${dashboardData.totalBetsPlaced.toLocaleString()}`,
        },
        {
          title: "Total Payout",
          value: `₱ ${dashboardData.totalPayout.toLocaleString()}`,
        },
        {
          title: "Total Revenue",
          value: `₱ ${dashboardData.totalRevenue.toLocaleString()}`,
        },
      ].map((item, index) => (
        <div
          key={index}
          className="px-4 py-[1.5rem] flex-[1_1_200px] bg-gray-800 rounded-lg"
          style={{ ...cardDashboardStyles }}
        >
          <p className="text-[12px] leading-4 text-gray-400">{item.title}</p>
          {item.value === undefined || item.value === null ? (
            <div className="w-20 h-6 bg-gray-500 animate-pulse rounded-md mt-3" />
          ) : (
            <p className="text-3xl font-bold leading-[1.1]">{item.value}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default DashboardCardsPage;
