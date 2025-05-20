import React, { useEffect, useState } from "react";
import { cardDashboardStyles } from "../../styles/theme";
import { fetchHistoricalSummary } from "../../utils/api/transactions";

const DashboardCardsPage = (params: { gameCategoryId?: number }) => {
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
        const today = new Date().toISOString().split("T")[0];
        const response = await fetchHistoricalSummary({from: today, to: today});

        if (response.success) {

          let filteredData = response.data

          console.log("Dashboard caards", filteredData)

          // // Filter data for today's date
          // let filteredData = response.data.filter(
          //   (item: { TransactionDate: string }) =>
          //     item.TransactionDate.startsWith(today)
          // );

          // Filter by category
          if (params.gameCategoryId && params.gameCategoryId > 0) {
            filteredData = filteredData.filter(
              (item: { GameCategoryId: number }) =>
                item.GameCategoryId === params.gameCategoryId
            );
          }

          console.log(filteredData);

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
  }, [params.gameCategoryId]);

  return (
    <div className="mt-8 flex flex-nowrap justify-start items-center gap-4 overflow-x-auto">
      {[
        { title: "Total Bettors", value: dashboardData.totalBettors },
        { title: "Total Winners", value: dashboardData.totalWinners },
        {
          title: "Total Bets Placed",
          value: `₱ ${dashboardData.totalBetsPlaced.toLocaleString()}`,
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
          className="w-full px-4 py-[1.5rem] bg-gray-800 rounded-lg"
          style={{ ...cardDashboardStyles }}
        >
          <p className="text-xs leading-4">{item.title}</p>
          {item.value === undefined || item.value === null ? (
            <div className="w-20 h-6 bg-gray-500 animate-pulse rounded-md mt-3" />
          ) : (
            <p className="text-base md:text-base lg:text-2xl font-bold leading-[1.1]">{item.value}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default DashboardCardsPage;
