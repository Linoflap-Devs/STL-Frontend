
import axios from "axios";

// Axios Instance Setup 
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});


// Response Interceptor (Token Refresh Logic)
axiosInstance.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
     // Check for token expiration (403 + specific error message)
    if (error.response?.status === 403 && error.response?.data?.message === "Token expired.") {
      try {
        // Attempt to refresh token
        await axiosInstance.post("/auth/tokenRefresh", {}, { withCredentials: true });

        console.log(`Refreshing Access Token from axiosInstance`)
        // Retry the failed request
        return axiosInstance(error.config);
      } catch (refreshError) {
        // Refresh failed → redirect to login
        console.error("Refresh token failed", refreshError);
        window.location.href = "/auth/login";
      }
    }
    // Forward other errors
    return Promise.reject(error);
  }
);

export default axiosInstance;