'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Dispatch, ReactNode, SetStateAction, createContext, useCallback, useEffect, useState } from 'react';
import { UserData } from './utils/types';
import { useSignalingChannel } from './hooks/useSignalingChannel';
import { SignalingChannel } from './utils';
import { createUserId } from './hooks/useCreateUserIdMutation';

type ProvidersProps = {
  children: ReactNode;
};

export const minecraftQueryClient = new QueryClient({
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

type MinecraftContext = {
  storedId: string | null;
  setStoredId: Dispatch<SetStateAction<string | null>>;
  userData?: UserData;
  setUserData: Dispatch<SetStateAction<UserData | undefined>>;
  isInputActive: boolean;
  setIsInputActive: Dispatch<SetStateAction<boolean>>;
  signalingChannel: SignalingChannel | null;
};

export const MinecraftContext = createContext<MinecraftContext>({
  storedId: null,
  setStoredId: () => {},
  userData: undefined,
  setUserData: () => {},
  isInputActive: false,
  setIsInputActive: () => {},
  signalingChannel: null,
});

export default function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(minecraftQueryClient);

  const [storedId, setStoredId] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | undefined>(undefined);
  const [isInputActive, setIsInputActive] = useState<boolean>(false);

  useEffect(() => {
    setStoredId(window.localStorage.getItem('userId'));
  }, []);

  const signalingChannel = useSignalingChannel();

  return (
    <MinecraftContext.Provider
      value={{
        storedId,
        setStoredId,
        userData,
        setUserData,
        isInputActive,
        setIsInputActive,
        signalingChannel,
      }}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MinecraftContext.Provider>
  );
}
