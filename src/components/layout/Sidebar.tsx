import React, { useState, useEffect } from "react";
import {
  Drawer as MuiDrawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { UserSectionData } from "../../data/AdminSectionData";
import { useRouter } from "next/router";
import { logout } from "../../utils/auth"

import HomeIcon from "@mui/icons-material/Home";
import BusinessIcon from "@mui/icons-material/Business";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import CasinoIcon from '@mui/icons-material/Casino';
import FaxIcon from '@mui/icons-material/Fax';
import PaymentsIcon from '@mui/icons-material/Payments';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 240;

const Sidebar = () => {
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

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const drawerContent = (
    <>
      <Box sx={{ paddingX: "1rem" }}>
        <Box sx={{ marginTop: "1.6rem", justifyContent: "left" }} />

        <Box sx={{ display: "flex", alignItems: "center", }}>
          <Box sx={{ textAlign: "center", marginY: 2, justifyContent: "center" }}>
            <img
              src={UserSectionData.image}
              alt="Logo"
              style={{ maxWidth: "60px", width: "80%" }}
            />
          </Box>
          <Box sx={{ marginLeft: 0 }}>
            <Typography
              sx={{
                marginBottom: 0,
                color: "white",
                fontWeight: "700",
                lineHeight: "24.2px",
                fontSize: 16,
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
              }}
            >
              {UserSectionData.userRole}
            </Typography>
          </Box>
        </Box>

        {/* Divider */}
        <Divider sx={{ backgroundColor: "#D1D5D8", marginBottom: "1rem" }} />

        <Box
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "8px",
            paddingX: "1rem",
            paddingY: "0.6rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            sx={{
              color: "white",
              fontWeight: "400",
              fontSize: 12.4,
            }}
          >
            {formattedDate}
          </Typography>

          <Typography
            sx={{
              color: "white",
              fontWeight: "700",
              fontSize: 25,
            }}
          >
            {formattedTime}
          </Typography>
        </Box>

        {UserSectionData.pages.map((page) => {
          let formattedPage =
            page === "Managers"
              ? "/managers"
              : page === "Executive"
                ? "/executives"
                : page === "Logout"
                  ? "/"
                  : `/${page.toLowerCase()}`;

          // Define icons for each page
          const icon =
            page === "Dashboard" ? <HomeIcon sx={{ mr: 1, fontSize: "1.2rem" }} /> :
              page === "Managers" ? <SupervisorAccountIcon sx={{ mr: 1, fontSize: "1.2rem" }} /> :
                page === "Executive" ? <BusinessIcon sx={{ mr: 1, fontSize: "1.2rem" }} /> :
                  page === "Betting Summary" ? <CasinoIcon sx={{ mr: 1, fontSize: "1.2rem" }} /> :
                    page === "Winning Summary" ? <FaxIcon sx={{ mr: 1, fontSize: "1.2rem" }} /> :
                      page === "Draw Summary" ? <PaymentsIcon sx={{ mr: 1, fontSize: "1.2rem" }} /> :
                        page === "Logout" ? <ExitToAppIcon sx={{ mr: 1, fontSize: "1.2rem" }} /> :
                          <HomeIcon sx={{ mr: 1, fontSize: "1.2rem" }} />;

          return (
            <Box
              key={page}
              component="a"
              href={formattedPage}
              sx={{
                display: "flex",
                textTransform: "capitalize",
                color: currentPath === formattedPage ? "#BB86FC" : "inherit",
                backgroundColor: currentPath === formattedPage ? "#252526" : "transparent",
                paddingLeft: 1,
                paddingRight: 2,
                paddingY: 1,
                borderRadius: "6px",
                marginY: "1rem",
                width: "auto",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {icon}

              <Typography sx={{ fontSize: 14 }}>{page}</Typography>
            </Box>
          );
        })}

       {/* this is on Sidebar.tsx */}
      <Box
        component="a"
        href="/logout"
        onClick={(e) => {
          e.preventDefault(); // Prevent the default anchor behavior (refresh/reload)
          handleLogout(); // Trigger the logout process
        }}
        sx={{
          display: "flex",
          textTransform: "capitalize",
          paddingX: 2,
          paddingY: 0.7,
          borderRadius: "6px",
          width: "auto",
          fontSize: 13,
          fontWeight: 300,
          textDecoration: "none",
          marginTop: "auto",
          position: "absolute",
          bottom: 35,
        }}
      >
        <LogoutIcon />
        <Typography sx={{ ml: 1, fontSize: 14 }}>Logout</Typography>
      </Box>

      </Box>
    </>
  );

  return (
    <>
      {/* Menu Button for Mobile */}
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

      {/* Permanent Drawer (Desktop) */}
      <MuiDrawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        anchor="left"
        sx={{
          width: isMobile ? "auto" : drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#2D2D2D",
            color: "white",
          },
        }}
      >
        {drawerContent}
      </MuiDrawer>
    </>
  );
};

export default Sidebar;