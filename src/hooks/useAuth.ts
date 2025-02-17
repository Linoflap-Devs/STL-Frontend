import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { isTokenExpired } from "../utils/tokenUtils";

// Refresh token logic
const refreshAccessToken = async () => {
    
  const storedRefreshToken = localStorage.getItem("refreshToken");

  if (!storedRefreshToken) {
    console.error("No refresh token found.");
    console.error(storedRefreshToken)
  }

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/tokenRefresh`,
      { refresh: storedRefreshToken },
      { withCredentials: true }
    );

    if (response.status === 200) {
      const newAccessToken = response.data.accessToken;
      localStorage.setItem("accessToken", newAccessToken);
      return newAccessToken;
    }

    throw new Error("Failed to refresh token");
  } catch (error) {
    console.error("Error refreshing access token:", error);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    return null;
  }
};

// Custom hook for authentication
export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    console.log("Checking authentication status...");

    const storedToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    console.log("Stored token:", storedToken);

    if (storedToken) {
      console.log("Token found, checking if it's expired...");

      if (!isTokenExpired(storedToken)) {
        console.log("Token is valid, setting token and user state.");
        setToken(storedToken);
        setUser(parsedUser);
      } else {
        console.warn("Token expired. Attempting to refresh...");

        if (storedRefreshToken) {
          const refreshedToken = await refreshAccessToken();

          if (refreshedToken) {
            console.log("Token refreshed successfully.");
            setToken(refreshedToken);
            setUser(parsedUser);
            localStorage.setItem("accessToken", refreshedToken);
          } else {
            console.warn("Token refresh failed. Logging out...");
            if (router.pathname !== "/auth/login") {
              console.log("Redirecting to login...");
              router.replace("/auth/login");
            }
          }
        } else {
          console.warn("No refresh token found.");
          if (router.pathname !== "/auth/login") {
            console.log("Redirecting to login page...");
            router.replace("/auth/login");
          }
        }
      }
    } else {
      console.warn("No token found in localStorage.");
      if (router.pathname !== "/auth/login") {
        console.log("Redirecting to login page...");
        router.replace("/auth/login");
      }
    }
  }, [router]);

  useEffect(() => {
    console.log("useEffect triggered to check authentication.");
    checkAuth();
  }, [checkAuth]);

  return { token, user };
}
