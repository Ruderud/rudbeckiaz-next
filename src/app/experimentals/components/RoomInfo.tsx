'use client';

import Image from 'next/image';
import { useGetRoomInfoQuery } from '../hooks/useGetRoomInfoQuery';
import useHash from '../hooks/useHash';
import { Button } from '@/components/Ui/Button';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import calcTimeDiff from '../utils/calcTimeDiff';

const RoomInfo = () => {
  const hash = useHash();
  const router = useRouter();
  const { data } = useGetRoomInfoQuery({ id: hash });

  const handleJoinButtonClick = useCallback(() => {
    router.push(`/experimentals/play?room=${hash}`);
  }, [hash, router]);

  if (!data) return EmptyRoomInfo();

  return (
    <div className="flex flex-col gap-4 bg-slate-700 bg-opacity-50 p-4 h-full">
      <header className="flex gap-4 items-baseline">
        <span className="text-2xl font-bold">ROOM INFO</span>
        <span className="text-md">{`${hash}`}</span>
      </header>

      <article className="flex flex-col items-center grow gap-4">
        <Image src="https://via.placeholder.com/300x300" alt="room thumbnail" width={300} height={300} />

        <span className="flex flex-col items-center">
          <p className="text-sm">Room Name</p>
          <p className="text-lg font-bold">{data.Item.roomName}</p>
        </span>

        <span className="flex flex-col items-center">
          <p className="text-sm">Host</p>
          <p className="text-lg font-bold">{`${data.Item.host.userName}${data.Item.host.nameCode}`}</p>
        </span>

        <div className="grid grid-rows-2 grid-cols-2 gap-2">
          <p>Players</p>
          <p>2/4</p>
          <p>CreatedAt</p>
          <p>{calcTimeDiff(data.Item.createdAt)}</p>
        </div>
      </article>

      <Button variant="primary" onClick={handleJoinButtonClick}>
        JOIN
      </Button>
    </div>
  );
};

const EmptyRoomInfo = () => {
  return (
    <div className="flex flex-col gap-4 bg-slate-700 bg-opacity-50 p-4 h-full">
      <header className="flex gap-4 items-baseline">
        <span className="text-2xl font-bold">ROOM INFO</span>
      </header>

      <article className="flex align-center justify-center items-center grow gap-4">
        <p className="text-lg font-bold">Not Selected</p>
      </article>
    </div>
  );
};

const RoomInfoSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 bg-slate-700 bg-opacity-50 p-4 h-full">
      <header className="flex gap-4 items-baseline">
        <span className="text-2xl font-bold">ROOM INFO</span>
        <span role="status" className="animate-pulse bg-gray-200 rounded dark:bg-gray-700 w-48 h-4"></span>
      </header>

      <article className="flex flex-col items-center grow gap-4">
        <Image src="https://via.placeholder.com/300x300" alt="room thumbnail" width={300} height={300} />

        <span className="flex flex-col items-center">
          <p className="text-sm">Room Name</p>
          <p role="status" className="animate-pulse bg-gray-200 rounded dark:bg-gray-700 w-48 h-4"></p>
        </span>

        <span className="flex flex-col items-center">
          <p className="text-sm">Host</p>
          <p role="status" className="animate-pulse bg-gray-200 rounded dark:bg-gray-700 w-48 h-4"></p>
        </span>

        <div className="grid grid-rows-2 grid-cols-2 gap-2">
          <p>Players</p>
          <p role="status" className="animate-pulse bg-gray-200 rounded dark:bg-gray-700 w-48 h-4"></p>
          <p>CreatedAt</p>
          <p role="status" className="animate-pulse bg-gray-200 rounded dark:bg-gray-700 w-48 h-4"></p>
        </div>
      </article>

      <Button variant="primary" disabled>
        JOIN
      </Button>
    </div>
  );
};

export { RoomInfo, RoomInfoSkeleton };
