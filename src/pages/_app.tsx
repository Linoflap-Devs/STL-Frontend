import { AppProps } from "next/app";
import { ThemeProvider, CssBaseline, CircularProgress, Box } from "@mui/material";
import Layout from "../layout";
import darkTheme from "../styles/theme";
import { useEffect, useState } from "react";
import "../styles/globals.css";
import { useRouter } from "next/router";

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  const excludedPaths = [
    "/",
    "/auth/login",
  ];

  const layoutExcludedPaths = [
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
      {layoutExcludedPaths.includes(router.pathname) ? (
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
// import { AppProps } from "next/app";
// import { useRouter } from "next/router";
// import { ThemeProvider, CssBaseline, CircularProgress, Box } from "@mui/material";
// import Layout from "../layout";
// import darkTheme from "../styles/theme";
// import { useEffect, useState } from "react";
// import { checkUserAuth } from "~/hooks/useAuth";
// import "../styles/globals.css";

// const App = ({ Component, pageProps }: AppProps) => {
//   const router = useRouter();
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

//   const excludedPaths = [
//     "/",
//     "/auth/login",
//   ];

//   const layoutExcludedPaths = [
//     "/",
//     "/auth/login",
//     "/auth/forgot-password",
//     "/auth/email-verification",
//     "/auth/password-reset",
//     "/auth/set-password",
//   ];

//   const isExcludedPath = excludedPaths.includes(router.pathname);

//   useEffect(() => {
//     const checkAuthStatus = async () => {
//       const userData = await checkUserAuth();
//       if (userData === null) {
//         router.push("/auth/login");
//       } else {
//         setIsAuthenticated(true);
//       }
//     };

//     if (!isExcludedPath) {
//       checkAuthStatus();
//     } else {
//       setIsAuthenticated(true);
//     }
//   }, [router.pathname]);

//   if (isAuthenticated === null) {
//     return (
//       <ThemeProvider theme={darkTheme}>
//         <CssBaseline />
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             height: "100vh",
//           }}
//         >
//           <CircularProgress color="primary" />
//         </Box>
//       </ThemeProvider>
//     );
//   }

//   return (
//     <ThemeProvider theme={darkTheme}>
//       <CssBaseline />
//       {layoutExcludedPaths ? (
//         <Component {...pageProps} />
//       ) : (
//         <Layout>
//           <Component {...pageProps} />
//         </Layout>
//       )}
//     </ThemeProvider>
//   );
// };

// export default App;

