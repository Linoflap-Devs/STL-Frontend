import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  withCredentials: true,
});

// Request Interceptor: Attach access token from localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Function to refresh the access token
export const refreshToken = async (): Promise<string | null> => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) throw new Error("No refresh token available");

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/tokenRefresh`,
      null,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );

    const { token: newAccessToken } = response.data;

    if (!newAccessToken) throw new Error("Failed to get new access token");

    // Store new access token
    localStorage.setItem("accessToken", newAccessToken);

    return newAccessToken;
  } catch (error) {
    console.error("Refresh token request failed:", error);
    localStorage.removeItem("accessToken");
    return null;
  }
};

// Response Interceptor: Handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newAccessToken = await refreshToken();
      if (newAccessToken) {
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
