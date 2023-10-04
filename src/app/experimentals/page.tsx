import Minecraft from './components/Mincraft';
import { RoomList } from './components/RoomList';
import Providers from './providers';
import { getRooms } from './hooks/useGetRoomsQuery';
import getQueryClient from '../getQueryClient';
import { Hydrate, dehydrate } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';
import { UserSection } from './components/UserSection';

export default async function ExperimentalsPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(['rooms'], getRooms);
  const dehydratedState = dehydrate(queryClient);

  return (
    <main className="p-4">
      <ErrorBoundary fallback={<div>Something wrong...</div>}>
        <Providers>
          <Hydrate state={dehydratedState}>
            <div className="flex flex-col gap-10 pb-10">
              <Suspense fallback={<div>Loading...</div>}>
                <UserSection />
              </Suspense>

              <Suspense fallback={<div>Loading...</div>}>
                <RoomList />
              </Suspense>
            </div>
          </Hydrate>
        </Providers>
      </ErrorBoundary>
    </main>
  );
}
