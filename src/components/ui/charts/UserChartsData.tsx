import { useEffect, useState } from "react";
import { ChartBarItem, ChartsDataPageProps } from "~/types/interfaces";
import useDashboardStore from "../../../../store/useDashboardStore";
import ChartCard from "./UserCharts";

const regionMap: Record<string, string> = {
  "I": "Region I",
  "II": "Region II",
  "III": "Region III",
  "IV A": "Region IV-A",
  "IV B": "Region IV-B",
  "V": "Region V",
  "VI": "Region VI",
  "VII": "Region VII",
  "VIII": "Region VIII",
  "IX": "Region IX",
  "X": "Region X",
  "XI": "Region XI",
  "XII": "Region XII",
  "XIII": "Region XIII",
  "BARMM": "BARMM",
  "CAR": "CAR",
  "NCR": "NCR",
};

const regions: string[] = [
  "I", "II", "III", "IV A", "IV B", "V", "VI", "VII", "VIII",
  "IX", "X", "XI", "XII", "XIII", "BARMM", "CAR", "NCR"
];

export const ChartsDataPage = <T extends { region: string }>({
  dashboardData,
  userType,
  getUserStatus,
  pageType,
}: ChartsDataPageProps<T>) => {
  const { sevenDaysAgo, setChartData } = useDashboardStore();
  const [chartData, setLocalChartData] = useState<ChartBarItem[]>([]);
  
  useEffect(() => {
    if (!dashboardData || dashboardData.length === 0) {
      return;
    }

    const statsPerRegion = regions.map((region) => {
      const mappedRegion = regionMap[region];
      const users = dashboardData.filter((user) => user.region === mappedRegion);

      let active = 0, inactive = 0, suspended = 0, newlyRegistered = 0;

      users.forEach((user: T) => {
        const status = getUserStatus(user, sevenDaysAgo.toISOString());
        
        switch (status) {
          case "Active": active++; break;
          case "Inactive": inactive++; break;
          case "Suspended": suspended++; break;
          case "New": newlyRegistered++; break;
        }
      });

      return {
        region,
        total: users.length,
        active,
        inactive,
        suspended,
        new: newlyRegistered,
      };
    });

    const newChartData: ChartBarItem[] = [
      {
        label: `Total ${userType}s`,
        color: "#BB86FC",
        data: statsPerRegion.map((r) => r.total),
      },
      {
        label: `Active ${userType}s`,
        color: "#5050A5",
        data: statsPerRegion.map((r) => r.active),
      },
      {
        label: `Inactive ${userType}s`,
        color: "#7266C9",
        data: statsPerRegion.map((r) => r.inactive),
      },
      {
        label: `Suspended ${userType}s`,
        color: "#3B3B81",
        data: statsPerRegion.map((r) => r.suspended),
      },
      {
        label: `New ${userType}s`,
        color: "#282A68",
        data: statsPerRegion.map((r) => r.new),
      },
    ];

    setLocalChartData(newChartData);
    setChartData(newChartData);

  }, [dashboardData, regions, regionMap, sevenDaysAgo, setChartData, userType, getUserStatus]);

  return (
    <div>
      <ChartCard
        chartData={chartData}
        regions={regions}
        label="Total   "
        title={`${(pageType).charAt(0).toUpperCase() + (pageType).slice(1)} Summary`}
        pageType={pageType}
      />
    </div>
  );
};

export default ChartsDataPage;
