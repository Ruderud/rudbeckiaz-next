'use client';

import { axiosInstance } from '@/api/axiosInstance';
import { reportError } from '@/utils';
import { SignalingChannel } from './utils';
import Minecraft from './components/Mincraft';
import { RoomList } from './components/RoomList';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import { FormEventHandler, useRef, useState } from 'react';
import { Button } from '@/components/Ui/Button';
import { CreateRoomDialog } from './components/CreateRoomDialog';
import { UserSection } from './components/UserSection';

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

  const handleDialogOpen = () => dialogRef.current?.showModal();
  const handleDialogClose = () => dialogRef.current?.close();

  return (
    <main className="p-5 flex flex-row gap-10 bg-color-[#ff00ff">
      <QueryClientProvider client={queryClient}>
        <UserSection />

        <div className="flex flex-col grow ">
          <div className="text-2xl">MINECRAFT ONLINE ROOMS</div>
          <RoomList />

          <div>
            <Button color="green" onClick={handleDialogOpen}>
              Create Room
            </Button>
          </div>
        </div>

        <CreateRoomDialog ref={dialogRef} handleDialogClose={handleDialogClose} />
      </QueryClientProvider>
    </main>
  );
}
