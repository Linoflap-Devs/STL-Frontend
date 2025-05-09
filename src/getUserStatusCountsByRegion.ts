import { RegionUser, ChartBarItem } from "~/types/interfaces";
import dayjs from "dayjs";

// A utility to compute the status counts per region
export function computeChartDataByRegion<T extends RegionUser>(
  dashboardData: T[],
  getUserStatus: (user: T, cutoff: dayjs.Dayjs) => string, // Adjusted parameter type to Dayjs
  regions: string[],
  userType: string
): ChartBarItem[] {
  const sevenDaysAgo = dayjs().subtract(7, "days"); // Keep this as a Dayjs object

  const statsPerRegion = regions.map((region) => {
    const usersInRegion = dashboardData.filter(
      (user) => user.OperatorRegion?.RegionName === region
    );

    let active = 0, inactive = 0, suspended = 0, newlyRegistered = 0;

    usersInRegion.forEach((user) => {
      const status = getUserStatus(user, sevenDaysAgo); // Pass as Dayjs object
      switch (status) {
        case "Active": active++; break;
        case "Inactive": inactive++; break;
        case "Suspended": suspended++; break;
        case "New": newlyRegistered++; break;
      }
    });

    return {
      region,
      total: usersInRegion.length,
      active,
      inactive,
      suspended,
      new: newlyRegistered,
    };
  });

  return [
    {
      label: `Total ${userType}s`,
      color: "#4A90E2",
      data: statsPerRegion.map((r) => r.total),
    },
    {
      label: `Active ${userType}s`,
      color: "#50E3C2",
      data: statsPerRegion.map((r) => r.active),
    },
    {
      label: `Deleted ${userType}s`,
      color: "#F76E3F",
      data: statsPerRegion.map((r) => r.suspended),
    },
    {
      label: `Inactive ${userType}s`,
      color: "#F5A623",
      data: statsPerRegion.map((r) => r.inactive),
    },
    {
      label: `New ${userType}s`,
      color: "#7ED321",
      data: statsPerRegion.map((r) => r.new),
    },
  ];
}
