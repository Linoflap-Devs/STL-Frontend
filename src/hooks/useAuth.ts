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

  // Refresh access token function
  const refreshAccessToken = useCallback(async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    console.log("Stored refresh token:", refreshToken);
  
    if (!refreshToken) {
      console.warn("No refresh token found. Logging out.");
      handleLogout();
      return;
    }
  
    // Remove the old access token from localStorage before sending the refresh request
    localStorage.removeItem("accessToken");
  
    try {
      console.log("Sending refresh token:", { refresh: refreshToken });
  
      const response = await axiosInstance.post(
        "/auth/tokenRefresh",
        { refresh: refreshToken }, // ✅ Fixed request body key
        { withCredentials: true }   // ✅ Include credentials (cookies)
      );
  
      console.log("Token refresh response:", response.data);
  
      if (response.data?.success) {
        const newAccessToken = response.data.data.token;
        const newRefreshToken = response.data.data.refresh;
  
        console.log("New tokens received. Updating localStorage and cookies.");
  
        // Store the access token in localStorage
        localStorage.setItem("accessToken", newAccessToken);
  
        // Store the refresh token as a cookie
        document.cookie = `refreshToken=${newRefreshToken}; path=/; secure; samesite=strict`;
  
        setToken(newAccessToken);
      } else {
        console.warn("Failed to refresh token. Logging out.");
        handleLogout();
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      handleLogout();
    }
  }, [handleLogout]);
  
  // Function to verify token and fetch user details
  const verifyUser = useCallback(async (storedToken: string) => {
    try {
      const response = await axiosInstance.get("/users/getCurrentUser", {
        headers: { Authorization: `Bearer ${storedToken}` },
        withCredentials: true,
      });

      console.log("Response:", response.data);

      if (response.data?.success === true) {

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
        // handleLogout();
        refreshAccessToken()
      }
      return;
    }

    if (isTokenExpired(storedToken)) {
      console.warn("Token expired.");
      // handleLogout();
      refreshAccessToken()
      return;
    }

    // Decode the token and set user from the decoded data
    const decodedToken = decodeToken(storedToken);
    if (decodedToken) {
      //verifyUser(storedToken);
      setUser(decodedToken.user);
      setToken(storedToken);
    }

    // If no valid user decoded from the token, verify user via API
    if (!decodedToken) {
      verifyUser(storedToken);
    }
  }, [handleLogout, isLoading, verifyUser]);

  // useEffect(()=> {
  //   refreshAccessToken()
  // }, [refreshAccessToken])
  // useEffect(() => {
  //   if(!token) return;

  //   const interval = setInterval(()=> {
  //     console.log("Refreshing token evert 50 seconds.")
  //     refreshAccessToken();
  //   }, 50*1000) //refresh eery 50 seconds
  //   return () => clearInterval(interval); //cleanup interval on change/unmount
  // }, [token, refreshAccessToken])
 
 
  // // useEffect(()=> {
  // //   const sampleInterval = setInterval(()=> {
  // //     console.log("Sample Interval")
  // //   }, 1000)
  // // }, [])
  return { token, user };
}
