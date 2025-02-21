import { AppProps } from "next/app";
import { ThemeProvider, CssBaseline } from "@mui/material";
import Layout from "../layout";
import darkTheme from "../styles/theme";
import { useRouter } from "next/router";
import { useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
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

  useEffect(() => {
    if (isExcludedPath) return;

    console.log("Checking authentication status...");
    
    axiosInstance
      .get("/users/getCurrentUser", { withCredentials: true })
      .then((response: { data: any; }) => {
        console.log("Authenticated user:", response.data);
      })
      .catch(() => {
        console.log("No valid auth found! Redirecting to login...");
        router.replace("/auth/login");
      });
  }, [router.pathname]);

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