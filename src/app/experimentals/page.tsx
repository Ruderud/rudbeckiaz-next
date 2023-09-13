'use client';

import { axiosInstance } from '@/api/axiosInstance';
import { reportError } from '@/utils';
import { SignalingChannel } from './utils';
import Minecraft from './components/Mincraft';
import { RoomList } from './components/RoomList';
import { QueryClientProvider, QueryClient } from 'react-query';

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

//TODO: QueryClientProvider => react-query말고 tanstack query사용하기

export default function ExperimentalsPage() {
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
        <div>
          <div className="text-2xl">MINECRAFT ONLINE ROOMS</div>
          <RoomList />
        </div>
      </QueryClientProvider>
    </main>
  );
}
