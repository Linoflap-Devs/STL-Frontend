import React, { useState, useEffect } from "react";
import { Box, Typography, Stack, Button } from "@mui/material";
import { buttonStyles, cardDashboardStyles } from "../../styles/theme";
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
  <Stack direction="row" spacing={2} justifyContent="flex-start" sx={{ mr: 2 }}>
    {getLegendItems(pageType).map((item) => (
      <Box key={item.label} sx={{ display: "flex", alignItems: "left" }}>
        <Box
          sx={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            backgroundColor: item.color,
            mr: 1,
            fontSize: "10px !important",
          }}
        />
        <Typography sx={{ fontSize: "14px" }} color="white">
          {item.label}
        </Typography>
      </Box>
    ))}
  </Stack>
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
  
  const userType = window.location.pathname.includes("manager") ? "manager" : "executive";
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
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          mt: 0.5,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
          <Box
            key={index}
            sx={{
              ...cardDashboardStyles,
              flex: "1 1 200px",
              minWidth: "200px",
              margin: item.label.includes("Total Managers") || item.label.includes("Total Executives")
                ? "0px"
                : "5px 10px",
            }}
          >
            <Typography
              sx={{ fontSize: "12px", lineHeight: 1.5, color: "#D5D5D5" }}
            >
              {item.label}
            </Typography>
            <Typography
              sx={{ fontSize: "30px", fontWeight: 700, lineHeight: 1.1 }}
            >
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Chart Display */}
      <Box sx={{ mt: 1 }}>
        <Box
          sx={{ padding: 2, backgroundColor: "#171717", borderRadius: "10px" }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <Typography color="#B3B3B3">
                {userType === "manager"
                  ? "Managers Summary"
                  : "Executive Summary"}
              </Typography>
              <Box>
                <CustomLegend pageType={userType} />
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
              }}
            >
              <Button sx={buttonStyles} variant="contained">
                Export as CSV
              </Button>
            </Box>
          </Box>
          <Box sx={{ height: 270, width: "100%", minWidth: 0 }}>
            <BarChart
              xAxis={[
                {
                  label: "USER STATUS",
                  scaleType: "band",
                  data: [...data],
                },
              ]}
              yAxis={[
                {
                  label: "COUNT",
                },
              ]}
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
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                    transition: "fill 0.3s ease-in-out",
                    cursor: "pointer",
                  },
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UserDashboardPage;
