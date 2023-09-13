import './globals.css';
import { Inter } from 'next/font/google';
import { TopBar } from '@/components/TopBar';
import Head from 'next/head';
import { GlobalContextProvider } from 'context/GlobalContext';
// import { Background } from '@/components';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Rud',
  description: 'There must be something',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="dark">
      <Head>
        <title>Rud</title>
        <meta name="og:title" content="width=device-width, initial-scale=1" />
      </Head>
      <GlobalContextProvider>
        <body className={`${inter.className} relative bg-white dark:bg-black text-black dark:text-white`}>
          {/* <Background> */}
          <TopBar />
          {children}
          {/* </Background> */}
        </body>
      </GlobalContextProvider>
    </html>
  );
}
