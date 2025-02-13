import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
});

// Function to refresh the token when a 401 Unauthorized error occurs
axiosInstance.interceptors.response.use(
  (response) => response, // If response is successful, return it as-is
  async (error) => {
    // Check if the error status is 401 (Unauthorized), meaning the access token has expired
    if (error.response?.status === 401) {
      try {
        // Send a request to refresh the token using the stored refresh token
        const refreshResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/tokenRefresh`, // Backend endpoint for refreshing token
          {
            refreshToken: localStorage.getItem("refreshToken"), // Retrieve refresh token from localStorage
          }
        );

        // Get the new access token from the response
        const newAccessToken = refreshResponse.data.accessToken;

        // Store the new access token in localStorage
        localStorage.setItem("accessToken", newAccessToken);

        // Update the failed request's Authorization header with the new access token
        error.config.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry the original request with the new token
        return axiosInstance(error.config);
      } catch (refreshError) {
        console.error("Session expired, logging out...");

        // If refreshing the token fails, attempt to log out the user
        try {
          await axiosInstance.delete("/logout"); // Send a request to backend logout endpoint
        } catch (err) {
          console.error("Error during logout:", err); // Log any errors during logout
        }

        // Remove access and refresh tokens from localStorage to fully log out the user
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        // Redirect the user to the login page
        window.location.href = "/auth/login";
      }
    }

    // Reject the error if it's not a 401 or if token refresh fails
    return Promise.reject(error);
  }
);

// Add access token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
