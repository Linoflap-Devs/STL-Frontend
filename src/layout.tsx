import React, { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import { Box } from "@mui/material";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const handleDrawerToggle = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex", overflow: "hidden" }}>
      <Sidebar collapsed={collapsed} />
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Header handleDrawerToggle={handleDrawerToggle} collapsed={collapsed} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            transition: "margin 0.3s ease-out",
          }}
        >
          <div style={{ marginTop: "5rem" }}>{children}</div>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
