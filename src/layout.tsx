import React, { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const handleDrawerToggle = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="flex-shrink-0 h-full">
        <Sidebar />
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-grow h-full pb-2">
        <Header
          handleDrawerToggle={handleDrawerToggle}
          collapsed={collapsed}
          mobileOpen={false}
        />
        <main className="flex-grow overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

