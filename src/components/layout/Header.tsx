import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, IconButton, Typography, Box, Tooltip } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter } from "next/router";
import { useTheme } from "@mui/material/styles";
import { getCurrentUser, logoutUser } from "~/utils/api/auth";

interface HeaderProps {
  handleDrawerToggle: () => void;
  collapsed: boolean;
}

const getUserRole = (userTypeId: number) => {
  switch (userTypeId) {
    case 1:
      return "Super Admin";
    case 2:
      return "Manager";
    case 3:
      return "Manager";
    case 4:
      return "Super Admin";
    case 5:
      return "Admin";
    default:
      return "Unknown Role";
  }
};

const Header: React.FC<HeaderProps> = ({ handleDrawerToggle, collapsed }) => {
  const theme = useTheme();
  const router = useRouter();
  const [user, setUser] = useState<{ firstName: string; lastName: string; userTypeId: number } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser({});
        if (response.success && response.data) {
          setUser({
            firstName: response.data.FirstName,
            lastName: response.data.LastName,
            userTypeId: response.data.UserTypeId,
          });
        } else {
          console.error("Failed to fetch user:", response.message);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: 100,
        width: collapsed ? "100%" : `calc(100% - 240px)`,
        ml: collapsed ? 0 : "240px",
        transition: "width 0.3s ease",
        backgroundColor: "#2D2D2D",
      }}
    >
      <Toolbar sx={{ minHeight: "73px !important" }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          noWrap
          component="div"
          sx={{ fontSize: "12px", flexGrow: 1, color: "white" }}
        >
          Hide Menu
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.6,
          }}
        >
          <Box>
            <Typography
              noWrap
              sx={{
                fontSize: "15px",
                fontWeight: "530",
                flexGrow: 1,
                color: "white",
                lineHeight: "1.1",
              }}
            >
              {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
            </Typography>
            <Typography
              noWrap
              sx={{
                fontSize: "12px",
                flexGrow: 1,
                color: "white",
                textAlign: "right",
              }}
            >
              {user ? getUserRole(user.userTypeId) : ""}
            </Typography>
          </Box>
          <Box
            sx={{ cursor: "pointer", display: "flex" }}
            component="a"
            onClick={(e) => {
              e.preventDefault();
              handleLogout();
            }}
          >
            <Tooltip title={"Logout User"}>
              <IconButton color="inherit" sx={{ backgroundColor: "#D9D9D9" }}>
                <LogoutIcon sx={{ fontSize: "14px", color: "#171717" }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
