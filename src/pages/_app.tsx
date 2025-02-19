import { AppProps } from "next/app";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import Layout from "../layout";
import darkTheme from "../styles/theme";
import "../styles/globals.css";
import { useRouter } from "next/router";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const { token, user } = useAuth();

  const excludedPaths = [
    "/",
    "/auth/login",
    "/auth/forgot-password",
    "/auth/email-verification",
    "/auth/password-reset",
    "/auth/set-password",
  ];

  const isExcludedPath = excludedPaths.includes(router.pathname);


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