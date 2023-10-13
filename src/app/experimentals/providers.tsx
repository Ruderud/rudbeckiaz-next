'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Dispatch, ReactNode, SetStateAction, createContext, useEffect, useState } from 'react';
import { UserData } from './utils/types';

type ProvidersProps = {
  children: ReactNode;
};

export const waitRoomQueryClient = new QueryClient({
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

type WaitRoomContext = {
  storedId: string | null;
  setStoredId: Dispatch<SetStateAction<string | null>>;
  userData?: UserData;
  setUserData: Dispatch<SetStateAction<UserData | undefined>>;
  isInputActive: boolean;
  setIsInputActive: Dispatch<SetStateAction<boolean>>;
};

export const WaitRoomContext = createContext<WaitRoomContext>({
  storedId: null,
  setStoredId: () => {},
  userData: undefined,
  setUserData: () => {},
  isInputActive: false,
  setIsInputActive: () => {},
});

export default function Providers({ children }: ProvidersProps) {
  const [storedId, setStoredId] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | undefined>(undefined);
  const [isInputActive, setIsInputActive] = useState<boolean>(false);

  useEffect(() => {
    setStoredId(window.localStorage.getItem('userId'));
  }, []);

  return (
    <WaitRoomContext.Provider
      value={{
        storedId,
        setStoredId,
        userData,
        setUserData,
        isInputActive,
        setIsInputActive,
      }}
    >
      <QueryClientProvider client={waitRoomQueryClient}>{children}</QueryClientProvider>
    </WaitRoomContext.Provider>
  );
}
