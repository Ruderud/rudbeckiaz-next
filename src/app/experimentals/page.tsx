'use client';

import { axiosInstance } from '@/api/axiosInstance';
import { reportError } from '@/utils';
import { SignalingChannel } from './utils';
import Minecraft from './components/Mincraft';
import { RoomList } from './components/RoomList';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Button } from './components/Button';
import { useRef, useState } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      cacheTime: 5 * 60 * 1000,
      retry: 1,
      retryDelay: 500,
      suspense: true,
    },
  },
});

export default function ExperimentalsPage() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <main className="p-5 flex flex-row gap-10 bg-color-[#ff00ff">
      <QueryClientProvider client={queryClient}>
        <div>
          <div className="text-2xl">USER SETTINGS</div>
          <form className="flex flex-col gap-2">
            <label>Name</label>
            <input type="text" />
          </form>
        </div>

        <div className="flex flex-col grow ">
          <div className="text-2xl">MINECRAFT ONLINE ROOMS</div>
          <RoomList />

          <div>
            <Button
              color="green"
              onClick={(event) => {
                console.log(dialogRef.current);
                dialogRef.current?.showModal();
              }}
            >
              Create Room
            </Button>
          </div>
        </div>

        <dialog
          ref={dialogRef}
          className="flex flex-col gap-2"
          onClick={(event) => {
            if (event.target instanceof HTMLDialogElement && event.target.nodeName === 'DIALOG')
              dialogRef.current?.close();
          }}
        >
          <div className="text-2xl">CREATE ROOM</div>
          <input
            type="text"
            onChange={(e) => {
              console.log(e.target.value);
            }}
          />
          <Button
            color="green"
            onClick={() => {
              dialogRef.current?.close();
            }}
          >
            Close
          </Button>
        </dialog>
      </QueryClientProvider>
    </main>
  );
}
