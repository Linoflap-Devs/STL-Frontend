import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { ThemeProvider, CssBaseline } from "@mui/material";
import Layout from "../layout";
import darkTheme from "../styles/theme";
import "../styles/globals.css";
import { useAuth } from "../hooks/useAuth";

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const user = useAuth(); // Handles auth & redirects

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

  // Only show loading on protected pages
  if (!isExcludedPath && user === undefined) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
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
