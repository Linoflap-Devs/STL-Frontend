import React, { useState, useEffect } from "react";
import { Box, Typography, Stack, Button } from "@mui/material";
import { cardDashboardStyles } from "../../styles/theme";
import { fetchUsers } from "../../utils/api/users";
import { BarChart } from "@mui/x-charts/BarChart";

interface UserDashboardPageProps {
  roleId: number;
}

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

const getLegendItems = (pageType: string) => [
  { color: "#BB86FC", label: pageType === "manager" ? "Total Managers" : "Total Executives" },
  { color: "#5050A5", label: pageType === "manager" ? "Active Managers" : "Active Executives" },
  { color: "#7266C9", label: pageType === "manager" ? "Inactive Managers" : "Inactive Executives" },
  { color: "#3B3B81", label: pageType === "manager" ? "Suspended Managers" : "Suspended Executives" },
  { color: "#282A68", label: pageType === "manager" ? "New Managers" : "New Executives" },
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
            mr: 1.5,
            fontSize: '12px !important',
          }}
        />
        <Typography color="white">{item.label}</Typography>
      </Box>
    ))}
  </Stack>
);

const UserDashboardPage: React.FC<UserDashboardPageProps> = ({ roleId }) => {
  const pageType = window.location.pathname.includes("manager") ? "manager" : "executive";
  const [dashboardData, setDashboardData] = useState<Record<string, any>>({});
  const [chartData, setChartData] = useState<{ label: string; color: string; data: number[] }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching users with roleId:", roleId);

        const response = await fetchUsers({ roleId });

        console.log("API Response:", response);

        if (response.success) {
          const today = new Date();
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(today.getDate() - 7);

          console.log("Seven days ago:", sevenDaysAgo.toISOString());

          const totals = response.data.reduce((acc: Record<string, any>, user: any, index: number) => {
            console.log(`Processing user ${index + 1}:`, user);

            if (user.UserTypeId !== roleId) {
              console.log(`Skipping user ${index + 1}, UserTypeId does not match roleId.`);
              return acc;
            }

            const region = user.Region || "Unknown";
            if (!acc[region]) {
              acc[region] = {
                totalUsers: 0,
                activeUsers: 0,
                inactiveUsers: 0,
                suspendedUsers: 0,
                newUsers: 0,
              };
            }

            acc[region].totalUsers += 1;

            const lastLogin = user.LastLogin ? new Date(user.LastLogin) : null;
            const lastTokenRefresh = user.LastTokenRefresh ? new Date(user.LastTokenRefresh) : null;

            if ((lastLogin && lastLogin >= sevenDaysAgo) || (lastTokenRefresh && lastTokenRefresh >= sevenDaysAgo)) {
              acc[region].activeUsers += 1;
              console.log(`User ${index + 1} marked as active.`);
            } else {
              acc[region].inactiveUsers += 1;
              console.log(`User ${index + 1} marked as inactive.`);
            }

            if (user.IsActive === 0) {
              acc[region].suspendedUsers += 1;
              console.log(`User ${index + 1} is suspended.`);
            }

            const registrationDate = user.DateOfRegistration ? new Date(user.DateOfRegistration) : null;
            if (registrationDate && registrationDate >= sevenDaysAgo) {
              acc[region].newUsers += 1;
              console.log(`User ${index + 1} is a new user.`);
            }

            return acc;
          }, {});

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

  useEffect(() => {
    if (!dashboardData || Object.keys(dashboardData).length === 0) return;

    const newChartData = [
      {
        label: "Total Managers",
        color: "#BB86FC",
        data: regions.map((region) => {
          const mappedRegion = regionMap[region];
          const value = dashboardData[mappedRegion]?.totalUsers || 0;
          console.log(`Region: ${region} (${mappedRegion}), Total Managers: ${value}`);
          return value;
        }),
      },
      {
        label: "Active Managers",
        color: "#5050A5",
        data: regions.map((region) => {
          const mappedRegion = regionMap[region];
          const value = dashboardData[mappedRegion]?.activeUsers || 0;
          console.log(`Region: ${region} (${mappedRegion}), Active Managers: ${value}`);
          return value;
        }),
      },
      {
        label: "Inactive Managers",
        color: "#7266C9",
        data: regions.map((region) => {
          const mappedRegion = regionMap[region];
          const value = dashboardData[mappedRegion]?.inactiveUsers || 0;
          console.log(`Region: ${region} (${mappedRegion}), Inactive Managers: ${value}`);
          return value;
        }),
      },
      {
        label: "Suspended Managers",
        color: "#3B3B81",
        data: regions.map((region) => {
          const mappedRegion = regionMap[region];
          const value = dashboardData[mappedRegion]?.suspendedUsers || 0;
          console.log(`Region: ${region} (${mappedRegion}), Suspended Managers: ${value}`);
          return value;
        }),
      },
      {
        label: "New Managers",
        color: "#282A68",
        data: regions.map((region) => {
          const mappedRegion = regionMap[region];
          const value = dashboardData[mappedRegion]?.newUsers || 0;
          console.log(`Region: ${region} (${mappedRegion}), New Managers: ${value}`);
          return value;
        }),
      },
    ];

    console.log("Updated Chart Data:", newChartData);
    setChartData(newChartData);
  }, [dashboardData]);

  const getSummaryTotals = () => {
    return Object.values(dashboardData).reduce(
      (acc, region) => {
        acc.totalUsers += region.totalUsers || 0;
        acc.activeUsers += region.activeUsers || 0;
        acc.inactiveUsers += region.inactiveUsers || 0;
        acc.suspendedUsers += region.suspendedUsers || 0;
        acc.newUsers += region.newUsers || 0;
        return acc;
      },
      { totalUsers: 0, activeUsers: 0, inactiveUsers: 0, suspendedUsers: 0, newUsers: 0 }
    );
  };

  const summaryTotals = getSummaryTotals();

  return (
    <Box sx={{ mb: 3 }}>
      {/* Summary Cards */}
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
          { label: "Active Managers", value: summaryTotals.activeUsers, color: "#5050A5" },
          { label: "Inactive Managers", value: summaryTotals.inactiveUsers, color: "#7266C9" },
          { label: "Suspended Managers", value: summaryTotals.suspendedUsers, color: "#3B3B81" },
          { label: "New Managers", value: summaryTotals.newUsers, color: "#282A68" },
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <Box>
              <Typography color="#B3B3B3" sx={{ fontSize: "16px" }}>
                {pageType === "manager" ? "Managers Summary" : "Executive Summary"}
              </Typography>
              <Box>
                <CustomLegend pageType={pageType} />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                sx={{
                  fontSize: "12px",
                  color: "#3F3F3F",
                  textTransform: "none",
                  backgroundColor: "#67ABEB",
                  paddingX: 4,
                  paddingY: 0.9,
                  //mr: 2,
                  mb: 1,
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
              xAxis={[{ scaleType: "band", data: regions }]}
              yAxis={[{ label: "Number of Users" }]}
              series={chartData.map(({ label, color, data }) => ({
                data,
                label,
                color,
              }))}
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