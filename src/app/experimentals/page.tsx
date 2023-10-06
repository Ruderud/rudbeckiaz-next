import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Hydrate, dehydrate } from '@tanstack/react-query';

import { RoomList, RoomListSkeleton } from './components/RoomList';
import Providers from './providers';
import { getRooms } from './hooks/useGetRoomsQuery';
import getQueryClient from '../getQueryClient';
import { UserSection, UserSectionSkeleton } from './components/UserSection';
import { RoomInfo, RoomInfoSkeleton } from './components/RoomInfo';
import { getRoomInfo } from './hooks/useGetRoomInfoQuery';
import { useRouter } from 'next/navigation';
import { ErrorView } from './components/ErrorView';

// Todo: 현재 prefetch시 inital userId가 없기에 400 error발생중. prefetch에서는 UserData를 가져오지 않도록 수정해야함.
// export default async function ExperimentalsPage() {
//   const queryClient = getQueryClient();
//   await queryClient.prefetchQuery(['rooms'], getRooms);
//   await queryClient.prefetchQuery(['rooms'], getRoomInfo);
//   const dehydratedState = dehydrate(queryClient);

//   return (
//     <main className="p-4">
//       <ErrorBoundary fallback={<div>Something wrong...</div>}>
//         <Providers>
//           <Hydrate state={dehydratedState}>
//             <div className="grid grid-cols-2 gap-4">
//               <div className="col-span-2">
//                 <Suspense fallback={<UserSectionSkeleton />}>
//                   <UserSection />
//                 </Suspense>
//               </div>

//               <div className="col-span-1">
//                 <Suspense fallback={<div>Room List Loading...</div>}>
//                   <RoomList />
//                 </Suspense>
//               </div>

//               <div className="col-span-1">
//                 <Suspense fallback={<RoomInfoSkeleton />}>
//                   <RoomInfo />
//                 </Suspense>
//               </div>
//             </div>
//           </Hydrate>
//         </Providers>
//       </ErrorBoundary>
//     </main>
//   );
// }

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
