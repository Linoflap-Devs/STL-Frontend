import React, { useState, useEffect } from "react";
import {
  Drawer as MuiDrawer,
  IconButton,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HomeIcon from "@mui/icons-material/Home";
import BusinessIcon from "@mui/icons-material/Business";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import CasinoIcon from "@mui/icons-material/Casino";
import FaxIcon from "@mui/icons-material/Fax";
import PaymentsIcon from "@mui/icons-material/Payments";
import LogoutIcon from "@mui/icons-material/Logout";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useRouter } from "next/router";
import axiosInstance from "../../utils/axiosInstance";
import { UserSectionData } from "../../data/AdminSectionData";

const drawerWidth = 240;
const collapsedWidth = 0; // Fully collapsed sidebar will be 0px wide

const Sidebar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [dateTime, setDateTime] = useState<Date | null>(null);

  const router = useRouter();
  const currentPath = router.asPath;

  useEffect(() => {
    const updateDateTime = () => setDateTime(new Date());
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!dateTime) return <p>Loading...</p>;

  const formattedDate = dateTime.toLocaleDateString("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = dateTime.toLocaleTimeString("en-PH", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.delete("/auth/logout");
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Render a single menu item based on mode (collapsed/full)
  const renderMenuItem = (page: string) => {
    // Map pages to routes as per your logic.
    const formattedPage =
      page === "Managers"
        ? "/managers"
        : page === "Executive"
        ? "/executives"
        : page === "Betting Summary"
        ? "/betting-summary"
        : page === "Draw Summary"
        ? "/draw-summary"
        : page === "Logout"
        ? "/"
        : `/${page.toLowerCase()}`;

    // Define icons for each page.
    const icon =
      page === "Dashboard" ? (
        <HomeIcon sx={{ mr: collapsed ? 0 : 1, fontSize: "1.2rem" }} />
      ) : page === "Managers" ? (
        <SupervisorAccountIcon
          sx={{ mr: collapsed ? 0 : 1, fontSize: "1.2rem" }}
        />
      ) : page === "Executive" ? (
        <BusinessIcon sx={{ mr: collapsed ? 0 : 1, fontSize: "1.2rem" }} />
      ) : page === "Betting Summary" ? (
        <CasinoIcon sx={{ mr: collapsed ? 0 : 1, fontSize: "1.2rem" }} />
      ) : page === "Winning Summary" ? (
        <FaxIcon sx={{ mr: collapsed ? 0 : 1, fontSize: "1.2rem" }} />
      ) : page === "Draw Summary" ? (
        <PaymentsIcon sx={{ mr: collapsed ? 0 : 1, fontSize: "1.2rem" }} />
      ) : page === "Logout" ? (
        <ExitToAppIcon sx={{ mr: collapsed ? 0 : 1, fontSize: "1.2rem" }} />
      ) : (
        <HomeIcon sx={{ mr: collapsed ? 0 : 1, fontSize: "1.2rem" }} />
      );

    return (
      <Box
        key={page}
        component="a"
        href={formattedPage}
        sx={{
          display: "flex",
          alignItems: "center",
          textTransform: "capitalize",
          color: currentPath === formattedPage ? "#BB86FC" : "inherit",
          px: collapsed ? 0 : 1,
          py: 1.5,
          borderRadius: "6px",
          my: 1,
          textDecoration: "none",
        }}
      >
        {React.cloneElement(icon, {
          sx: {
            fontSize: collapsed ? "1.4rem" : "1.3rem",
            mr: collapsed ? 0 : 1,
            ml: collapsed ? 0.5 : 0,
            transition: "all 0.3s ease",
          },
        })}

        {!collapsed && (
          <Typography
            sx={{
              transition: "opacity 0.3s ease",
              fontSize: 14,
              fontWeight: currentPath === formattedPage ? "700" : "300",
            }}
          >
            {page}
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            color: "white",
            backgroundColor: "rgba(0,0,0,0.2)",
            "&:hover": { backgroundColor: "rgba(0,0,0,0.3)" },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Sidebar Drawer */}
      <MuiDrawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : !collapsed}
        onClose={handleDrawerToggle}
        anchor="left"
        sx={{
          width: collapsed ? collapsedWidth : drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: collapsed ? collapsedWidth : drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#2D2D2D",
            color: "white",
            transition: "width 0.3s ease",
            overflow: "hidden",
          },
        }}
      >
        <Box
          sx={{
            p: "1rem",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            position: "relative",
          }}
        >
          {/* Top Section: Logo, User Info & Divider */}
          {!collapsed && (
            <Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    textAlign: "center",
                    my: 2,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={UserSectionData.image}
                    alt="Logo"
                    style={{ maxWidth: "60px", width: "80%" }}
                  />
                </Box>
                <Box sx={{ ml: 1 }}>
                  <Typography
                    sx={{
                      mb: 0,
                      color: "#C493FD",
                      fontWeight: "700",
                      lineHeight: "24.2px",
                      fontSize: 16,
                      transition: "opacity 0.3s ease",
                    }}
                  >
                    {UserSectionData.titleHeader}
                  </Typography>
                  <Typography
                    sx={{
                      color: "white",
                      fontWeight: "200",
                      lineHeight: "15px",
                      fontSize: 12.5,
                      transition: "opacity 0.3s ease",
                    }}
                  >
                    {UserSectionData.userRole}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ backgroundColor: "#D1D5D8", mb: "1rem" }} />

              <Box
                sx={{
                  backgroundColor: "#252526",
                  borderRadius: "8px",
                  px: "1rem",
                  py: "0.6rem",
                  display: "flex",
                  flexDirection: "column",
                  mb: "1rem",
                  transition: "opacity 0.3s ease",
                }}
              >
                <Typography sx={{ color: "white", fontWeight: "400", fontSize: 12.4 }}>
                  {formattedDate}
                </Typography>
                <Typography sx={{ color: "white", fontWeight: "700", fontSize: 25 }}>
                  {formattedTime}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Menu Items */}
          <Box sx={{ flex: 1 }}>
            {UserSectionData.pages.map((page) => renderMenuItem(page))}
          </Box>

          {/* Logout Button */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              textTransform: "capitalize",
              px: collapsed ? 0 : 2,
              py: 1,
              borderRadius: "6px",
              textDecoration: "none",
              mb: 1
            }}
          >
            <Box
              sx={{ cursor: 'pointer', display: 'flex', }}
              component="a"             
              onClick={(e) => {
              e.preventDefault();
              handleLogout();
            }} > 
            <LogoutIcon sx={{ fontSize: "1.2rem" }} />
            {!collapsed && (
              <Typography sx={{ ml: 1, fontSize: 14, fontWeight: 700, }}>
                Logout
              </Typography>
            )}
            </Box>
          </Box>
        </Box>
      </MuiDrawer>

      {/* Toggle Button positioned at the bottom (outside of the Drawer) */}
      <IconButton
        onClick={toggleSidebar}
        sx={{
          position: "fixed",
          bottom: 20,
          left: collapsed ? 16 : drawerWidth - 58,
          zIndex: 1300,
          backgroundColor: "#383838",
          "&:hover": { backgroundColor: "#383838" },
          transition: "left 0.3s ease",
          color: "white",
        }}
      >
        {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </IconButton>
    </>
  );
};

export default Sidebar;