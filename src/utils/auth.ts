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
    await axiosInstance.post("/logout", null, {
      withCredentials: true,
    });

    // Remove cookies by setting them to expire
    document.cookie = "accessToken=; Max-Age=0; path=/;";
    document.cookie = "refreshToken=; Max-Age=0; path=/;";

    window.location.href = "/auth/login";
  } catch (error) {
    console.error("Logout error:", error);
  }
}

