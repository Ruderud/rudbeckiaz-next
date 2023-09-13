'use client';

import { ErrorBoundary } from 'react-error-boundary';
import { useGetRoomsQuery } from '../hooks/useGetRoomsQuery';

export const RoomList = () => {
  const { data } = useGetRoomsQuery();
  return (
    <ErrorBoundary fallback={<div>Now Error!!</div>}>
      <ol>
        {data.Items.map((room) => {
          return <li key={room.id}>{room.roomName}</li>;
        })}
      </ol>
    </ErrorBoundary>
  );
};
