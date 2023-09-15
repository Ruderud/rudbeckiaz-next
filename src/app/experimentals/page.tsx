'use client';

import { axiosInstance } from '@/api/axiosInstance';
import { reportError } from '@/utils';
import { SignalingChannel } from './utils';
import Minecraft from './components/Mincraft';
import { RoomList } from './components/RoomList';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import { FormEventHandler, Suspense, useRef, useState } from 'react';
import { Button } from '@/components/Ui/Button';
import { CreateRoomDialog } from './components/CreateRoomDialog';
import { UserSection } from './components/UserSection';
import { minecraftQueryClient } from './hooks/queryClient';
import { ErrorBoundary } from 'react-error-boundary';

export default function ExperimentalsPage() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleDialogOpen = () => dialogRef.current?.showModal();
  const handleDialogClose = () => dialogRef.current?.close();

  return (
    <main className="p-5 flex flex-row gap-10 bg-color-[#ff00ff">
      <QueryClientProvider client={minecraftQueryClient}>
        <ErrorBoundary
          fallback={<div>someThing wrong</div>}
          onError={(error, errorInfo) => {
            console.log(error, errorInfo);
            window.localStorage.removeItem('userId');
            window.location.reload();
          }}
        >
          <Suspense fallback={'Load Exist User info'}>
            <UserSection />
          </Suspense>
        </ErrorBoundary>

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
