import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="header">
      <div className="user-profile">
        <span className="user-name">Header</span>
        <span className="user-name">Admin</span>
        <button className="logout-btn">Logout</button>
      </div>
    </header>
  );
};

export default Header;
