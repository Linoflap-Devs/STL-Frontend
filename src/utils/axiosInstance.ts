import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  withCredentials: true,
});

// Function to refresh the token when a 401 Unauthorized error occurs
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const refreshResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/tokenRefresh`, // backend endpoint for refreshing token
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.accessToken;

        // Store the new access token in localStorage
        localStorage.setItem("accessToken", newAccessToken);

        error.config.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosInstance(error.config);
      } catch (refreshError) {
        console.error("Session expired, logging out...");

        try {
          await axiosInstance.delete("/logout");
        } catch (err) {
          console.error("Error during logout:", err);
        }

        // Remove access token and refresh token cookies to fully log out the user
        document.cookie = "accessToken=; max-age=0; path=/"; 
        document.cookie = "refreshToken=; max-age=0; path=/"; 

        // Redirect to login page
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  }
);

// Interceptor to add the Authorization header with the access token for each request
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    // If access token exists, add it to the request header
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;