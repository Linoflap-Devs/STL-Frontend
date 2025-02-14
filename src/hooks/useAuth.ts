import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { isTokenExpired } from "../utils/tokenUtils";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    console.log("Checking authentication status...");

    const storedToken = localStorage.getItem("accessToken");
    console.log("Token retrieved:", storedToken);

    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    if (storedToken && !isTokenExpired(storedToken)) {
      setToken(storedToken);
      setUser(parsedUser);
    } else {

      console.warn("No valid token found or token expired, redirecting to login...");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
      router.push("/auth/login");
    }
  }, [router]);

  return { token, user };
}
