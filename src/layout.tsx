import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import { Box } from '@mui/material';

const drawerWidth = 240;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  return (
    <Box sx={{ display: 'flex', overflow: 'hidden' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: 'margin 0.3s ease-out',
        }}
      >
        <div style={{ marginTop: '20px' }}>{children}</div>
      </Box>
    </Box>
  );
};

export default Layout;