// Login Page

import React from 'react';
import Link from 'next/link';

const Dashboard: React.FC = () => {
  return (
    <div>
      <h1>Login Page</h1>
      <h1>For example, the user logged in: Go to Homepage Page:</h1>
      <Link href="/dashboard">Go to Dashboard</Link>
    </div>
  );
};

export default Dashboard;
