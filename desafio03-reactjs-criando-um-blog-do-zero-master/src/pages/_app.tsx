import { AppProps } from 'next/app';
import { Inter } from '@next/font/google';

import '../styles/globals.scss';

const inter = Inter({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
});

export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <main className={inter.className}>
      <Component {...pageProps} />
    </main>
  );
}
