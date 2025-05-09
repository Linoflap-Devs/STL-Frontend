import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getCurrentUser, logoutUser } from "~/utils/api/auth";
import { FaSignOutAlt } from "react-icons/fa";
import { Skeleton } from "@mui/material";

interface HeaderProps {
  handleDrawerToggle?: () => void;
  collapsed?: boolean;
  mobileOpen?: boolean;
}

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

const Header: React.FC<HeaderProps> = () => {
  const router = useRouter();
  const [user, setUser] = useState<{
    firstName: string;
    lastName: string;
    userTypeId: number;
  } | null>(null);


  return (
    <header className="w-full bg-[#2F2F2F]">
      <div className="flex items-center p-4">
        <div className="flex items-center gap-4 ml-auto">
          <div>
            <div className="text-sm font-medium text-white leading-tight">
              {user ? (
                `${user.firstName} ${user.lastName}`
              ) : (
                <Skeleton variant="text" width={80} height={40} />
              )}
            </div>
            <div className="text-xs text-white text-right">
              {user ? getUserRole(user.userTypeId) : ""}
            </div>
          </div>
          <div className="cursor-pointer flex">
            <div title="Logout User">
              <button className="p-2 bg-[#D9D9D9] rounded-full text-[#171717]">
                <FaSignOutAlt size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
