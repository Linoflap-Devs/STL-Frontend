import axiosInstance from "./axiosInstance";

export async function getUser() {
  try {
    const response = await axiosInstance.get("/users/getUsers");
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
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
