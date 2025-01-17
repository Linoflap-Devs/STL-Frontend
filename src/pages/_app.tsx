// Main entry - how can i render users page to the main entry?

import Layout from '../layout';
import '../globals.css';

function MyApp({ Component, pageProps }: { Component: any, pageProps: any }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;

