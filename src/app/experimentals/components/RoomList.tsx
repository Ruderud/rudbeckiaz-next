'use client';

import { ErrorBoundary } from 'react-error-boundary';
import { Suspense, useCallback, useRef, useState } from 'react';
import { InitialRoomsData, getRooms, useGetRoomsQuery } from '../hooks/useGetRoomsQuery';
import { Button } from '@/components/Ui/Button';
import { CreateRoomDialog } from './CreateRoomDialog';
import { SignalingChannel } from '../utils';

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
  const [signalingChannel, setSignalingChannel] = useState<SignalingChannel | null>(null);

  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleDialogOpen = () => dialogRef.current?.showModal();
  const handleDialogClose = () => dialogRef.current?.close();

  const createSignalingChannel = useCallback(() => {
    const baseUrl = String(process.env.NEXT_PUBLIC_WS_SERVER_BASE_URL);
    const channel = new SignalingChannel({
      signalingUrl: baseUrl,
      pathname: '/dev',
      onMessage: (MessageEvent: MessageEvent) => {
        console.log('MessageEvent', MessageEvent);
      },
    });

    setSignalingChannel(channel);
  }, []);

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
                onClick={() => {
                  signalingChannel?.send({
                    foo: 'bar',
                  });
                }}
              >
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
        <Button color="blue" textSize="sm" onClick={createSignalingChannel}>
          Signal Channel
        </Button>
      </div>

      <CreateRoomDialog ref={dialogRef} handleDialogClose={handleDialogClose} />
    </div>
  );
};
