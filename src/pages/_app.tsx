import React from 'react';
import { AppProps } from 'next/app';
import Layout from '../layout';
import { useRouter } from 'next/router';

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  const isLoginPage = router.pathname === '/'; // will render the login page only

  if (isLoginPage) {
    return <Component {...pageProps} />;
  }

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default App;
