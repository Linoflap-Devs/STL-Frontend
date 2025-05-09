import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSideBarStore, gameType } from "../../../store/useSideBarStore";
import { UserSectionData } from "../../data/AdminSectionData";
import { getCurrentUser, logoutUser } from "~/utils/api/auth";
import { FaSignOutAlt } from "react-icons/fa";
import Skeleton from "@mui/material/Skeleton";

import {
  FaHome,
  FaBusinessTime,
  FaUserShield,
  FaDiceSix,
  FaBroadcastTower,
  FaMoneyBillAlt,
  FaStoreAlt,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import clsx from "clsx";

const BETTING_SUBMENUS = [
  { name: "Dashboard", path: "/betting-summary/dashboard" },
  { name: "STL Pares", path: "/betting-summary/stl-pares" },
  { name: "STL Swer2", path: "/betting-summary/stl-swer2" },
  { name: "STL Swer3", path: "/betting-summary/stl-swer3" },
  { name: "STL Swer4", path: "/betting-summary/stl-swer4" },
];

const WINNING_SUBMENUS = [
  { name: "Dashboard", path: "/winning-summary/dashboard" },
  { name: "STL Pares", path: "/winning-summary/stl-pares" },
  { name: "STL Swer2", path: "/winning-summary/stl-swer2" },
  { name: "STL Swer3", path: "/winning-summary/stl-swer3" },
  { name: "STL Swer4", path: "/winning-summary/stl-swer4" },
];
const DRAW_SUBMENUS = [
  { name: "STL Pares", path: "/draw-summary/stl-pares" },
  { name: "STL Swer2", path: "/draw-summary/stl-swer2" },
  { name: "STL Swer3", path: "/draw-summary/stl-swer3" },
  { name: "STL Swer4", path: "/draw-summary/stl-swer4" },
]

const getUserRole = (userTypeId: number) => {
  switch (userTypeId) {
    case 1:
      return "Collector";
    case 2:
      return "Manager";
    case 3:
      return "Executive";
    case 4:
      return "Admin";
    case 5:
      return "System Admin";
    default:
      return "Unknown Role";
  }
};

const Sidebar: React.FC = () => {
  // Handling Paths
  const router = useRouter();
  const currentPath = router.asPath;
  const { SideBarActiveGameType, setSideBarActiveGameType } = useSideBarStore();
  const isCurrent = (path: string) => currentPath === path;
  //  if the current URL path(currentPath) starts with a certain group path (groupPath)
  const isGroupActive = (groupPath: string) => currentPath.startsWith(groupPath);

  const [collapsed, setCollapsed] = useState(false);
  // State whether open the submenu for Betting and Winning or not
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const toggleCollapse = () => setCollapsed(!collapsed);

  // Date Time
  const [dateTime, setDateTime] = useState<Date | null>(null);

  const [user, setUser] = useState<{
    firstName: string;
    lastName: string;
    userTypeId: number;
  } | null>(null);

  const formattedDate =
    dateTime?.toLocaleDateString("en-PH", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }) ?? "N/A";

  const formattedTime =
    dateTime?.toLocaleTimeString("en-PH", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }) ?? "N/A";

  useEffect(() => {
    const updateDateTime = () => setDateTime(new Date());
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    (async () => {
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
    })();
  }, []);

  const handleListItemClick = (subItem: (typeof BETTING_SUBMENUS)[number]) => {
    setSideBarActiveGameType(subItem.name as gameType);
    router.push(subItem.path);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Menu
  const renderMenuItem = (label: string) => {
    const iconSize = 20;

    // will map here if the label === "Betting Summary" || "Winning Summary"
    const iconMap: Record<string, React.ReactNode> = {
      Dashboard: <FaHome size={iconSize} />,
      Managers: <FaUserShield size={iconSize} />,
      Executive: <FaBusinessTime size={iconSize} />,
      "Betting Summary": <FaDiceSix size={iconSize} />,
      "Winning Summary": <FaMoneyBillAlt size={iconSize} />,
      "Draw Summary": <FaBroadcastTower size={iconSize} />,
      Operators: <FaStoreAlt size={iconSize} />,
    };

    const routeMap: Record<string, string> = {
      Dashboard: "/dashboard",
      Managers: "/managers",
      Executive: "/executives",
      "Winning Summary": "/winning-summary",
      "Betting Summary": "/betting-summary",
      "Draw Summary": "/draw-summary",
      Operators: "/operators",
    };

    // generates URL path for menu item, using predefined route if avail, or falling back to a default format if not
    // gets the given path for the given 'label', from routeMap above.
    // routeMap[label] = 'Dashboard' path will be /dashboard
    // if routeMap[label] = 'Sample Key'/'null' or wala yung label sa routeMap keys natin, fallback path will be /sample-key
    const path =
      routeMap[label] ?? `/${label.toLowerCase().replace(/\s+/g, "-")}`;

    if (
      label === "Betting Summary" ||
      label === "Winning Summary" ||
      label === "Draw Summary"
    ) {
      // Object we'll referencing on creating divs
      let submenu;
      if (label === "Betting Summary") submenu = BETTING_SUBMENUS;
      else if (label === "Winning Summary") submenu = WINNING_SUBMENUS;
      else submenu = DRAW_SUBMENUS;

      return (
        <div key={label}>
          <div
            onClick={() => {
              {/* openSubmenu === current label */ }
              setOpenSubmenu(openSubmenu === label ? null : label);
              {/* 
                if user is not already inside the sidebar group
                !isGroupActive('winning-summary')
                if !currentPath.startsWith('winning-summary')
                activeGameType = 'Dashboard' by default
                /winning-summary/dashboard
                Inly direct to dashboard if available
              */}
              if (!isGroupActive(path)) {
                if (label === "Betting Summary" || label === "Winning Summary") {
                  setSideBarActiveGameType("Dashboard");
                  router.push(`${path}/dashboard`);
                } else {
                  // For Draw Summary, just navigate to the first submenu path
                  const firstPath = submenu[0]?.path;
                  if (firstPath) {
                    setSideBarActiveGameType(submenu[0].name as gameType)
                    // router.push(`${path}/${firstPath}`)
                    router.push(firstPath)
                  }
                }
              }
            }}
            className={clsx(
              "flex items-center justify-between px-4 py-2 cursor-pointer rounded-md",
              isGroupActive(path)
                ? "text-purple-400 font-semibold"
                : "text-gray-300 hover:bg-gray-700"
            )}
          >
            <span className="flex items-center gap-2 text-sm">
              {iconMap[label]}
              {/* 
                if !collapsed corresponding label w/icon will be displayed
              */}
              {!collapsed && label}
            </span>
            {!collapsed &&
              (openSubmenu === label ? <FaChevronUp /> : <FaChevronDown />)}
          </div>
          {!collapsed && openSubmenu === label && renderSubmenu(submenu)}
        </div>
      );
    }
    return (
      <div
        key={label}
        onClick={() => router.push(path)}
        className={clsx(
          "flex items-center px-4 py-2 cursor-pointer rounded-md text-sm",
          isCurrent(path)
            ? "bg-[#F6BA12] text-[#0038A8] font-semibold"
            : "text-gray-300"
        )}
      >
        {iconMap[label]} {!collapsed && <span className="ml-2">{label}</span>}
      </div>
    );
  };
  // Submenu
  const renderSubmenu = (items: typeof BETTING_SUBMENUS) =>
    items.map(({ name, path }) => (
      <div
        key={path}
        onClick={() => handleListItemClick({ name, path })}
        className={clsx(
          "ml-6 py-2 pl-4 pr-2 rounded-md cursor-pointer text-sm transition-colors",
          SideBarActiveGameType === name
            ? "bg-[#F6BA12] text-purple-800 font-bold"
            : "text-gray-300 hover:text-white"
        )}
      >
        {name}
      </div>
    ));
  return (
    // Main Menu
    <aside
      className={clsx(
        "p-3.5 bg-[#0038A8] text-white flex flex-col transition-all duration-300 min-h-screen",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div
        className={clsx(
          "flex items-center",
          collapsed ? "flex-col justify-center" : "flex-row justify-center"
        )}
      >
        {/* User Section */}
        <div className="bg-[#ACA993] p-0 pt-1 rounded-md w-full">
          <div className="flex justify-between px-3 p-3 w-full">
            {/* Toggle Collapse Icon (Left Corner) */}
            <button
              onClick={toggleCollapse}
              className="flex justify-center items-center bg-[#0038A8] 
                text-[#ACA993] rounded-full w-6 h-6 p-1 hover:bg-gray-300 transition-colors duration-200"
            >
              {collapsed ? (
                <FaChevronRight size={12} />
              ) : (
                <FaChevronLeft size={12} />
              )}
            </button>
            {/* Logo (Right Corner) */}
            <div className="flex ml-auto">
              <img
                src={UserSectionData.image}
                alt="Logo"
                className={clsx(
                  "transition-all duration-300",
                  collapsed ? "w-10" : "max-w-[8rem]"
                )}
              />
            </div>
          </div>
          {/* Time and Date */}
          {!collapsed && (
            <div className="text-[#0038A8] px-3 py-2 leading-none">
              <div className="text-xs md:text-sm lg:text-2xl font-bold leading-none mb-0">
                {formattedTime}
              </div>
              <div className="text-xs leading-none mt-0">
                {formattedDate}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Details */}
      <div className="pt-5 pb-3 px-1">
        <div className="text-2xl font-bold text-white leading-tight">
          {user ? `${user.firstName} ${user.lastName}` : (
            <Skeleton variant="text" width={100} height={20} />
          )}
        </div>
        <div className="text-xs text-white">
          {user ? getUserRole(user.userTypeId) : ""}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-3">
        {UserSectionData.pages.map(renderMenuItem)}
        {/* Logout Button */}
        <div
          onClick={handleLogout}
          className="flex items-center px-4 py-2 cursor-pointer rounded-md text-sm 
             transition-colors" >
          <FaSignOutAlt size={16} />
          {!collapsed && <span className="ml-2">Logout</span>}
        </div>
      </nav>

    </aside>
  );
};

export default Sidebar;
