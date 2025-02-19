import axiosInstance from "../utils/axiosInstance";

const getCookie = (name: string) => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
};

export const refreshAccessToken = async (
  handleLogout: () => void,
  setToken: (token: string | null) => void
) => {
  const refreshToken = getCookie("refreshToken") || localStorage.getItem("refreshToken");

  console.log("Stored refresh token:", refreshToken);

  if (!refreshToken) {
    console.warn("No refresh token found. Logging out.");
    handleLogout();
    return null;
  }

  localStorage.removeItem("accessToken");

  try {
    console.log("Sending refresh token:", { refresh: refreshToken });

    const response = await axiosInstance.post(
      "/auth/tokenRefresh",
      { refresh: refreshToken },
      { withCredentials: true }
    );

    console.log("Token refresh response:", response.data);

    if (response.data?.success) {
      const newAccessToken = response.data.data.token;
      const newRefreshToken = response.data.data.refresh;

      console.log("New tokens received. Updating storage.");

      localStorage.setItem("accessToken", newAccessToken);
      document.cookie = `refreshToken=${newRefreshToken}; path=/; secure; samesite=strict`;

      setToken(newAccessToken);
      return newAccessToken;
    } else {
      console.warn("Failed to refresh token. Logging out.");
      handleLogout();
      return null;
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    handleLogout();
    return null;
  }
};
