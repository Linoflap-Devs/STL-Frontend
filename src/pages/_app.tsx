import React from 'react';
import { AppProps } from 'next/app';
import Layout from '../layout';
import { useRouter } from 'next/router';

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  if (router.pathname === '/login') {
    return <Component {...pageProps} />;
  }

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>

  );
};

export default App;
