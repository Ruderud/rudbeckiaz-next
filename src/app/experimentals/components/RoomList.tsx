'use client';

import { ErrorBoundary } from 'react-error-boundary';
import { useGetRoomsQuery } from '../hooks/useGetRoomsQuery';
import { Button } from './Button';
import { Suspense } from 'react';

export const RoomList = () => {
  const { data } = useGetRoomsQuery();
  return (
    <ErrorBoundary fallback={<div>Now Error!!</div>}>
      <Suspense fallback={<div>Loading...</div>}>
        <ol>
          {data.Items.map((room) => {
            return (
              <li className="flex grow-1 justify-between items-center p-1" key={room.id}>
                <div className="font-bold">{room.roomName}</div>
                <Button color="blue" textSize="sm">
                  JOIN
                </Button>
              </li>
            );
          })}
        </ol>
      </Suspense>
    </ErrorBoundary>
  );
};
