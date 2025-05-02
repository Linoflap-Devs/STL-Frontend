import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSideBarStore, gameType } from "../../../store/useSideBarStore";
import { UserSectionData } from "../../data/AdminSectionData";
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

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [dateTime, setDateTime] = useState<Date | null>(null);
  const router = useRouter();
  const currentPath = router.asPath;

  const { SideBarActiveGameType, setSideBarActiveGameType } = useSideBarStore();

  const toggleCollapse = () => setCollapsed(!collapsed);

  useEffect(() => {
    const updateDateTime = () => setDateTime(new Date());
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleListItemClick = (subItem: (typeof BETTING_SUBMENUS)[number]) => {
    setSideBarActiveGameType(subItem.name as gameType);
    router.push(subItem.path);
  };

  const isCurrent = (path: string) => currentPath === path;
  const isGroupActive = (groupPath: string) =>
    currentPath.startsWith(groupPath);

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

  const renderSubmenu = (items: typeof BETTING_SUBMENUS) =>
    items.map(({ name, path }) => (
      <div
        key={path}
        onClick={() => handleListItemClick({ name, path })}
        className={clsx(
          "ml-6 py-2 pl-4 pr-2 rounded-md cursor-pointer text-sm transition-colors",
          SideBarActiveGameType === name
            ? "bg-purple-200 text-purple-800 font-bold"
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
        )}
      >
        {name}
      </div>
    ));

  const renderMenuItem = (label: string) => {
    const iconSize = 20;
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

    const path =
      routeMap[label] ?? `/${label.toLowerCase().replace(/\s+/g, "-")}`;

    if (label === "Betting Summary" || label === "Winning Summary") {
      const submenu =
        label === "Betting Summary" ? BETTING_SUBMENUS : WINNING_SUBMENUS;

      return (
        <div key={label}>
          <div
            onClick={() => {
              setOpenSubmenu(openSubmenu === label ? null : label);
              if (!isGroupActive(path)) {
                setSideBarActiveGameType("Dashboard");
                router.push(`${path}/dashboard`);
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
            ? "text-purple-400 font-semibold"
            : "text-gray-300 hover:bg-gray-700"
        )}
      >
        {iconMap[label]} {!collapsed && <span className="ml-2">{label}</span>}
      </div>
    );
  };

  return (
    <aside
      className={clsx(
        "bg-[#171717] text-white flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div
        className={clsx(
          "px-4 py-4 flex items-center",
          collapsed ? "flex-col justify-center" : "flex-row justify-between"
        )}
      >
        <button
          onClick={toggleCollapse}
          className="mb-2 flex items-center justify-center bg-[#D5D5D5] text-[#171717] rounded-full w-8 h-8 p-1 hover:bg-gray-300 transition-colors duration-200"
        >
          {collapsed ? (
            <FaChevronRight size={16} />
          ) : (
            <FaChevronLeft size={16} />
          )}
        </button>

        <div className="flex items-center">
          <img
            src={UserSectionData.image}
            alt="Logo"
            className={clsx(
              "transition-all duration-300",
              collapsed ? "w-10 mt-4" : "w-14"
            )}
          />
        </div>
      </div>

      {!collapsed && (
        <div className="bg-[#2F2F2F] rounded-md mx-4 p-4 mb-4">
          <div className="text-xs text-[#D5D5D5]">{formattedDate}</div>
          <div className="text-xs md:text-sm lg:text-2xl font-bold">
            {formattedTime}
          </div>
        </div>
      )}

      <nav className="flex-1 px-2 space-y-4">
        {UserSectionData.pages.map(renderMenuItem)}
      </nav>
    </aside>
  );
};

export default Sidebar;
