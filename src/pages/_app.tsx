import { AppProps } from 'next/app';
import Layout from '../layout';
import { useRouter } from 'next/router';

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  const excludedPaths = ['/']; // if 2 or more paths exclusions
  const exludedPaths = excludedPaths.includes(router.pathname);

  if (exludedPaths) {
    return <Component {...pageProps} />;
  } // skipping the layout. conditional rendering

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout> 
  );
};

export default App;
