import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { ThemeProvider, CssBaseline } from "@mui/material";
import Layout from "../layout";
import darkTheme from "../styles/theme";
import "../styles/globals.css";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import axiosInstance, { AxiosError } from "axios";
import { useTokenRefresher } from "../hooks/useTokenRefresher";

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const publicPaths = ["/auth/login", "/"];
  const noLayout = [
    "/auth/forgot-password",
    "/auth/email-verification",
    "/auth/password-reset",
    "/auth/set-password",
    "/auth/unauthorized",
  ];

  const isPublicPath = publicPaths.includes(router.pathname);
  const isNoLayoutPath = noLayout.includes(router.pathname);

  useTokenRefresher();

  useEffect(() => {
    const checkAuth = async () => {
      if (!token && !isPublicPath) {
        console.warn("No token found, redirecting...");
        router.replace("/auth/login");
        return;
      }
  
      if (token) {
        try {
          await axiosInstance.get("/dashboard");
          console.warn("User is authenticated, staying on page...");
        } catch (error) {
          const axiosError = error as AxiosError;
          if (axiosError.response?.status === 401) {
            console.warn("Token expired, waiting for refresh...");
            return;
          }
        }
      }

      setLoading(false);
      setIsAuthChecked(true);
    };
  
    checkAuth();
  }, [token, isPublicPath]);

  if (loading && !isAuthChecked) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        {null}
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {isNoLayoutPath ? (
        <Component {...pageProps} />
      ) : isPublicPath ? (
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
