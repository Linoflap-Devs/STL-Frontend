import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import {
  buttonStyles,
  cardDashboardStyles,
} from "../../styles/theme";
import { BarChart } from "@mui/x-charts/BarChart";
import dayjs from "dayjs";
import { User } from "./UsersTable";

interface UserDashboardPageProps {
  roleId: number;
  getUserStatus: (user: User, sevenDaysAgo: dayjs.Dayjs) => string;
  users: User[];
  sevenDaysAgo: dayjs.Dayjs;
}

const getLegendItems = (pageType: string) => [
  {
    color: "#BB86FC",
    label: pageType === "manager" ? "Total Managers" : "Total Executives",
  },
  {
    color: "#5050A5",
    label:
      pageType === "manager"
        ? "Total Active Managers"
        : "Total Active Executives",
  },
  {
    color: "#7266C9",
    label:
      pageType === "manager"
        ? "Total of Inactive Managers"
        : "Total of Inactive Executives",
  },
  {
    color: "#3B3B81",
    label:
      pageType === "manager"
        ? "Total of Deleted Managers"
        : "Total of Deleted Executives",
  },
  {
    color: "#282A68",
    label:
      pageType === "manager"
        ? "Total of New Managers"
        : "Total of New Executives",
  },
];

const CustomLegend = ({ pageType }: { pageType: string }) => (
  <div className="flex flex-row gap-2 justify-start mr-2">
    {getLegendItems(pageType).map((item) => (
      <div key={item.label} className="flex items-start gap-2">
        <div
          className="w-3 h-3 rounded-full mt-1"
          style={{ backgroundColor: item.color }}
        />
        <span className="text-sm text-white">{item.label}</span>
      </div>
    ))}
  </div>
);

const UserDashboardPage: React.FC<UserDashboardPageProps> = ({
  users,
  roleId,
  getUserStatus,
  sevenDaysAgo,
}) => {
  const [dashboardData, setDashboardData] = useState<Record<string, any>>({});
  const [chartData, setChartData] = useState<number[]>([]);
  const [chartColors, setChartColors] = useState<string[]>([]);

  const userType = window.location.pathname.includes("manager")
    ? "manager"
    : "executive";
  const roleLabel = userType === "manager" ? "Managers" : "Executives";

  const data = [
    `Total ${roleLabel}`,
    `Total Active ${roleLabel}`,
    `Total Deleted ${roleLabel}`,
    `Total Inactive ${roleLabel}`,
    `Total New ${roleLabel}`,
  ];

  const getEmptyTotals = () => ({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    suspendedUsers: 0,
    newUsers: 0,
  });

  // Mounting logic for dashboard data
  useEffect(() => {
    if (users.length === 0) return;

    const totals = getEmptyTotals();

    users.forEach((user: any) => {
      const status = getUserStatus(user, sevenDaysAgo);

      totals.totalUsers += 1;

      if (status === "Active") totals.activeUsers += 1;
      else if (status === "Deleted") totals.suspendedUsers += 1;
      else if (status === "Inactive") totals.inactiveUsers += 1;
      else if (status === "New") totals.newUsers += 1;
    });

    setDashboardData(totals);
  }, [users, roleId]);

  // Dashboard chart update
  useEffect(() => {
    if (!dashboardData || Object.keys(dashboardData).length === 0) return;

    const { totalUsers, activeUsers, inactiveUsers, suspendedUsers, newUsers } =
      dashboardData;

    setChartData([
      totalUsers,
      activeUsers,
      inactiveUsers,
      suspendedUsers,
      newUsers,
    ]);

    setChartColors(["#BB86FC", "#5050A5", "#7266C9", "#3B3B81", "#282A68"]);
  }, [dashboardData]);

  return (
    <div className="mb-3">
      <div className="mt-6 flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-3">
        {[
          {
            label: `Total ${roleLabel}`,
            value: dashboardData.totalUsers,
            color: "#BB86FC",
          },
          {
            label: `Total Active ${roleLabel}`,
            value: dashboardData.activeUsers,
            color: "#5050A5",
          },
          {
            label: `Total of Deleted ${roleLabel}`,
            value: dashboardData.suspendedUsers,
            color: "#7266C9",
          },
          {
            label: `Total Inactive ${roleLabel}`,
            value: dashboardData.inactiveUsers,
            color: "#5050A5",
          },
          {
            label: `Total of New ${roleLabel}`,
            value: dashboardData.newUsers,
            color: "#282A68",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="px-4 py-[1.4rem] flex-[1_1_200px] bg-gray-800 rounded-lg"
            style={{ ...cardDashboardStyles }}
          >
            <p className="text-[12px] leading-4 text-gray-400">{item.label}</p>
            {item.value === undefined || item.value === null ? (
              <div className="w-20 h-6 bg-gray-500 animate-pulse rounded-md mt-3" />
            ) : (
              <p className="text-3xl font-bold leading-[1.1]">{item.value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Chart Display */}
      <div className="mt-4">
        <div className="p-4 bg-[#171717] rounded-lg">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-300">
                {userType === "manager"
                  ? "Managers Summary"
                  : "Executive Summary"}
              </p>
              <div>
                <CustomLegend pageType={userType} />
              </div>
            </div>
            <div className="flex flex-col justify-end">
              <Button sx={buttonStyles} variant="contained">
                Export as CSV
              </Button>
            </div>
          </div>
          <div className="h-[270px] w-full min-w-0">
            <BarChart
              xAxis={[
                { label: "USER STATUS", scaleType: "band", data: [...data] },
              ]}
              yAxis={[{ label: "COUNT" }]}
              series={[
                {
                  label: userType === "manager" ? "Managers" : "Executives",
                  data: chartData,
                  color: chartColors.length > 0 ? chartColors[0] : "#BB86FC",
                },
              ]}
              slotProps={{
                legend: { hidden: true },
                bar: {
                  style: {
                    fill: "#2F2F2F !important",
                    borderTopLeftRadius: "5px",
                    borderTopRightRadius: "5px",
                    transition: "fill 0.3s ease-in-out",
                    cursor: "pointer",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
