// src\utils\auth.ts

export async function getUser() {
    try {
      const response = await fetch("/users/getUsers", {
        credentials: "include",
      });
  
      if (!response.ok) throw new Error("Unauthorized");
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  }
  
  export async function logout() {
    await fetch("/logout", {
      method: "POST",
      credentials: "include",
    });
  
    window.location.href = "/auth/login"; // Redirect to login
  }
  