import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { refreshAccessToken } from "./useRefreshToken";
import { isTokenExpired } from "../utils/tokenUtils";

export const useTokenRefresher = (
    handleLogout: () => void,
    setToken: (token: string | null) => void
  ) => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setLocalToken] = useState<string | null>(null);
    const router = useRouter();
  
    useEffect(() => {
      const refresh = async () => {
        const storedToken = localStorage.getItem("accessToken");
  
        if (!storedToken || isTokenExpired(storedToken)) {
          console.warn("No valid token found. Logging out...");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
  
          if (router.pathname !== "/auth/login") {
            await router.push("/auth/login");
          }
          
          setIsAuthenticated(false);
          return;
        }
  
        if (isRefreshing) return;
        setIsRefreshing(true);
  
        try {
          await refreshAccessToken(handleLogout, setToken);
          setIsAuthenticated(true);
          setLocalToken(storedToken);
        } catch (error) {
          console.error("Token refresh failed:", error);
          setIsAuthenticated(false);
        } finally {
          setIsRefreshing(false);
        }
      };
  
      refresh();
      const interval = setInterval(refresh, 60 * 1000);
      return () => clearInterval(interval);
    }, [handleLogout, setToken, isRefreshing, router.pathname]);
  
    return { isRefreshing, isAuthenticated, token };
  };
  