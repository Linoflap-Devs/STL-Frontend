import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  withCredentials: true,
});

// Request Interceptor: Attach access token from localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token && !config.url?.includes("/auth/login")) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        console.warn("Refreshing token...");
        const refreshResponse = await axiosInstance.post("/auth/refresh-token", {});

        if (refreshResponse.status === 200) {
          const newAccessToken = refreshResponse.data.accessToken;
          localStorage.setItem("accessToken", newAccessToken);

          // Retry the original request with the new token
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest)
        }
      } catch (refreshError) {
        console.error("Token refresh failed, logging out...");
        
        // Clear session and redirect
        localStorage.removeItem("accessToken");
        delete axiosInstance.defaults.headers.common["Authorization"];
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
