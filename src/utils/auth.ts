// src\utils\auth.ts in the frontend

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
  
  // src\utils\auth.ts in the frontend. this is on another page
  export async function logout() {
    await fetch("/logout", {
      method: "POST",
      credentials: "include",
    });
  
    window.location.href = "/"; // Redirect to login
  }
  