import React, { useState, useEffect } from "react";
import {
  Drawer as MuiDrawer,
  Box,
  Typography,
  Skeleton
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import BusinessIcon from "@mui/icons-material/Business";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import CasinoIcon from "@mui/icons-material/Casino";
import FaxIcon from "@mui/icons-material/Fax";
import PaymentsIcon from "@mui/icons-material/Payments";
import StoreIcon from '@mui/icons-material/Store';
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useRouter } from "next/router";
import { UserSectionData } from "../../data/AdminSectionData";

const drawerWidth = 240;
const collapsedWidth = 0;

interface SidebarProps {
  handleDrawerToggle: () => void;
  collapsed: boolean;
  mobileOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  handleDrawerToggle,
  mobileOpen,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [dateTime, setDateTime] = useState<Date | null>(null);
  const router = useRouter();
  const currentPath = router.asPath;

  useEffect(() => {
    const updateDateTime = () => setDateTime(new Date());
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!dateTime) return <Skeleton variant="text" width={80} height={40} />;

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

  const renderMenuItem = (page: string) => {
    const formattedPage =
      page === "Managers"
        ? "/managers"
        : page === "Executive"
          ? "/executives"
          : page === "Betting Summary"
            ? "/betting-summary"
            : page === "Draw Summary"
              ? "/draw-summary"
            : page === "Operators"
              ? "/operators"
              : page === "Logout"
                  ? "/"
                  : `/${page.toLowerCase()}`;

    // Define icons for each page.
    const icon =
      page === "Dashboard" ? (
        <HomeIcon sx={{ mr: collapsed ? 0 : 1 }} />
      ) : page === "Managers" ? (
        <SupervisorAccountIcon sx={{ mr: collapsed ? 0 : 1 }} />
      ) : page === "Executive" ? (
        <BusinessIcon sx={{ mr: collapsed ? 0 : 1 }} />
      ) : page === "Betting Summary" ? (
        <CasinoIcon sx={{ mr: collapsed ? 0 : 1 }} />
      ) : page === "Winning Summary" ? (
        <FaxIcon sx={{ mr: collapsed ? 0 : 1 }} />
      ) : page === "Draw Summary" ? (
        <PaymentsIcon sx={{ mr: collapsed ? 0 : 1 }} />
      ) : page === "Operators" ? (
        <StoreIcon sx={{ mr: collapsed ? 0 : 1 }} />
      ) : page === "Logout" ? (
        <ExitToAppIcon sx={{ mr: collapsed ? 0 : 1 }} />
      ) : (
        <HomeIcon sx={{ mr: collapsed ? 0 : 1 }} />
      );

    return (
      <Box
        key={page}
        component="a"
        href={formattedPage}
        sx={{
          display: "flex",
          alignItems: "center",
          px: collapsed ? 0 : 1,
          py: 1.5,
          my: .5,
          textDecoration: "none",
          transition: "transform 0.20s ease, opacity 0.30s ease",
          opacity: collapsed ? 0 : 1,
          transform: collapsed ? "translateX(-40px)" : "translateX(0)",
          color: currentPath === formattedPage ? "#67ABEB" : "inherit",
        }}
      >
        {!collapsed && icon}
        {!collapsed && (
          <Typography sx={{ fontSize: "13px" }}>{page}</Typography>
        )}
      </Box>
    );
  };

  return (
    <>
      <MuiDrawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : !collapsed}
        onClose={handleDrawerToggle}
        anchor="left"
        sx={{
          width: isMobile
            ? mobileOpen
              ? drawerWidth // 240px when open on mobile
              : collapsedWidth // 0px when closed on mobile
            : collapsed
              ? collapsedWidth
              : drawerWidth, // Regular behavior for desktop
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isMobile
              ? mobileOpen
                ? drawerWidth // 240px when open on mobile
                : collapsedWidth // 0px when closed on mobile
              : collapsed
                ? collapsedWidth
                : drawerWidth, // Regular behavior for desktop
            transition: "width 0.40s cubic-bezier(0.4, 0, 0.4, 1)",
            overflowX: "hidden",
            backgroundColor: "#171717",
            color: "white",
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
            mt: isMobile ? 7 : 0,
          }}
        >
          {!collapsed && (
            <Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    textAlign: "center",
                    mt: 3.5,
                    mb: 2,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={UserSectionData.image}
                    alt="Logo"
                    style={{ maxWidth: "100px", width: "100%" }}
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  backgroundColor: "#252526",
                  borderRadius: "8px",
                  px: "1rem",
                  py: "0.6rem",
                  display: "flex",
                  flexDirection: "column",
                  mb: "0.5rem",
                  transition: "opacity 0.3s ease",
                }}
              >
                <Typography
                  sx={{
                    color: "white",
                    fontWeight: "700",
                    fontSize: 25,
                    lineHeight: "1.3",
                  }}
                >
                  {formattedTime}
                </Typography>
                <Typography
                  sx={{ color: "white", fontWeight: "400", fontSize: 13 }}
                >
                  {formattedDate}
                </Typography>
              </Box>
            </Box>
          )}
          {/* Menu Items */}
          <Box sx={{ flex: 1 }}>
            {UserSectionData.pages.map((page) => renderMenuItem(page))}
          </Box>
        </Box>
      </MuiDrawer>
    </>
  );
};

export default Sidebar;