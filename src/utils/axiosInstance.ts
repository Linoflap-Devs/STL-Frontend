import axios from "axios";
import { isTokenExpired } from "../utils/tokenUtils";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  withCredentials: true,
});

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

// Response Interceptor: Handle 401 errors without redirect
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      console.warn("401 Unauthorized: Token expired. Logging out...");

      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
