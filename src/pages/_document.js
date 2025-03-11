import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html className="dark">
      <Head>
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap" 
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}