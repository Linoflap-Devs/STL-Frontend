import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { cardDashboardStyles } from "../../styles/theme";
import { fetchUsers } from "../../utils/api/users";

type User = {
  UserTypeId: number;
  LastLogin?: string;
  LastTokenRefresh?: string;
  DateOfRegistration?: string;
  IsActive?: number;
};

interface DashboardUser {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  suspendedUsers: number;
  newUsers: number;
}

interface UserDashboardPageProps {
  roleId: number;
}

const UserDashboardPage: React.FC<UserDashboardPageProps> = ({ roleId }) => {
  const [dashboardData, setDashboardData] = useState<DashboardUser>({
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
            (acc: DashboardUser, user: User) => {

              if (user.UserTypeId !== roleId) return acc;

              acc.totalUsers += 1;

              // Active if LastLogin or LastTokenRefresh is within 7 days
              const lastLogin = user.LastLogin ? new Date(user.LastLogin) : null;
              const lastTokenRefresh = user.LastTokenRefresh
                ? new Date(user.LastTokenRefresh)
                : null;

              if (
                (lastLogin && lastLogin >= sevenDaysAgo) ||
                (lastTokenRefresh && lastTokenRefresh >= sevenDaysAgo)
              ) {
                acc.activeUsers += 1;
              } else {
                acc.inactiveUsers += 1;
              }

              // Suspended if IsActive = 0
              if (user.IsActive === 0) {
                acc.suspendedUsers += 1;
              }

              // New if DateOfRegistration is within last 7 days
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

  return (
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
        { title: "Total Users", value: dashboardData.totalUsers.toLocaleString() },
        { title: "Active Users", value: dashboardData.activeUsers.toLocaleString() },
        { title: "Inactive Users", value: dashboardData.inactiveUsers.toLocaleString() },
        { title: "Suspended Users", value: dashboardData.suspendedUsers.toLocaleString() },
        { title: "New Users", value: dashboardData.newUsers.toLocaleString() },
      ].map((item, index) => (
        <Box
          key={index}
          sx={{
            ...cardDashboardStyles,
            flex: "1 1 200px",
            minWidth: "200px",
            margin: item.title === "New Users" ? "0" : "0 20px 5px 0",
          }}
        >
          <Typography
            sx={{ fontSize: "12px", lineHeight: 1.5, color: "#D5D5D5" }}
          >
            {item.title}
          </Typography>
          <Typography
            sx={{
              fontSize: "30px",
              fontWeight: 700,
              lineHeight: 1.1,
            }}
          >
            {item.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default UserDashboardPage;
