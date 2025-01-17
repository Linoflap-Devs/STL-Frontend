import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header>
      <div>
        <span>Header</span>
        <span>Admin</span>
        <span>
          <Link href="/">Temporary Logout Button</Link>
        </span>
      </div>
    </header>
  );
};

export default Header;
