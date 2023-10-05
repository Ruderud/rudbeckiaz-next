import { RoomList } from './components/RoomList';
import Providers from './providers';
import { getRooms } from './hooks/useGetRoomsQuery';
import getQueryClient from '../getQueryClient';
import { Hydrate, dehydrate } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';
import { UserSection } from './components/UserSection';

// Todo: 현재 prefetch시 inital userId가 없기에 400 error발생중. prefetch에서는 UserData를 가져오지 않도록 수정해야함.
export default async function ExperimentalsPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(['rooms'], getRooms);
  const dehydratedState = dehydrate(queryClient);

  return (
    <main className="p-4">
      <ErrorBoundary fallback={<div>Something wrong...</div>}>
        <Providers>
          <Hydrate state={dehydratedState}>
            <div className="flex flex-col gap-4">
              <Suspense fallback={<div>User Data Loading...</div>}>
                <UserSection />
              </Suspense>

              <Suspense fallback={<div>Room List Loading...</div>}>
                <RoomList />
              </Suspense>
            </div>
          </Hydrate>
        </Providers>
      </ErrorBoundary>
    </main>
  );
}
