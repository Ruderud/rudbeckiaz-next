import './globals.css';
import { Inter } from 'next/font/google';
import { TopBar } from '@/components/TopBar';
import { Metadata } from 'next';
import { GlobalContextProvider } from 'context/GlobalContext';
import { Background } from '@/components';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Rud',
  description: 'There must be something',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="dark">
      <GlobalContextProvider>
        <body className={`${inter.className} relative bg-white dark:bg-black text-black dark:text-white`}>
          <Background>
            <TopBar />
            {children}
          </Background>
        </body>
      </GlobalContextProvider>
    </html>
  );
}
