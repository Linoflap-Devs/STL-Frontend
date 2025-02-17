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
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  
  const excludedPaths = [
    "/",
    "/auth/login",
    "/forgot-password",
    "/email-verification",
    "/password-reset",
    "/set-password",
    "/unauthorized",
  ];

  const isExcludedPath = excludedPaths.includes(router.pathname);

  useEffect(() => {
    if (token === null) {
      setLoading(true);
    } else if (!isExcludedPath && !token) {
      console.warn("No token found, redirecting to login...");
      router.push("/auth/login");
    } else {
      setLoading(false);
      setIsAuthChecked(true);
    }
  }, [token, isExcludedPath]);
  
  if (!isExcludedPath && loading && !isAuthChecked) {
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