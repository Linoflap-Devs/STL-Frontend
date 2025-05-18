import React, { useState } from "react";
import Sidebar from "./components/layout/Sidebar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="flex-shrink-0 h-full">
        <Sidebar />
      </div>
      {/* Content Area */}
      <div className="flex flex-col flex-grow h-full pt-4">
        <main className="flex-grow overflow-y-auto p-7">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
