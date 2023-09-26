'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Minecraft from '../components/Mincraft';
import { Button } from '@/components/Ui/Button';

export default function PlayPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const roomId = searchParams.get('room');
  return (
    <main className="absolute top-0 w-screen h-screen">
      <div className="absolute z-10 top-20 left-5">
        <p>{`RoomId: ${roomId && 'soloPlay'}`}</p>
        <Button
          color="blue"
          onClick={() => {
            router.push('/experimentals');
          }}
        >
          Exit
        </Button>
      </div>
      <Minecraft />
    </main>
  );
}
