import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import axiosInstance from "../utils/axiosInstance";
import { isTokenExpired } from "../utils/tokenUtils";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Function to handle logout cleanly
  const handleLogout = useCallback(() => {
    console.warn("Logging out user...");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    
    setToken(null);
    setUser(null);
    
    setTimeout(() => {
      router.replace("/auth/login"); // Avoids multiple router calls
    }, 100);
  }, [router]);

  // Function to verify token and fetch user details
  const verifyUser = useCallback(async (storedToken: string) => {
    try {
      const response = await axiosInstance.get("/users/getCurrentUsers", {
        headers: { Authorization: `Bearer ${storedToken}` }, // Ensure token is sent
        withCredentials: true, // Sends cookies if required
      });

      if (response.data?.success) {
        console.log("User authenticated:", response.data.UserId);
        setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.UserId));
      } else {
        console.warn("User verification failed.");
        handleLogout();
      }
    } catch (error) {
      console.error("Authentication error:", error);
      handleLogout();
    }
  }, [handleLogout]);

  useEffect(() => {
    console.log("Checking authentication status...");

    const storedToken = localStorage.getItem("accessToken");
    if (!storedToken) {
      console.warn("No token found.");
      handleLogout();
      return;
    }

    if (isTokenExpired(storedToken)) {
      console.warn("Token expired.");
      handleLogout();
      return;
    }

    // Set token and verify user
    setToken(storedToken);
    verifyUser(storedToken);
  }, [handleLogout, verifyUser]);

  return { token, user };
}
