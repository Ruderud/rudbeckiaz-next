'use client';

import { useRef } from 'react';
import { InitialRoomsData, useGetRoomsQuery } from '../hooks/useGetRoomsQuery';
import { Button } from '@/components/Ui/Button';
import { CreateRoomDialog } from './CreateRoomDialog';
import { useRouter } from 'next/navigation';
import { css } from 'twin.macro';
import { ReFresh } from '@/components/Icon/Refresh';
import { TestComp } from './TestComp';

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
      <header className="flex gap-4 items-baseline">
        <span className="text-2xl font-bold">ONLINE ROOMS</span>
        <span className="text-md">{`${data.Count} Results`}</span>
      </header>

      <div className="flex align-center gap-2">
        <input className="grow pl-4 text-black" placeholder="Search Rooms" />
        <Button className="bg-green-500 font-bold" onClick={handleDialogOpen}>
          Create Room
        </Button>
        <Button className="bg-green-500 font-bold">
          <ReFresh />
        </Button>
      </div>

      <table className="table-auto border-t-2">
        <colgroup>
          <col css={css({ width: '15%' })} />
          <col css={css({ width: '60%' })} />
          <col css={css({ width: '25%' })} />
        </colgroup>

        <thead>
          <tr className="[&>th]:p-2 [&>th]:text-lg">
            <th align="center">Players</th>
            <th align="left">ROOM NAME</th>
            <th>Created At</th>
          </tr>
        </thead>

        <tbody>
          {data.Items.map((room) => {
            return (
              <tr
                className="[&>td]:p-2 odd:bg-slate-600 even:bg-slate-700 hover:outline hover:outline-2 hover:outline-green-300 hover:cursor-pointer"
                key={room.id}
              >
                <td className="font-bold" align="center">
                  2/4
                </td>
                <td>{room.roomName}</td>

                <td align="center">
                  <span className="text-xs">{room.createdAt}</span>
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

      <CreateRoomDialog ref={dialogRef} handleDialogClose={handleDialogClose} />
    </div>
  );
};
