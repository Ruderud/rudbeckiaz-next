import dynamic from 'next/dynamic';

export const runtime = 'edge';

const ConcertHall = dynamic(() => import('@/components/ConcertHall'), {
  loading: () => <p>ConcertHall Loading...</p>,
});

export default function AboutPage() {
  return <ConcertHall />;
}
