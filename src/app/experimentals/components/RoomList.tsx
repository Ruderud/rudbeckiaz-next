'use client';

import { useRef } from 'react';
import { InitialRoomsData, useGetRoomsQuery } from '../hooks/useGetRoomsQuery';
import { Button } from '@/components/Ui/Button';
import { CreateRoomDialog } from './CreateRoomDialog';
import { useRouter } from 'next/navigation';
import { css } from 'twin.macro';

type RoolListProps = {
  initialRoomsData?: InitialRoomsData;
};

export const RoomList = ({ initialRoomsData }: RoolListProps) => {
  const { data } = useGetRoomsQuery(initialRoomsData);
  const router = useRouter();

  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleDialogOpen = () => dialogRef.current?.showModal();
  const handleDialogClose = () => dialogRef.current?.close();

  return (
    <div className="flex flex-col grow p-4 gap-4 bg-slate-700 bg-opacity-50">
      <div className="text-2xl font-bold">ONLINE ROOMS</div>

      <table className="table-auto">
        <colgroup>
          <col
            css={css({
              width: '20%',
            })}
          />
          <col
            css={css({
              width: '55%',
            })}
          />
          <col
            css={css({
              width: '25%',
            })}
          />
        </colgroup>

        <thead>
          <tr className="[&>th]:pl-2">
            <th align="left">PLAYERS</th>
            <th align="left">ROOM NAME</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {data.Items.map((room) => {
            return (
              <tr
                className="[&>td]:p-2 odd:bg-slate-600 even:bg-slate-700 hover:outline hover:outline-2 hover:outline-green-300"
                key={room.id}
              >
                <td className="font-bold">2/4</td>
                <td>{room.roomName}</td>

                <td align="center">
                  <Button
                    variant="primary"
                    className="font-bold text-sm"
                    onClick={() => {
                      router.push(`/experimentals/play?room=${room.id}`);
                    }}
                  >
                    JOIN
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div>
        <Button className="bg-green-500 font-bold" onClick={handleDialogOpen}>
          Create Room
        </Button>
      </div>

      <CreateRoomDialog ref={dialogRef} handleDialogClose={handleDialogClose} />
    </div>
  );
};
