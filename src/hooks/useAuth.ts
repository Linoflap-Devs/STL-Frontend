import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import axiosInstance from "../utils/axiosInstance";
import { isTokenExpired } from "../utils/tokenUtils";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  user: string;
  id: number;
  role: number;
  iat: number;
  exp: number;
}

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Function to handle logout cleanly
  const handleLogout = useCallback(() => {
    console.warn("Logging out user...");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);

    setTimeout(() => {
      router.replace("/auth/login");
    }, 100);
  }, [router]);

  // Function to decode token
  const decodeToken = (storedToken: string) => {
    try {
      const decoded: DecodedToken = jwtDecode(storedToken);
      console.log("Decoded Token:", decoded);
      return decoded;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  // Function to verify token and fetch user details
  const verifyUser = useCallback(async (storedToken: string) => {
    try {
      const response = await axiosInstance.get("/users/getCurrentUser", {
        headers: { Authorization: `Bearer ${storedToken}` },
        withCredentials: true,
      });

      console.log("Response:", response.data);

      if (response.data?.success === true) {
        console.log("User authenticated:", response.data.UserId);

        setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.UserId));

        router.push("/dashboard");
      } else {
        console.warn("User verification failed with success code:", response.data?.success);
        handleLogout();
      }
    } catch (error) {
      console.error("Authentication error:", error);
      handleLogout();
    }
  }, [handleLogout, router]);

  useEffect(() => {
    console.log("Checking authentication status...");

    const storedToken = localStorage.getItem("accessToken");

    if (!storedToken) {
      console.warn("No token found.");
      if (!isLoading) {
        handleLogout();
      }
      return;
    }

    if (isTokenExpired(storedToken)) {
      console.warn("Token expired.");
      handleLogout();
      return;
    }

    // Decode the token and set user from the decoded data
    const decodedToken = decodeToken(storedToken);
    if (decodedToken) {
      verifyUser(storedToken);
      setUser(decodedToken.user);
      setToken(storedToken);
    }

    // If no valid user decoded from the token, verify user via API
    if (!decodedToken) {
      verifyUser(storedToken);
    }
  }, [handleLogout, isLoading, verifyUser]);

  return { token, user };
}
