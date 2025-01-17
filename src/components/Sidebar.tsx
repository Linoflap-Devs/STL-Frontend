// components/Sidebar.js
import Link from 'next/link';

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <ul>
        <li><Link href="/">Dashboard</Link></li>
        <li><Link href="/users">Users</Link></li>
      </ul>
    </nav>
  );
};

export default Sidebar;
