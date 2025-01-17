// Shared layout component for the sidebar and header.

import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
