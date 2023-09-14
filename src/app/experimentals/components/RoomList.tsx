'use client';

import { ErrorBoundary } from 'react-error-boundary';
import { useGetRoomsQuery } from '../hooks/useGetRoomsQuery';
import { Button } from './Button';

export const RoomList = () => {
  const { data } = useGetRoomsQuery();
  return (
    <ErrorBoundary fallback={<div>Now Error!!</div>}>
      <ol>
        {data.Items.map((room) => {
          return (
            <li className="flex grow-1 justify-between items-center" key={room.id}>
              {room.roomName}
              <Button color="blue" textSize="sm">
                JOIN
              </Button>
            </li>
          );
        })}
      </ol>
    </ErrorBoundary>
  );
};
