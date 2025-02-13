// src/pages/_app.tsx

import { AppProps } from 'next/app';
import Layout from '../layout';
import { useRouter } from 'next/router';
import '../styles/globals.css';
import { ThemeProvider, CssBaseline } from '@mui/material';
import darkTheme from '../styles/theme';

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  const excludedPaths = ['/auth/login', '/forgot-password', '/email-verification', '/password-reset', '/set-password'];
  const isExcludedPath = excludedPaths.includes(router.pathname || 'Not available');

  if (isExcludedPath) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
};

export default App;