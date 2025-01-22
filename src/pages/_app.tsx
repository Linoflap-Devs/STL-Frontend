import { AppProps } from 'next/app';
import Layout from '../layout';
import { useRouter } from 'next/router';
import Head from 'next/head';
import '../globals.css';

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  const excludedPaths = ['/']; // paths to exclude from layout
  const isExcludedPath = excludedPaths.includes(router.pathname || 'Not available');

  if (isExcludedPath) {
    return <Component {...pageProps} />;
  }

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Euclid+Circular+B:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
};

export default App;
