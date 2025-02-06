// src\pages\index.tsx

import React from 'react';
import LoginPage from '../components/auth/Login';

const Homepage = () => {
  return (
    <div className="min-h-screen">
      <LoginPage />
    </div>
  );
};

export default Homepage;