import axios from "axios";

export const refreshAccessToken = async () => {
  try {
    const response = await axios.post("/auth/tokenRefresh",
      {},
      { withCredentials: true } // sending of cookie
    );

    // Store the new access token and refresh token in the frontend
    console.log("Tokens refreshed", response.data);
    return response.data;
  } catch (error) {
    console.error("Error refreshing token", error);
    // Handle token refresh failure (e.g., log out the user)
    return null;
  }
};