'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const MysteryBox = dynamic(() => import('@/components/MysteryBox/index'));

export default function HomePage() {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const onClick = () => {
    setIsClicked(true);
  };

  return (
    <main className="absolute z-10 top-0 w-screen h-screen">
      {isClicked ? (
        <MysteryBox />
      ) : (
        <button className="absolute left-[50%] top-[50%]" onClick={onClick}>
          Click
        </button>
      )}
    </main>
  );
}
