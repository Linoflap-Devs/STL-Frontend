import Link from 'next/link';

const Dashboard = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the homepage!</p>
      <Link href="/users">Go to Users Page</Link>
    </div>
  );
};

export default Dashboard;
