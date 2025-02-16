import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { ThemeProvider, CssBaseline } from "@mui/material";
import Layout from "../layout";
import darkTheme from "../styles/theme";
import "../styles/globals.css";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    if (!token && !isPublicPath) {
      console.warn("No token found, redirecting to login...");
      router.replace("/auth/login");
    } else if (token) {
      console.warn("User is authenticated, redirecting to dashboard...");
      router.replace("/");
    } else {
      setLoading(false);
      setIsAuthChecked(true);
    }
  }, [token, isPublicPath]);

  // Show null until authentication is checked
  if (loading && !isAuthChecked) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        {null}
      </ThemeProvider>
    );
  }

  if (token) {
    return null;
  }

  if (!token && !isPublicPath) {
    return null;
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