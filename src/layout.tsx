import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import { Box } from '@mui/material';

const drawerWidth = 240;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: 'margin 0.3s ease-out',
          marginLeft: open ? `${drawerWidth}px` : 0,
        }}
      >
        <div style={{ marginTop: '64px' }}>{children}</div>
      </Box>
    </Box>
  );
};

export default Layout;