import Link from 'next/link';

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <ul>
        <li><Link href="/">Dashboard</Link></li>
        <li><Link href="/users">Go to Users</Link></li>
        <li><Link href="/transactions">Go to Transactions</Link></li>
      </ul>
    </nav>
  );
};

export default Sidebar;
