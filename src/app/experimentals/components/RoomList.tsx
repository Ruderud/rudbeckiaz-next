'use client';

import { ErrorBoundary } from 'react-error-boundary';
import { Suspense, useRef } from 'react';
import { InitialRoomsData, getRooms, useGetRoomsQuery } from '../hooks/useGetRoomsQuery';
import { Button } from '@/components/Ui/Button';
import { CreateRoomDialog } from './CreateRoomDialog';

type Room = {
  id: string;
  roomName: string;
  host: string;
};

type RoolListProps = {
  initialRoomsData?: InitialRoomsData;
};

export const RoomList = ({ initialRoomsData }: RoolListProps) => {
  const { data } = useGetRoomsQuery(initialRoomsData);

  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleDialogOpen = () => dialogRef.current?.showModal();
  const handleDialogClose = () => dialogRef.current?.close();

  return (
    <div className="flex flex-col grow ">
      <div className="text-2xl">ONLINE ROOMS</div>

      <ol>
        {data?.Items.map((room) => {
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

      <div>
        <Button color="green" onClick={handleDialogOpen}>
          Create Room
        </Button>
      </div>

      <CreateRoomDialog ref={dialogRef} handleDialogClose={handleDialogClose} />
    </div>
  );
};
