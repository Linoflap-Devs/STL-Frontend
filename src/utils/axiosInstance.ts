import axios from "axios";
import { refreshAccessToken } from "~/hooks/useRefreshToken";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Attach token to requests
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Axios response interceptor - Auto-refresh token on 401/403
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403 || error.response?.status === 401) {
      console.warn("Access token expired. Attempting refresh...");

      if (!originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const newToken = await refreshAccessToken(
            () => {
              console.warn("Logging out due to failed refresh.");
              localStorage.removeItem("accessToken");
              localStorage.removeItem("user");
              window.location.href = "/auth/login";
            },
            (token) => {
              if (token) {
                localStorage.setItem("accessToken", token);
              }
            }
          );

          if (newToken) {
            axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
