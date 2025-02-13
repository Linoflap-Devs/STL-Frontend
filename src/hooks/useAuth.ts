// src/hooks/useAuth.ts for handling HOC (Higher-Order Component) or Hook to protect pages.

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// Helper function to get cookies by name
const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return undefined;
};

export const useAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState<{ userType: number } | null | undefined>(undefined);

  useEffect(() => {
    const token = getCookie("authToken");
    const storedUser = getCookie("user");

    if (!token || !storedUser) {
      // Avoid redirecting if already on the login page
      if (window.location.pathname !== "/auth/login") {
        router.replace("/auth/login");
      }
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
  }, [router]);

  return user;
};

export default useAuth;