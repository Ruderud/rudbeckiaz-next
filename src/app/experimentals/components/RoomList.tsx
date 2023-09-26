'use client';

import { useContext, useRef } from 'react';
import { InitialRoomsData, useGetRoomsQuery } from '../hooks/useGetRoomsQuery';
import { Button } from '@/components/Ui/Button';
import { CreateRoomDialog } from './CreateRoomDialog';
import { MinecraftContext } from '../providers';
import { useRouter } from 'next/navigation';

type RoolListProps = {
  initialRoomsData?: InitialRoomsData;
};

export const RoomList = ({ initialRoomsData }: RoolListProps) => {
  const { signalingChannel } = useContext(MinecraftContext);
  const { data } = useGetRoomsQuery(initialRoomsData);
  const router = useRouter();

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

              <Button
                color="blue"
                textSize="sm"
                disabled={signalingChannel === null}
                onClick={() => {
                  router.push(`/experimentals/play?room=${room.id}`);
                }}
              >
                JOIN
              </Button>
            </li>
          );
        })}
      </ol>

      <div>
        <Button color="green" disabled={signalingChannel === null} onClick={handleDialogOpen}>
          Create Room
        </Button>
      </div>

      <CreateRoomDialog ref={dialogRef} handleDialogClose={handleDialogClose} />
    </div>
  );
};
