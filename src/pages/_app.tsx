import { AppProps } from "next/app";
import { ThemeProvider, CssBaseline, CircularProgress, Box } from "@mui/material";
import Layout from "../layout";
import darkTheme from "../styles/theme";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../utils/api/auth";
import "../styles/globals.css";
import { refreshSubscribers } from "../utils/axiosInstance";

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

  useEffect(() => {
    if (isExcludedPath) {
      setLoading(false);
      return;
    }

    console.log("Checking authentication status...");

    const checkAuth = async () => {
      try {
        const data = await getCurrentUser({});
        if (data?.success) {
          console.log("Authenticated user:", data);
          setLoading(false);
          return;
        }
        throw new Error("No valid auth found!");
      } catch (error: any) {
        if (error.response?.status === 403 && error.response?.data?.message === "Token expired.") {
          console.log("Token expired, waiting for refresh...");

          // Wait for the interceptor to complete token refresh
          await new Promise<void>((resolve) => refreshSubscribers.push(() => resolve()));

          // Retry getCurrentUser after refresh
          try {
            const data = await getCurrentUser({});
            if (data?.success) {
              console.log("Authenticated user (after refresh):", data);
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

    checkAuth();
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
