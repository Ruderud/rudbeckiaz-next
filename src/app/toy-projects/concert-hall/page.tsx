import Link from 'next/link';
import { Suspense, lazy } from 'react';
const ConcertHall = lazy(() => import('@/components/ConcertHall'));

export default function AboutPage() {
  return (
    <Suspense fallback={<div>ConcertHall Loading...</div>}>
      <ConcertHall />
    </Suspense>
  );
}
