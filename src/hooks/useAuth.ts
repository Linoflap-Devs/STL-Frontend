import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axiosInstance, { refreshToken } from "../utils/axiosInstance";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    console.log("Checking authentication status...");

    const storedToken = localStorage.getItem("accessToken");
    const tokenExpiration = localStorage.getItem("tokenExpiration");
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    const now = Date.now();

    if (storedToken && tokenExpiration) {
      const expiresAt = parseInt(tokenExpiration, 10);

      if (now < expiresAt) {
        setToken(storedToken);
        setUser(parsedUser);
      } else {
        console.warn("Token expired, attempting refresh...");
        handleTokenRefresh();
      }
    } else {
      console.warn("No valid token found, clearing session...");
      clearSession();
    }
  }, []);

  async function handleTokenRefresh() {
    const newAccessToken = await refreshToken();
    if (newAccessToken) {
      setToken(newAccessToken);
    } else {
      clearSession();
    }
  }

  function clearSession() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("tokenExpiration");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    router.replace("/auth/login");
  }

  return { token, user };
}
