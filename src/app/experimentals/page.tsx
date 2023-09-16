import { axiosInstance } from '@/api/axiosInstance';
import { reportError } from '@/utils';
import { SignalingChannel } from './utils';
import Minecraft from './components/Mincraft';
import { RoomList } from './components/RoomList';
import Providers from './providers';
import { getRooms } from './hooks/useGetRoomsQuery';
import getQueryClient from '../getQueryClient';
import { Hydrate, dehydrate } from '@tanstack/react-query';
import ssrPrepass from 'react-ssr-prepass';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';

export default async function ExperimentalsPage() {
  const queryClient = getQueryClient();

  try {
    await queryClient.prefetchQuery(['rooms'], getRooms);
  } catch (error) {
    return <div>{JSON.stringify(error)}</div>;
  }

  // const initialRoomsData = await getRooms();
  const dehydratedState = dehydrate(queryClient);
  console.log('dehydratedState', dehydratedState);

  return (
    <main className="p-5 flex flex-row gap-10">
      <Providers>
        <Hydrate state={dehydratedState}>
          {/* <ErrorBoundary
          fallback={<div>someThing wrong</div>}
          onError={(error, errorInfo) => {
            // console.log(error, errorInfo);
            // window.localStorage.removeItem('userId');
            // window.location.reload();
          }}
        >
          <Suspense fallback={'Load Exist User info'}>
            <UserSection />
          </Suspense>
        </ErrorBoundary> */}

          <ErrorBoundary fallback={<div>Something wrong...</div>}>
            <Suspense fallback={<div>Loading...</div>}>
              <RoomList />
            </Suspense>
          </ErrorBoundary>
        </Hydrate>
      </Providers>
    </main>
  );
}
