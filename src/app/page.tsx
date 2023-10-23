'use client';
import dynamic from 'next/dynamic';

const MysteryBox = dynamic(() => import('@/components/MysteryBox/index'), {
  loading: () => <p>SomeThing Loading...</p>,
});

export default function HomePage() {
  return (
    <main className="absolute z-10 top-0 w-screen h-screen">
      <MysteryBox />
    </main>
  );
}
