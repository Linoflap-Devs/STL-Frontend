// src/hooks/useAuth.ts for handling HOC (Higher-Order Component) or Hook to protect pages.
// this just reads the user's role from localStorage.

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// Define protected routes and role-based access control
const protectedRoutes: { [key: string]: number[] } = {
  "/dashboard": [1, 2],
  "/manager": [1, 2, 3],
};

export const useAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState<{ userType: number } | null | undefined>(undefined); // Use `undefined` for loading state

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      router.replace("/auth/login"); // Redirect if not authenticated
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    // Get the required roles for the current route
    const allowedRoles = protectedRoutes[router.pathname] || [];

    // Check if the user's role is allowed
    if (allowedRoles.length > 0 && !allowedRoles.includes(parsedUser.userType)) {
      router.replace("/unauthorized");
    }
  }, [router]);

  return user;
};

export default useAuth;
