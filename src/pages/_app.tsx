// pages/_app.tsx
import App, { AppProps, AppContext } from "next/app";
import {
  ThemeProvider,
  CssBaseline,
  CircularProgress,
  Box,
} from "@mui/material";
import Layout from "../layout";
import darkTheme from "../styles/theme";
import "../styles/globals.css";
import axiosInstance from "../utils/axiosInstance";
import { getCurrentUser } from "../utils/api/auth";
import Router from "next/router";
import { useEffect, useState } from "react";

const excludedPaths = [
  "/",
  "/auth/login",
  "/auth/forgot-password",
  "/auth/email-verification",
  "/auth/password-reset",
  "/auth/set-password",
];

function MyApp({ Component, pageProps, router, isAuthenticated }: AppProps & { isAuthenticated: boolean }) {
  const isExcludedPath = excludedPaths.includes(router.pathname);
  const [loading, setLoading] = useState(!isAuthenticated && !isExcludedPath);

  useEffect(() => {
    if (!isAuthenticated && !isExcludedPath) {
      Router.replace("/auth/login");
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, isExcludedPath]);

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
}

// Runs on server & client during navigation
MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  const ctx = appContext.ctx;
  const isExcludedPath = excludedPaths.includes(ctx.pathname);
  let isAuthenticated = false;

  if (isExcludedPath) {
    return { ...appProps, isAuthenticated: true };
  }

  try {
    const response = await getCurrentUser({ req: ctx.req }); // Make sure getCurrentUser uses `axiosInstance` and forwards cookies on server
    if (response?.success) {
      isAuthenticated = true;
    }
  } catch {
    isAuthenticated = false;
  }

  return { ...appProps, isAuthenticated };
};

export default MyApp;
