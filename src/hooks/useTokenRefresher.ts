import { useEffect, useRef } from "react";
import axiosInstance from "../utils/axiosInstance";
import { jwtDecode } from "jwt-decode";

export function useTokenRefresher() {
  const refreshTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const scheduleTokenRefresh = () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        const decodedToken: { exp: number } = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = decodedToken.exp - currentTime;

        if (timeUntilExpiry > 60) {
          // Refresh 1 minute before expiration
          const refreshTime = (timeUntilExpiry - 60) * 1000;
          console.log(`Scheduling token refresh in ${refreshTime / 1000} seconds...`);

          refreshTimeout.current = setTimeout(refreshToken, refreshTime);
        } else {
          console.warn("Token is already expired or too close to expiry, refreshing now...");
          refreshToken();
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        refreshToken(); // Refresh immediately if decoding fails
      }
    };

    const refreshToken = async () => {
      try {
        console.log("Refreshing token...");
        const response = await axiosInstance.post("/auth/refresh-token", {}, { withCredentials: true });

        if (response.status === 200) {
          const newAccessToken = response.data.accessToken;
          localStorage.setItem("accessToken", newAccessToken);
          scheduleTokenRefresh(); // Schedule next refresh
        }
      } catch (error) {
        console.error("Failed to refresh token. Logging out...");
        localStorage.removeItem("accessToken");
        window.location.href = "/auth/login";
      }
    };

    scheduleTokenRefresh();

    return () => {
      if (refreshTimeout.current) {
        clearTimeout(refreshTimeout.current);
      }
    };
  }, []);

  return null;
}
