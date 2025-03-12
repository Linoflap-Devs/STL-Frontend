import { AppProps } from "next/app";
import { ThemeProvider, CssBaseline, CircularProgress, Box } from "@mui/material";
import Layout from "../layout";
import darkTheme from "../styles/theme";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../utils/api/auth";
import "../styles/globals.css";

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

    getCurrentUser({})
      .then((data) => {
        if (data.success) {
          console.log("Authenticated user:", data);
          setLoading(false);
        } else {
          throw new Error("No valid auth found!");
        }
      })
      .catch(() => {
        console.log("No valid auth found! Redirecting to login...");
        router.replace("/auth/login");
      });
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
