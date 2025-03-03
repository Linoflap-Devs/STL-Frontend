import React from "react";
import { AppBar, Toolbar, IconButton, Typography, Box, Tooltip } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { useTheme } from "@mui/material/styles";
import axiosInstance from "../../utils/axiosInstance";

interface HeaderProps {
  handleDrawerToggle: () => void;
  collapsed: boolean;
}

const Header: React.FC<HeaderProps> = ({ handleDrawerToggle, collapsed }) => {
  const theme = useTheme();

  const handleLogout = async () => {
    try {
      await axiosInstance.delete("/auth/logout");
      window.location.href = "/auth/login";
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
              Wendell Ravago
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
              Admin
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
