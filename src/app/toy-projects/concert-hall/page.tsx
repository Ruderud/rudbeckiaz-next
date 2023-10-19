import dynamic from 'next/dynamic';

const ConcertHall = dynamic(() => import('@/components/ConcertHall'), {
  loading: () => <p>ConcertHall Loading...</p>,
});

export default function AboutPage() {
  return <ConcertHall />;
}
