import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Function to refresh access token
const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) throw new Error("No refresh token available");

    console.log("Refreshing token...");

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/auth/tokenRefresh`,
      { refresh: refreshToken },
      { withCredentials: true }
    );

    const newAccessToken = response.data?.data?.token;
    const newRefreshToken = response.data?.data?.refresh;

    if (!newAccessToken || !newRefreshToken) throw new Error("Invalid refresh response");

    // Store new tokens
    localStorage.setItem("accessToken", newAccessToken);
    localStorage.setItem("refreshToken", newRefreshToken);

    return newAccessToken;
  } catch (error) {
    console.error("Refresh token failed:", error);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
    return null;
  }
};

// Axios request interceptor - Attach token to requests
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

// Axios response interceptor - Refresh token on 401/403
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Prevent infinite loop
    if (error.response?.status === 403 || error.response?.status === 401) {
      console.warn("Access token expired. Attempting refresh...");
      
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        
        const newToken = await refreshAccessToken();
        if (newToken) {
          axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest); // Retry failed request
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
