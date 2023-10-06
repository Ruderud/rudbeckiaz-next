'use client';

import { useRef } from 'react';
import { InitialRoomsData, useGetRoomsQuery } from '../hooks/useGetRoomsQuery';
import { Button } from '@/components/Ui/Button';
import { CreateRoomDialog } from './CreateRoomDialog';
import { css } from 'twin.macro';
import { ReFresh } from '@/components/Icon/Refresh';
import calcTimeDiff from '../utils/calcTimeDiff';

type RoolListProps = {
  initialRoomsData?: InitialRoomsData;
};

const RoomList = ({ initialRoomsData }: RoolListProps) => {
  const { data, refetch } = useGetRoomsQuery(initialRoomsData);

  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleDialogOpen = () => dialogRef.current?.showModal();
  const handleDialogClose = () => dialogRef.current?.close();
  const handleRoomElementClickById = (roomId: string) => () => {
    window.location.hash = roomId;
  };

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
        <Button
          className="bg-green-500 font-bold"
          onClick={() => {
            refetch();
          }}
        >
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
                className="h-12 [&>td]:p-2 odd:bg-slate-600 even:bg-slate-700 hover:outline hover:outline-2 hover:outline-green-300 hover:cursor-pointer"
                key={room.id}
                onClick={handleRoomElementClickById(room.id)}
              >
                <td className="font-bold" align="center">
                  2/4
                </td>
                <td>{room.roomName}</td>

                <td align="center">
                  <span className="text-xs">{calcTimeDiff(room.createdAt)}</span>
                </td>
              </tr>
            );
          })}
          {data.Items.length < 10 &&
            Array.from({ length: 10 - data.Items.length }).map((_, idx) => (
              <tr
                className="h-12 [&>td]:p-2 odd:bg-slate-600 even:bg-slate-700 hover:outline hover:outline-2 hover:outline-green-300 hover:cursor-pointer"
                key={idx}
              >
                <td></td>
                <td></td>
                <td></td>
              </tr>
            ))}
        </tbody>
      </table>

      <div>page</div>

      <CreateRoomDialog ref={dialogRef} handleDialogClose={handleDialogClose} />
    </div>
  );
};

const RoomListSkeleton = () => {
  return (
    <div className="flex flex-col grow p-4 gap-4 bg-slate-700 bg-opacity-50">
      <header className="flex gap-4 items-baseline">
        <span className="text-2xl font-bold">ONLINE ROOMS</span>
        <span role="status" className="animate-pulse bg-gray-200 rounded dark:bg-gray-700 w-48 h-4"></span>
      </header>

      <div className="flex align-center gap-2">
        <input className="grow pl-4 text-black" placeholder="Search Rooms" />
        <Button className="bg-green-500 font-bold" disabled>
          Create Room
        </Button>
        <Button className="bg-green-500 font-bold" disabled>
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
          {Array.from({ length: 10 }).map((_, idx) => (
            <tr
              className="h-12 [&>td]:p-2 odd:bg-slate-600 even:bg-slate-700 hover:outline hover:outline-2 hover:outline-green-300 hover:cursor-pointer"
              key={idx}
            >
              <td>
                <div role="status" className="animate-pulse bg-gray-300 rounded dark:bg-gray-700 w-10 h-4"></div>
              </td>
              <td>
                <div role="status" className="animate-pulse bg-gray-300 rounded dark:bg-gray-700 w-48 h-4"></div>
              </td>
              <td>
                <div role="status" className="animate-pulse bg-gray-300 rounded dark:bg-gray-700 w-10 h-4"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { RoomList, RoomListSkeleton };
