import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axiosInstance from "../utils/axiosInstance";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    console.log("Checking authentication status...");

    const storedToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    if (storedToken) {
      setToken(storedToken);
      setUser(parsedUser);
    } else {
      console.warn("No valid token found, clearing session...");
      clearSession();
    }
  }, []);

  function clearSession() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("tokenExpiration");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    //router.replace("/auth/login"); // commented this because of duplicate redirection on _app.
  }

  return { token, user };
}
