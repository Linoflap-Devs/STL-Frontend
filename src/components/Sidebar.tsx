import Link from 'next/link';

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <ul>
        <li>Sidebar</li>
        <li><Link href="/dashboard">Go to Dashboard</Link></li>
        <li><Link href="/users">Go to Users</Link></li>
        <li><Link href="/transactions">Go to Transactions</Link></li>
      </ul>
    </nav>
  );
};

export default Sidebar;