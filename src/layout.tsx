import React, { useState } from "react";
import Sidebar from "./components/layout/Sidebar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen items-stretch">
      {/* Added items-stretch */}
      {/* Sidebar */}
      <Sidebar />
      {/* Content Area */}
      <div className="flex flex-col flex-grow">
        <main className="flex-grow overflow-y-auto p-5">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
