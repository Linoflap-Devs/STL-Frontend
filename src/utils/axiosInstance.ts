// src\utils\axiosInstance.ts

import axios from "axios";
  
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 403 && error.response?.status === 400 && error.response?.data?.message === "Token expired.") {
      try {
        // Send refresh token request
        await axiosInstance.post("/auth/tokenRefresh", {}, { withCredentials: true });

        // Retry the failed request
        return axiosInstance(error.config);
      } catch (refreshError) {
        console.error("Refresh token failed", refreshError);
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;