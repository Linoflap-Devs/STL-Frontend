import axios from "axios";
import { getCookie } from "./cookieUtils";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000", // Update with your API URL
  withCredentials: true, // This ensures cookies are sent with requests
});

// Add request interceptor to include Authorization header
axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
