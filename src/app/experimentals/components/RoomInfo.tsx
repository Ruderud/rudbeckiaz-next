'use client';

import { useEffect } from 'react';
import useHash from '../hooks/useHash';

export const RoomInfo = () => {
  const hash = useHash();

  useEffect(() => {
    console.log(hash);
  }, [hash]);

  return (
    <div className="flex justify-between bg-slate-700 bg-opacity-50 p-4 h-full">
      <header className="flex gap-4 items-baseline">
        <span className="text-2xl font-bold">ROOM INFO</span>
        <span className="text-md">{`${hash}`}</span>
      </header>
    </div>
  );
};
