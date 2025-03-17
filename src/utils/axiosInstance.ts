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
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 403 && error.response?.data?.message === "Token expired.") {
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
