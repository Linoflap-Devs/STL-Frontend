import { AppProps } from 'next/app';
import Layout from '../layout';
import { useRouter } from 'next/router';
import '../globals.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  const excludedPaths = ['/', '/users']; // paths to exclude from layout
  const isExcludedPath = excludedPaths.includes(router.pathname || 'Not available');

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: '#252526',
        paper: '#1e1e1e',
      },
      text: {
        primary: '#ffffff',
        secondary: '#b0b0b0',
      },
    },
    typography: {
      fontFamily: '"Inter", sans-serif',
    },
  });

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
