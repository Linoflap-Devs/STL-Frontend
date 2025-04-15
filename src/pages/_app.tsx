import { AppProps } from "next/app";
import { ThemeProvider, CssBaseline, CircularProgress, Box } from "@mui/material";
import Layout from "../layout";
import darkTheme from "../styles/theme";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../utils/api/auth";
import "../styles/globals.css";
import axiosInstance, { isRefreshing, refreshSubscribers } from "../utils/axiosInstance";

const excludedPaths = [
  "/",
  "/auth/login",
  "/auth/forgot-password",
  "/auth/email-verification",
  "/auth/password-reset",
  "/auth/set-password",
];

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const isExcludedPath = excludedPaths.includes(router.pathname);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Helper function to wait for the refresh process to finish if it's already in progress
  const waitUntilNotRefreshing = () =>
    new Promise<void>((resolve) => {
      if (!isRefreshing) return resolve();

      const interval = setInterval(() => {
        if (!isRefreshing) {
          clearInterval(interval);
          resolve();
        }
      }, 100); // Check every 100ms
    });

  useEffect(() => {
    if (isExcludedPath) {
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        await waitUntilNotRefreshing();

        console.log("Checking authentication status...");
        const data = await getCurrentUser({});
        if (data?.success) {
          console.log("Authenticated user:", data);
          setUser(data.data); // Set user data
          setLoading(false);
          return;
        }

        throw new Error("No valid auth found!");
      } catch (error: any) {
        if (error.response?.status === 403 && error.response?.data?.message === "Token expired.") {
          console.log("Token expired, waiting for refresh...");

          // Wait until the refresh process is completed
          await new Promise<void>((resolve) => refreshSubscribers.push(() => resolve()));

          try {
            const data = await getCurrentUser({});
            if (data?.success) {
              console.log("Authenticated user (after refresh):", data);
              setUser(data.data);
              setLoading(false);
              return;
            }
          } catch (retryError) {
            console.log("No valid auth found after refresh! Redirecting to login...");
            router.replace("/auth/login");
          }
        } else {
          console.log("No valid auth found! Redirecting to login...");
          router.replace("/auth/login");
        }
      }
    };

    // Initial authentication check
    checkAuth();

    const refreshInterval = setInterval(() => {
      console.log("Refreshing token...");
      axiosInstance.post("/auth/tokenRefresh", {}, { withCredentials: true });
    }, 60000); // 1 minute = 60,000 ms

    // Cleanup interval on unmount or path change
    return () => clearInterval(refreshInterval);

  }, [isExcludedPath, router]);

  if (loading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {isExcludedPath ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </ThemeProvider>
  );
};

export default App;
