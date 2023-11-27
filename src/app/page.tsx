import { Metadata } from 'next';
import dynamic from 'next/dynamic';
const MysteryBox = dynamic(() => import('@/components/MysteryBox'), { ssr: false });

export const metadata: Metadata = {
  title: 'Rud',
  description: 'There must be something',
};

export default function HomePage() {
  return (
    <main className="absolute z-10 top-0 w-screen h-screen">
      <MysteryBox />
    </main>
  );
}
