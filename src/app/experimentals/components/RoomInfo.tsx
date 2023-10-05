'use client';

import Image from 'next/image';
import { useGetRoomInfoQuery } from '../hooks/useGetRoomInfoQuery';
import useHash from '../hooks/useHash';
import { Button } from '@/components/Ui/Button';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export const RoomInfo = () => {
  const hash = useHash();
  const router = useRouter();
  const { data } = useGetRoomInfoQuery({ id: hash });

  const handleJoinButtonClick = useCallback(() => {
    router.push(`/experimentals/play?room=${hash}`);
  }, [hash, router]);

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
          <p className="text-lg font-bold">{data?.Item.roomName}</p>
        </span>

        <span className="flex flex-col items-center">
          <p className="text-sm">Host</p>
          <p className="text-lg font-bold">{`${data?.Item.host.userName}${data?.Item.host.nameCode}`}</p>
        </span>

        <div className="grid grid-rows-2 grid-cols-2 gap-2">
          <p>Players</p>
          <p>2/4</p>
          <p>CreatedAt</p>
          <p>{calculateTimeDifference(data?.Item.createdAt)}</p>
        </div>
      </article>

      <Button variant="primary" onClick={handleJoinButtonClick}>
        JOIN
      </Button>
    </div>
  );
};

function calculateTimeDifference(isoDateString: string | undefined) {
  if (!isoDateString) return 'unknown';
  // 주어진 날짜 문자열을 Date 객체로 변환
  const isoDate = new Date(isoDateString);

  // 현재 시간을 가져오기
  const currentDate = new Date();

  // 두 날짜 사이의 시간 차이(밀리초) 계산
  const timeDifference = currentDate.getTime() - isoDate.getTime();

  // 시간 차이를 초, 분, 시간, 일로 변환
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return `${seconds}초 전`;
  } else if (minutes < 60) {
    return `${minutes}분 전`;
  } else if (hours < 24) {
    return `${hours}시간 전`;
  } else {
    // 날짜를 YYYY-MM-DD 형식으로 포맷팅
    const year = isoDate.getFullYear();
    const month = String(isoDate.getMonth() + 1).padStart(2, '0');
    const day = String(isoDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
