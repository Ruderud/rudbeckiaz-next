import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { RoomList, RoomListSkeleton } from './components/RoomList';
import Providers from './providers';
import { UserSection, UserSectionSkeleton } from './components/UserSection';
import { RoomInfo, RoomInfoSkeleton } from './components/RoomInfo';
import { ErrorView } from './components/ErrorView';

export default function ExperimentalsPage() {
  return (
    <main className="p-4">
      <ErrorBoundary fallback={<ErrorView />}>
        <Providers>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Suspense fallback={<UserSectionSkeleton />}>
                <UserSection />
              </Suspense>
            </div>

            <div className="col-span-1">
              <Suspense fallback={<RoomListSkeleton />}>
                <RoomList />
              </Suspense>
            </div>

            <div className="col-span-1">
              <Suspense fallback={<RoomInfoSkeleton />}>
                <RoomInfo />
              </Suspense>
            </div>
          </div>
        </Providers>
      </ErrorBoundary>
    </main>
  );
}
