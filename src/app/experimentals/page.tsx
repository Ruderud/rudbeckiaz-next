'use client';

import { axiosInstance } from '@/api/axiosInstance';
import { reportError } from '@/utils';
import { SignalingChannel } from './utils';
import Minecraft from './components/Mincraft';
import { RoomList } from './components/RoomList';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import { FormEventHandler, useRef, useState } from 'react';
import { Button } from '@/components/Ui/Button';
import { SubmitHandler, useForm } from 'react-hook-form';

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

type CreateRoomForm = {
  roomName: string;
  isPrivate: boolean;
};

export default function ExperimentalsPage() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRoomForm>();

  const onSubmit: SubmitHandler<CreateRoomForm> = (data) => {
    const isVerified = confirm('Are you sure?');
    if (!isVerified) {
      return;
    }
    console.log('submitCreateRoomForm', data);
    dialogRef.current?.close();
  };

  const handleDialogOpen = () => dialogRef.current?.showModal();
  const handleDialogClose = () => dialogRef.current?.close();

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
            <Button color="green" onClick={handleDialogOpen}>
              Create Room
            </Button>
          </div>
        </div>

        <dialog ref={dialogRef} className="relative flex flex-col gap-2 p-8 bg-white rounded-md shadow-md">
          <div className="text-2xl font-bold">CREATE ROOM</div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset className="flex flex-col gap-3 pb-5">
              <div className="flex flex-col">
                <label htmlFor="roomName">Room Name</label>
                <input
                  type="text"
                  className={errors.roomName ? 'border-2 border-rose-500 rounded p-1' : 'border-2 rounded p-1'}
                  placeholder="Foo's Room"
                  {...register('roomName', { required: true })}
                />
                {errors.roomName && <p className="font-bold text-red-500">Room Name is required</p>}
              </div>

              <div className="flex gap-2">
                <label htmlFor="isPrivate">Private</label>
                <input type="checkbox" {...register('isPrivate')} />
              </div>
            </fieldset>

            <div className="flex justify-end">
              <Button type="button" color="white" onClick={handleDialogClose}>
                Cancel
              </Button>
              <Button type="submit" color="green">
                Create Room
              </Button>
            </div>
          </form>
        </dialog>
      </QueryClientProvider>
    </main>
  );
}
