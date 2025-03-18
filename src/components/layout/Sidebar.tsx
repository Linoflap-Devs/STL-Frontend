import React, { useState, useEffect } from "react";
import {
  Drawer as MuiDrawer,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import BusinessIcon from "@mui/icons-material/Business";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import CasinoIcon from "@mui/icons-material/Casino";
import FaxIcon from "@mui/icons-material/Fax";
import PaymentsIcon from "@mui/icons-material/Payments";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useRouter } from "next/router";
import { UserSectionData } from "../../data/AdminSectionData";

const drawerWidth = 240;
const collapsedWidth = 0;

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
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

  const renderMenuItem = (page: string) => {
    const formattedPage =
      page === "Managers"
        ? "/managers"
        : page === "Executive"
        ? "/executives"
        : page === "Betting Summary"
        ? "/betting-summary"
        : page === "Logout"
        ? "/"
        : `/${page.toLowerCase()}`;

    // Define icons for each page.
    const icon =
      page === "Dashboard" ? (
        <HomeIcon sx={{ mr: collapsed ? 0 : 1,  }} />
      ) : page === "Managers" ? (
        <SupervisorAccountIcon
          sx={{ mr: collapsed ? 0 : 1,  }}
        />
      ) : page === "Executive" ? (
        <BusinessIcon sx={{ mr: collapsed ? 0 : 1,  }} />
      ) : page === "Betting Summary" ? (
        <CasinoIcon sx={{ mr: collapsed ? 0 : 1,  }} />
      ) : page === "Winning Summary" ? (
        <FaxIcon sx={{ mr: collapsed ? 0 : 1,  }} />
      ) : page === "Draw Summary" ? (
        <PaymentsIcon sx={{ mr: collapsed ? 0 : 1,  }} />
      ) : page === "Logout" ? (
        <ExitToAppIcon sx={{ mr: collapsed ? 0 : 1,  }} />
      ) : (
        <HomeIcon sx={{ mr: collapsed ? 0 : 1,  }} />
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
          my: 1,
          textDecoration: "none",
          transition: "transform 0.20s ease, opacity 0.30s ease",
          opacity: collapsed ? 0 : 1,
          transform: collapsed ? "translateX(-40px)" : "translateX(0)",
          color: currentPath === formattedPage ? "#67ABEB" : "inherit",
        }}
      >
        {!collapsed && icon}
        {!collapsed && (
          <Typography sx={{ fontSize: "14px" }}>{page}</Typography>
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
            minWidth: collapsed ? collapsedWidth : drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#171717",
            color: "white",
            transition: "width 0.40s cubic-bezier(0.4, 0, 0.4, 1)",
            overflowX: "hidden",
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
                <Typography sx={{ color: "white", fontWeight: "700", fontSize: 25, lineHeight: '1.3' }}>
                  {formattedTime}
                </Typography>
                <Typography sx={{ color: "white", fontWeight: "400", fontSize: 13 }}>
                  {formattedDate}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Menu Items */}
          <Box sx={{ flex: 1, }}>
            {UserSectionData.pages.map((page) => renderMenuItem(page))}
          </Box>
        </Box>
      </MuiDrawer>
    </>
  );
};

export default Sidebar;