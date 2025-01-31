import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import '../styles/globals.css';
import { ThemeProvider, CssBaseline } from '@mui/material';
import darkTheme from '../styles/theme';
import AdminHeader from '../components/layout/AdminHeader';

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  const excludedPaths = ['/', '/forgot-password', '/email-verification',];
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
      <div>
        <AdminHeader pages={[]} />
        <main>
          <Component {...pageProps} />
        </main>
        <footer style={{ padding: '2rem' }}>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default App;
