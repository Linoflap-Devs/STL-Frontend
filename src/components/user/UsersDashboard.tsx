import React, { useState, useEffect } from "react";
import { Box, Typography, Stack, Divider, Button } from "@mui/material";
import { cardDashboardStyles } from "../../styles/theme";
import { fetchUsers } from "../../utils/api/users";
import { BarChart } from "@mui/x-charts/BarChart";

const getLegendItems = (pageType: string) => [
  { color: "#BB86FC", label: pageType === "manager" ? "Total Managers" : "Total Executives" },
  { color: "#5050A5", label: pageType === "manager" ? "Active Managers" : "Active Executives" },
  { color: "#7266C9", label: pageType === "manager" ? "Inactive Managers" : "Inactive Executives" },
  { color: "#3B3B81", label: pageType === "manager" ? "Suspended Managers" : "Suspended Executives" },
  { color: "#282A68", label: pageType === "manager" ? "New Managers" : "New Executives" },
];

const CustomLegend = ({ pageType }: { pageType: string }) => (
  <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2, mr: 2 }}>
    {getLegendItems(pageType).map((item) => (
      <Box key={item.label} sx={{ display: "flex", alignItems: "center" }}>
        <Box
          sx={{
            fontSize: "12px",
            width: 16,
            height: 16,
            borderRadius: "50%",
            backgroundColor: item.color,
            mr: 1.5,
          }}
        />
        <Typography color="white">{item.label}</Typography>
      </Box>
    ))}
  </Stack>
);

interface UserDashboardPageProps {
  roleId: number;
}

const UserDashboardPage: React.FC<UserDashboardPageProps> = ({ roleId }) => {
  const pageType = window.location.pathname.includes('manager') ? 'manager' : 'executive';
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    suspendedUsers: 0,
    newUsers: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchUsers({ roleId });

        if (response.success) {
          const today = new Date();
          const sevenDaysAgo = new Date(today);
          sevenDaysAgo.setDate(today.getDate() - 7);

          const totals = response.data.reduce(
            (acc: { totalUsers: number; activeUsers: number; inactiveUsers: number; suspendedUsers: number; newUsers: number; }, user: { UserTypeId: number; LastLogin: string | number | Date; LastTokenRefresh: string | number | Date; IsActive: number; DateOfRegistration: string | number | Date; }) => {
              if (user.UserTypeId !== roleId) return acc;

              acc.totalUsers += 1;

              const lastLogin = user.LastLogin ? new Date(user.LastLogin) : null;
              const lastTokenRefresh = user.LastTokenRefresh ? new Date(user.LastTokenRefresh) : null;

              if (
                (lastLogin && lastLogin >= sevenDaysAgo) ||
                (lastTokenRefresh && lastTokenRefresh >= sevenDaysAgo)
              ) {
                acc.activeUsers += 1;
              } else {
                acc.inactiveUsers += 1;
              }

              if (user.IsActive === 0) acc.suspendedUsers += 1;

              const registrationDate = user.DateOfRegistration
                ? new Date(user.DateOfRegistration)
                : null;
              if (registrationDate && registrationDate >= sevenDaysAgo) {
                acc.newUsers += 1;
              }

              return acc;
            },
            {
              totalUsers: 0,
              activeUsers: 0,
              inactiveUsers: 0,
              suspendedUsers: 0,
              newUsers: 0,
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

    fetchData();
  }, [roleId]);

  const chartData = [
    dashboardData.totalUsers,
    dashboardData.activeUsers,
    dashboardData.inactiveUsers,
    dashboardData.suspendedUsers,
    dashboardData.newUsers,
  ];

  return (
    <Box sx={{ mb: 3, }}>
      {/* Cards Display */}
      <Box
        sx={{
          mt: 0.5,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {getLegendItems(pageType).map((item, index) => (
          <Box
            key={index}
            sx={{
              ...cardDashboardStyles,
              flex: "1 1 200px",
              minWidth: "200px",
              margin:
                item.label === (pageType === "manager" ? "New Managers" : "New Executives")
                  ? "0"
                  : "0 20px 5px 0",
            }}
          >
            <Typography sx={{ fontSize: "12px", lineHeight: 1.5, color: "#D5D5D5" }}>
              {item.label}
            </Typography>
            <Typography sx={{ fontSize: "30px", fontWeight: 700, lineHeight: 1.1 }}>
              {chartData[index].toLocaleString()}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Chart Display */}
      <Box sx={{ mt: 1 }}>
        <Box
          sx={{
            paddingTop: 5,
            paddingLeft: 2,
            backgroundColor: "#171717",
            borderRadius: "10px",
          }}
        >
          <Box sx={{ paddingX: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Box>
                <Typography color="#B3B3B3" sx={{ fontSize: "16px", lineHeight: 0 }}>
                  {pageType === 'manager' ? 'Managers Summary' : 'Executive Summary'}
                </Typography>
                <CustomLegend pageType={pageType} />
              </Box>
              <Button
                sx={{
                  fontSize: '12px',
                  color: '#3F3F3F',
                  textTransform: 'none',
                  backgroundColor: "#67ABEB",
                  mb: 0.7,
                  paddingX: 4,
                  paddingY: 0.9,
                  mr: 2,
                  width: 'auto', "&:hover": {
                    backgroundColor: '',
                  },
                }}
                variant="contained"
              //onClick={handleClick}
              >
                Export as CSV
              </Button>
            </Box>
          </Box>
          <Box sx={{ height: 270, width: "100%", flexGrow: 0, minWidth: 0 }}>
            <BarChart
              borderRadius={20}
              grid={{ horizontal: true }}
              xAxis={[{ scaleType: "band", data: getLegendItems(pageType).map((item) => item.label) }]}
              yAxis={[{ label: "Number of Users" }]}
              series={[
                {
                  data: chartData,
                  label: "Users",
                  color: "#BB86FC",
                },
              ]}
              slotProps={{
                legend: { hidden: true },
                bar: {
                  style: {
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
