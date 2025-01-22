import React, { useState } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';

interface Layout {
  children: React.ReactNode;
}

const Layout: React.FC<Layout> = ({ children }) => {
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar open={open} handleDrawerClose={handleDrawerClose} />
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          marginLeft: open ? 240 : 0,
          transition: 'margin-left 0.5s ease',
          overflow: 'hidden',
        }}
      >
        <Header handleDrawerOpen={handleDrawerOpen} open={open} />
        <div style={{ flex: 1, marginTop: '64px', overflow: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
