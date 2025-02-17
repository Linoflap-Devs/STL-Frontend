import axios from "axios";
import { isTokenExpired } from "../utils/tokenUtils";

// Create Axios instance with base URL
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  withCredentials: true,
});

// Helper function to refresh the access token
const refreshAccessToken = async () => {
  const storedRefreshToken = localStorage.getItem("refreshToken");

  if (!storedRefreshToken) {
    console.error("No refresh token found.");
    return null;
  }

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/tokenRefresh`,
      { refresh: storedRefreshToken },
      { withCredentials: true }
    );

    if (response.status === 200) {
      // Successfully refreshed token
      const newAccessToken = response.data.accessToken;
      localStorage.setItem("accessToken", newAccessToken); // Store the new access token
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

// Request Interceptor: Attach token only if NOT expired
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token && !isTokenExpired(token) && !config.url?.includes("/auth/login")) {
      config.headers["Authorization"] = `Bearer ${token}`;
    } else if (token && isTokenExpired(token)) {
      console.warn("Token is expired. Removing from storage...");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 errors and attempt to refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.warn("401 Unauthorized: Token expired. Attempting to refresh...");

      originalRequest._retry = true; // Mark the request to prevent infinite loop
      const newAccessToken = await refreshAccessToken();

      if (newAccessToken) {
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      }

      // If refresh token fails, log out the user
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      window.location.href = "/auth/login"; // Redirect to login page
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
