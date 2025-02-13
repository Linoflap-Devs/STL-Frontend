import axiosInstance from "./axiosInstance";

// Function to refresh the token
async function refreshToken() {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token found");

    const response = await axiosInstance.post("/auth/tokenRefresh", { refreshToken });

    if (response.status !== 200) throw new Error("Token refresh failed");

    const newAccessToken = response.data.accessToken;
    localStorage.setItem("accessToken", newAccessToken);

    return newAccessToken;
  } catch (error) {
    console.error("Token refresh error:", error);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/auth/login"; // Redirect to login if refresh fails
    return null;
  }
}

// Get authenticated user data
export async function getUser() {
  try {
    let accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      accessToken = await refreshToken();
      if (!accessToken) throw new Error("Unauthorized");
    }

    const response = await axiosInstance.get("/users/getUsers", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching user:", error.message);
    } else {
      console.error("An unknown error occurred", error);
    }
    return null;
  }
}


// Logout user
export async function logout() {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) throw new Error("No access token found");

    await axiosInstance.post("/logout", null, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    window.location.href = "/auth/login";
  } catch (error) {
    console.error("Logout error:", error);
  }
}
