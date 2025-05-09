import { useEffect, useState } from "react";
import { ChartBarItem, ChartsDataPageProps, RegionUser } from "~/types/interfaces";
import useDashboardStore from "../../../../store/useDashboardStore";
import ChartCard from "./UserCharts";
import { getUserStatus } from "~/utils/dashboarddata";

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

export const ChartsDataPage = <T extends RegionUser & { OperatorName?: string }>({
  dashboardData,
  userType,
  pageType,
}: ChartsDataPageProps<T>) => {
  const { sevenDaysAgo, setChartData } = useDashboardStore();
  const [chartData, setLocalChartData] = useState<ChartBarItem[]>([]);

  useEffect(() => {
    if (!dashboardData || dashboardData.length === 0) return;

    const statsPerRegion = regions.map((regionShort) => {
      const regionFull = regionMap[regionShort];
      //console.log(`\n=== Processing region: ${regionShort} (${regionFull}) ===`);

      const users = dashboardData.filter((user) => {
        let userRegionName = "";

        // Check user.Region first, if not available fallback to user.OperatorRegion?.RegionName
        if (user.Region) {
          // Access the Region object and get the RegionName
          const regionData = user.Region as any;

          if (typeof regionData.RegionName === "string") {
            userRegionName = regionData.RegionName;
          } else {
            console.warn("RegionName is not a string:", regionData.RegionName);
          }
        } else if (user.OperatorRegion?.RegionName) {
          userRegionName = user.OperatorRegion.RegionName;
        }

        const matches = userRegionName === regionFull;
        // console.log(
        //   `User: ${user.OperatorName} | RegionName: ${userRegionName} | Match: ${matches}`
        // );
        return matches;
      });

      //console.log(`Matched ${users.length} users in region ${regionShort}`);

      let active = 0, inactive = 0, deleted = 0, newlyRegistered = 0;

      users.forEach((user) => {
        const status = getUserStatus(user, sevenDaysAgo) ?? "Unknown";
        //console.log("→ getUserStatus returned:", status, "| For user:", user.OperatorName);

        switch (status) {
          case "Active":
            active++;
            break;
          case "Inactive":
            inactive++;
            break;
          case "Deleted":
            deleted++;
            break;
          case "New":
            newlyRegistered++;
            break;
          default:
          //console.warn("⚠️ Unmatched status:", status);
        }
      });

      return {
        region: regionShort,
        total: users.length,
        active,
        inactive,
        deleted,
        new: newlyRegistered,
      };
    });

    const newChartData: ChartBarItem[] = [
      {
        label: `Total ${pageType}s`,
        color: "#BB86FC",
        data: statsPerRegion.map((r) => r.total),
      },
      {
        label: `Active ${pageType}s`,
        color: "#5050A5",
        data: statsPerRegion.map((r) => r.active),
      },
      {
        label: `Inactive ${pageType}s`,
        color: "#7266C9",
        data: statsPerRegion.map((r) => r.inactive),
      },
      {
        label: `Deleted ${pageType}s`,
        color: "#3B3B81",
        data: statsPerRegion.map((r) => r.deleted),
      },
      {
        label: `New ${pageType}s`,
        color: "#282A68",
        data: statsPerRegion.map((r) => r.new),
      },
    ];

    //console.log("Regions Processed:", regions);
    //console.log("Chart data per label:", newChartData.map((item) => ({ label: item.label, data: item.data })));

    setLocalChartData(newChartData);
    setChartData(newChartData);
  }, [dashboardData, userType, sevenDaysAgo, setChartData]);

  return (
    <div>
      <ChartCard
        chartData={chartData}
        regions={regions}
        title={`${(pageType ?? "Unknown").charAt(0).toUpperCase() + (pageType ?? "Unknown").slice(1)} Summary`}
        pageType={pageType ?? "operator"}
      />
    </div>
  );
};

export default ChartsDataPage;