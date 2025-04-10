import React, { useState, useEffect } from "react";
import { Box, Typography, Stack, Button, Tooltip } from "@mui/material";
import { cardDashboardStyles } from "../../styles/theme";
import { fetchUsers } from "../../utils/api/users";
import { BarChart } from "@mui/x-charts/BarChart";

interface UserDashboardPageProps {
  roleId: number;
}

const getLegendItems = (pageType: string) => [
  { color: "#BB86FC", label: pageType === "manager" ? "Total Managers" : "Total Executives" },
  { color: "#5050A5", label: pageType === "manager" ? "Total Active Managers" : "Total Active Executives" },
  { color: "#7266C9", label: pageType === "manager" ? "Total of Inactive Managers" : "Total of Inactive Executives" },
  { color: "#3B3B81", label: pageType === "manager" ? "Total of Deleted Managers" : "Total of Deleted Executives" },
  { color: "#282A68", label: pageType === "manager" ? "Total of New Managers" : "Total of New Executives" },
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
            fontSize: '10px !important',
          }}
        />
        <Typography sx={{ fontSize: '14px !important' }} color="white">{item.label}</Typography>
      </Box>
    ))}
  </Stack>
);

const UserDashboardPage: React.FC<UserDashboardPageProps> = ({ roleId }) => {
  const pageType = window.location.pathname.includes("manager") ? "manager" : "executive";
  const [dashboardData, setDashboardData] = useState<Record<string, any>>({});
  const [chartData, setChartData] = useState<number[]>([]);
  const [chartColors, setChartColors] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchUsers({ roleId });

        if (response.success) {
          const today = new Date();
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(today.getDate() - 7);

          console.log("Seven days ago:", sevenDaysAgo.toISOString());

          const totals = response.data.reduce((acc: Record<string, any>, user: any, index: number) => {
            //console.log(`Processing user ${index + 1}:`, user);

            if (user.UserTypeId !== roleId) {
              //console.log(`Skipping user ${index + 1}, UserTypeId does not match roleId.`);
              return acc;
            }

            acc.totalUsers += 1;

            const lastLogin = user.LastLogin ? new Date(user.LastLogin) : null;
            const lastTokenRefresh = user.LastTokenRefresh ? new Date(user.LastTokenRefresh) : null;
            const userStatusId = user.UserStatusId;

            // Active Manager
            const isActive = (lastLogin && lastLogin >= sevenDaysAgo) || (lastTokenRefresh && lastTokenRefresh >= sevenDaysAgo);
            if (isActive) {
              acc.activeUsers += 1;
              console.log(`User ${index + 1} marked as active.`);
            }

            // Inactive Manager
            const isInactive = (
              (lastLogin && lastLogin < sevenDaysAgo) &&
              (lastTokenRefresh && lastTokenRefresh < sevenDaysAgo)) || userStatusId === 2;

            if (isInactive) {
              acc.inactiveUsers += 1;
              console.log(`User ${index + 1} marked as inactive.`);
            }

            // Suspended Manager
            if (userStatusId === 3) {
              acc.suspendedUsers += 1;
              console.log(`User ${index + 1} is suspended.`);
            }

            // New Manager
            const registrationDate = user.DateOfRegistration ? new Date(user.DateOfRegistration) : null;
            if (registrationDate && registrationDate >= sevenDaysAgo) {
              acc.newUsers += 1;
              console.log(`User ${index + 1} is a new user.`);
            }

            return acc;
          }, {
            totalUsers: 0,
            activeUsers: 0,
            inactiveUsers: 0,
            suspendedUsers: 0,
            newUsers: 0,
          });

          console.log("Final Processed Totals:", totals);
          setDashboardData(totals);
        } else {
          console.error("API Request Failed:", response.message);
        }
      } catch (error) {
        console.error("Error Fetching Data:", error);
      }
    };

    fetchData();
  }, [roleId]);

  const getSummaryTotals = () => {
    return {
      totalUsers: dashboardData.totalUsers || 0,
      activeUsers: dashboardData.activeUsers || 0,
      inactiveUsers: dashboardData.inactiveUsers || 0,
      suspendedUsers: dashboardData.suspendedUsers || 0,
      newUsers: dashboardData.newUsers || 0,
    };
  };

  const summaryTotals = getSummaryTotals();

  // dashboard charts
  useEffect(() => {
    if (!dashboardData || Object.keys(dashboardData).length === 0) return;

    const totals = getSummaryTotals();

    const chartData = [
      totals.totalUsers,
      totals.activeUsers,
      totals.inactiveUsers,
      totals.suspendedUsers,
      totals.newUsers,
    ];

    // Define corresponding colors for each category
    const colors = ["#BB86FC", "#5050A5", "#7266C9", "#3B3B81", "#282A68"];

    // Update state with chart data and colors
    setChartData(chartData);
    setChartColors(colors);

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
          { label: "Total Managers", value: summaryTotals.totalUsers, color: "#BB86FC" },
          { label: "Total Active Managers", value: summaryTotals.activeUsers, color: "#5050A5" },
          { label: "Total of Deleted Managers", value: summaryTotals.inactiveUsers, color: "#7266C9" },
          { label: "Total of Inactive Managers", value: summaryTotals.inactiveUsers, color: "#7266C9" },
          { label: "Total of New Managers", value: summaryTotals.newUsers, color: "#282A68" },
        ].map((item, index) => (
          <Box
            key={index}
            sx={{
              ...cardDashboardStyles,
              flex: "1 1 200px",
              minWidth: "200px",
              margin: item.label.includes("New") ? "0" : "0 20px 5px 0",
            }}
          >
            <Typography sx={{ fontSize: "12px", lineHeight: 1.5, color: "#D5D5D5" }}>
              {item.label}
            </Typography>
            <Typography sx={{ fontSize: "30px", fontWeight: 700, lineHeight: 1.1 }}>
              {item.value.toLocaleString()}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Chart Display */}
      <Box sx={{ mt: 1 }}>
        <Box sx={{ padding: 2, backgroundColor: "#171717", borderRadius: "10px" }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Typography color="#B3B3B3">
                {pageType === "manager" ? "Managers Summary" : "Executive Summary"}
              </Typography>
              <Box>
                <CustomLegend pageType={pageType} />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <Button
                sx={{
                  fontSize: "12px",
                  textTransform: "none",
                  backgroundColor: "#67ABEB",
                  paddingX: 4,
                  paddingY: 0.9,
                  "&:hover": { backgroundColor: "#559CD1" },
                }}
                variant="contained"
              >
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
                  data: ["Total", "Active", "Inactive", "Suspended", "New"],
                },
              ]}
              yAxis={[
                {
                  label: "COUNT",
                },
              ]}
              series={[
                {
                  label: pageType === "manager" ? "Managers" : "Executives",
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