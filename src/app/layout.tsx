import './globals.css';
import { Inter } from 'next/font/google';
import Head from 'next/head';

import { TopBar } from '@/components';
import { GlobalContextProvider } from 'context/GlobalContext';
import { Background } from '@/components/Background';
import StyledComponentsRegistry from '@/lib/StyledComponentsRegistry';
import { Metadata } from 'next';

export const runtime = 'edge';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
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
          <StyledComponentsRegistry>
            {/* <Background> */}
            <TopBar />
            {children}
            {/* </Background> */}
          </StyledComponentsRegistry>
        </body>
      </GlobalContextProvider>
    </html>
  );
}
