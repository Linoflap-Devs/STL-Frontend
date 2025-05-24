// Layout.tsx
import React from "react";
import Sidebar from "./components/layout/Sidebar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <div className="h-screen">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-grow overflow-hidden">
        <main className="flex-grow overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
