import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  if (config.url?.startsWith('http://') || config.url?.startsWith('https://')) {
    throw new Error('Absolute URLs are not allowed.');
  }
  return config;
});

// Response interceptor to handle token expiration
let isRefreshing = false;
export let refreshSubscribers: (() => void)[] = []; // ✅ Export refreshSubscribers

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403 && error.response?.data?.message === "Token expired.") {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          await axiosInstance.post("/auth/tokenRefresh", {}, { withCredentials: true });

          isRefreshing = false;
          refreshSubscribers.forEach((cb) => cb());
          refreshSubscribers = [];

          return axiosInstance(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          refreshSubscribers = [];
          console.error("Refresh token failed", refreshError);
          window.location.href = "/auth/login";
          return Promise.reject(refreshError);
        }
      } else {
        return new Promise((resolve) => {
          refreshSubscribers.push(() => resolve(axiosInstance(originalRequest)));
        });
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
