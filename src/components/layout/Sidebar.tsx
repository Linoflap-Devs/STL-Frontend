import React, { useState, useEffect } from "react";
import {
  Drawer as MuiDrawer,
  IconButton,
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

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
import { useRouter } from "next/router";
import axiosInstance from "../../utils/axiosInstance";
import { UserSectionData } from "../../data/AdminSectionData";
// Detect and Respond to changes in browser's viewport size based on CSS Media Query.
import useMediaQuery from "@mui/material/useMediaQuery";
const drawerWidth = 240;
const collapsedWidth = 0; // Fully collapsed sidebar will be 0px wide

import { useSideBarStore, gameType } from "../../../store/useSideBarStore";

interface SubmenuItem {
  name: string;
  path: string;
}
const BETTING_SUBMENUS: SubmenuItem[] = [
  { name: "Dashboard", path: "/betting-summary/dashboard" },
  { name: "STL Pares", path: "/betting-summary/stl-pares" },
  { name: "STL Swer2", path: "/betting-summary/stl-swer2" },
  { name: "STL Swer3", path: "/betting-summary/stl-swer3" },
  { name: "STL Swer4", path: "/betting-summary/stl-swer4" },
];
const WINNING_SUBMENUS: SubmenuItem[] = [
  { name: "Dashboard", path: "/winning-summary/dashboard" },
  { name: "STL Pares", path: "/winning-summary/stl-pares" },
  { name: "STL Swer2", path: "/winning-summary/stl-swer2" },
  { name: "STL Swer3", path: "/winning-summary/stl-swer3" },
  { name: "STL Swer4", path: "/winning-summary/stl-swer4" },
];

const Sidebar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dateTime, setDateTime] = useState<Date | null>(null);
  // Default Betting Summary Submenu is open.
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  // Whole Sidebar
  const [collapsed, setCollapsed] = useState(false);

  const router = useRouter();
  // asPath - current URL path(pathname&query/search params)
  const currentPath = router.asPath;

  // Handle Logout
  const handleLogout = async () => {
    try {
      await axiosInstance.delete("/auth/logout", {
        withCredentials: true, // Ensures auth cookie is sent to invalidate session
      });
      window.location.href = "/auth/login";
    } catch (error: any) {
      if (error.response) {
        console.error(
          "Logout Failed: ",
          error.response.data.message || "Unknown Error"
        );
        // showToast("Logout Failed, Please try again.")
      } else {
        console.error("Network error during logout:", error.message);
      }
    }
  };

  // Zustand store
  const { 
    SideBarActiveGameType, setSideBarActiveGameType 
  } = useSideBarStore();

  const handleListItemClick = (subItem: SubmenuItem) => {
    setSideBarActiveGameType(subItem.name as gameType); // Update activeGameType in Zustand store
    router.push(subItem.path); // Navigate to the selected path
  };

  // Update Date and Time
  useEffect(() => {
    const updateDateTime = () => setDateTime(new Date());
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedDate = dateTime
    ? dateTime.toLocaleDateString("en-PH", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "N/A"; // Fallback value

  const formattedTime = dateTime
    ? dateTime.toLocaleTimeString("en-PH", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
    : "N/A";

  useEffect(() => {
    if (router.pathname.startsWith("/betting-summary")) {
      setOpenSubmenu("Betting Summary");
      console.log("Navigating to:", router.pathname)
      setSideBarActiveGameType("Dashboard");
      router.push("/betting-summary/dashboard");
    }
  }, [router.pathname, setSideBarActiveGameType]);

  if (!dateTime) return <p>Loading...</p>;

  // Toggle Handlers
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Render a single menu item based on mode (collapsed/full)
  // 'page' was from UserSectionData.pages.map
  const renderMenuItem = (page: string) => {
      // Map pages to routes as per your logic.
      const formattedPage =
        page === "Managers"
          ? "/managers"
          : page === "Executive"
            ? "/executives"
            : page === "Winning Summary"
              ? "/winning-summary"
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

      // Special handling for Betting Summary with submenu
      if (page === "Betting Summary") {
        return (
          <Box key={page}>
            <ListItemButton
              onClick={() => {
                if (collapsed) setCollapsed(false);
                // OpenSubmenu === Betting Summary
                setOpenSubmenu(openSubmenu === page ? null : page);
                if (!currentPath.startsWith("/betting-summary")) {
                  console.log("Navigating to: dashboard" )
                  router.push("/betting-summary/dashboard");
                }
              }}
              sx={{
                px: collapsed ? 0 : 1,
                py: 1.5,
                borderRadius: "6px",
                my: 1,
                color: currentPath.startsWith("/betting-summary")
                  ? "#BB86FC"
                  : "inherit",
              }}
            >
              <CasinoIcon
                sx={{
                  fontSize: collapsed ? "1.4rem" : "1.3rem",
                  mr: collapsed ? 0 : 1,
                  ml: collapsed ? 0.5 : 0,
                }}
              />
              {!collapsed && (
                <>
                  <Typography
                    sx={{
                      flexGrow: 1,
                      fontSize: 14,
                      fontWeight: currentPath.startsWith("/betting-summary")
                        ? "700"
                        : "300",
                    }}
                  >
                    {page}
                  </Typography>
                  {openSubmenu === page ? <ExpandLess /> : <ExpandMore />}
                </>
              )}
            </ListItemButton>

            <Collapse
              in={!collapsed && openSubmenu === page}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                {BETTING_SUBMENUS.map((subItem) => (
                  <ListItem key={subItem.path} disablePadding sx={{ pl: 4 }}>
                    <ListItemButton
                      component="a"
                      href={subItem.path}
                      selected={SideBarActiveGameType === subItem.name}
                      onClick={() => handleListItemClick(subItem)}
                      sx={{
                        py: 1,
                        borderRadius: "6px",
                        "&.Mui-selected": {
                          backgroundColor: "rgba(187, 134, 252, 0.16)",
                          color: "#BB86FC",
                        },
                      }}
                    >
                      <ListItemText
                        primary={subItem.name}
                        primaryTypographyProps={{
                          fontSize: 14,
                          fontWeight:
                            currentPath === `/betting-summary/${subItem.path}`
                              ? "700"
                              : "300",
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </Box>
      );
    }
    if (page === "Winning Summary") {
      return (
        <Box key={page}>
          <ListItemButton
            onClick={() => {
              if (collapsed) setCollapsed(false);
              // OpenSubmenu === Betting Summary
              setOpenSubmenu(openSubmenu === page ? null : page);
              if (!currentPath.startsWith("/betting-summary")) {
                console.log("Navigating to: dashboard" )
                router.push("/winning-summary/dashboard");
              }
            }}
            sx={{
              px: collapsed ? 0 : 1,
              py: 1.5,
              borderRadius: "6px",
              my: 1,
              color: currentPath.startsWith("/winning-summary")
                ? "#BB86FC"
                : "inherit",
            }}
          >
            <CasinoIcon
              sx={{
                fontSize: collapsed ? "1.4rem" : "1.3rem",
                mr: collapsed ? 0 : 1,
                ml: collapsed ? 0.5 : 0,
              }}
            />
            {!collapsed && (
              <>
                <Typography
                  sx={{
                    flexGrow: 1,
                    fontSize: 14,
                    fontWeight: currentPath.startsWith("/betting-summary")
                      ? "700"
                      : "300",
                  }}
                >
                  {page}
                </Typography>
                {openSubmenu === page ? <ExpandLess /> : <ExpandMore />}
              </>
            )}
          </ListItemButton>

          <Collapse
            in={!collapsed && openSubmenu === page}
            timeout="auto"
            unmountOnExit
          >
            <List component="div" disablePadding>
              {WINNING_SUBMENUS.map((subItem) => (
                <ListItem key={subItem.path} disablePadding sx={{ pl: 4 }}>
                  <ListItemButton
                    component="a"
                    href={subItem.path}
                    selected={SideBarActiveGameType === subItem.name}
                    onClick={() => handleListItemClick(subItem)}
                    sx={{
                      py: 1,
                      borderRadius: "6px",
                      "&.Mui-selected": {
                        backgroundColor: "rgba(187, 134, 252, 0.16)",
                        color: "#BB86FC",
                      },
                    }}
                  >
                    <ListItemText
                      primary={subItem.name}
                      primaryTypographyProps={{
                        fontSize: 14,
                        fontWeight:
                          currentPath === `/betting-summary/${subItem.path}`
                            ? "700"
                            : "300",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>
        </Box>
      );
    }

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
                  {/* Logo */}
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
                    {/* Date */}
                    <Typography
                      sx={{ color: "white", fontWeight: "400", fontSize: 12.4 }}
                    >
                      {formattedDate}
                    </Typography>
                    {/* Time */}
                    <Typography
                      sx={{ color: "white", fontWeight: "700", fontSize: 25 }}
                    >
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
                mb: 1,
              }}
            >
              <Box
                sx={{ cursor: "pointer", display: "flex" }}
                component="a"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
              >
                <LogoutIcon sx={{ fontSize: "1.2rem" }} />
                {!collapsed && (
                  <Typography sx={{ ml: 1, fontSize: 14, fontWeight: 700 }}>
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