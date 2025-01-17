import React from 'react';
import Link from 'next/link';

const LoginPage = () => {
  return (
    <div>
      <h1>Login Page</h1>
      <h1>For example, the user logged in: Go to Homepage Page:</h1>
      <Link href="/dashboard">Log In - Go to Dashboard</Link>
    </div>
  );
};

LoginPage.getLayout = (page: React.ReactNode) => page; // disable layout for this page

export default LoginPage;