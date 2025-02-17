import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { isTokenExpired } from "../utils/tokenUtils";
import { getRefreshTokenFromCookie } from "../utils/cookieUtils";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Function to handle token refresh
  const refreshToken = async () => {
    console.log("Attempting to refresh token...");
  
    try {
      const refreshTokenCookie = getRefreshTokenFromCookie("refreshToken");
  
      if (!refreshTokenCookie) {
        console.error("No refresh token found in cookies.");
        return null;
      }
  
      console.log("Found refresh token, sending request for a new access token...");
  
      const storedToken = localStorage.getItem("accessToken");
      const storedRefreshToken = localStorage.getItem("refreshToken");
  
      if (storedRefreshToken) {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/tokenRefresh`,
            { refresh: storedRefreshToken },
            {
              withCredentials: true,
              headers: {
                "Authorization": `Bearer ${storedToken}`,
                "X-XSRF-TOKEN": getRefreshTokenFromCookie("XSRF-TOKEN"),
              },
            }
          );
  
          console.log("Token Refresh Response:", response.data);
  
          const newToken = response.data.accessToken;
          const newRefreshToken = response.data.refreshToken;
  
          if (newToken) {
            console.log("New token received:", newToken);
  
            // Store new access token in localStorage
            localStorage.setItem("accessToken", newToken);
            setToken(newToken);
  
            // Store new refresh token in localStorage and cookie
            if (newRefreshToken) {
              localStorage.setItem("refreshToken", newRefreshToken);
              document.cookie = `refreshToken=${newRefreshToken}; Path=/; SameSite=None; Max-Age=86400;`;
  
              console.log("New refresh token stored in cookie:", newRefreshToken);
            }
  
            return newToken;
          } else {
            console.error("No new token received from the server.");
            return null;
          }
  
        } catch (error) {
          console.error("Error refreshing token:", error);
          return null;
        }
      } else {
        console.error("Refresh token is missing from localStorage.");
        return null;
      }
  
    } catch (error) {
      console.error("Error refreshing token:", error);
  
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      console.log("Redirecting to login page due to token refresh failure...");
      router.replace("/auth/login");
      return null;
    }
  };
  

  const checkAuth = useCallback(async () => {
    console.log("Checking authentication status...");

    const storedToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    console.log("Stored token:", storedToken);
    //console.log("Stored user:", parsedUser);

    if (storedToken) {
      console.log("Token found, checking if it's expired...");

      if (!isTokenExpired(storedToken)) {
        console.log("Token is valid, setting token and user state.");
        setToken(storedToken);
        setUser(parsedUser);
      } else {
        console.warn("Token expired. Attempting to refresh...");

        // Try to refresh the token
        const refreshedToken = await refreshToken();

        if (refreshedToken) {
          console.log("Token refreshed successfully.");
          setUser(parsedUser);
        } else {
          console.warn("Token refresh failed. Logging out...");
          if (router.pathname !== "/auth/login") {
            console.log("Redirecting to login...");
            router.replace("/auth/login");
          }
        }
      }
    } else {
      console.warn("No token found in localStorage.");
      // If no token is found, redirect only if not already on login page
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
