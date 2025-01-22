import { AppProps } from 'next/app';
import Layout from '../layout';
import { useRouter } from 'next/router';
import '../globals.css';

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  const excludedPaths = ['/', '/admin']; // paths to exclude from layout
  const isExcludedPath = excludedPaths.includes(router.pathname || 'Not available');

  if (isExcludedPath) {
    return <Component {...pageProps} />;
  }

  return (
    <>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
};

export default App;
