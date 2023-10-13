'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Dispatch, ReactNode, SetStateAction, createContext, useEffect, useState } from 'react';
import { SignalingChannel } from '../utils';
import { useSignalingChannel } from '../hooks/useSignalingChannel';

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
  isInputActive: boolean;
  setIsInputActive: Dispatch<SetStateAction<boolean>>;
};

export const MinecraftContext = createContext<MinecraftContext>({
  storedId: null,
  setStoredId: () => {},
  isInputActive: false,
  setIsInputActive: () => {},
});

export default function Providers({ children }: ProvidersProps) {
  const [storedId, setStoredId] = useState<string | null>(null);
  const [isInputActive, setIsInputActive] = useState<boolean>(false);

  useEffect(() => {
    setStoredId(window.localStorage.getItem('userId'));
  }, []);

  return (
    <MinecraftContext.Provider
      value={{
        storedId,
        setStoredId,
        isInputActive,
        setIsInputActive,
      }}
    >
      <QueryClientProvider client={minecraftQueryClient}>{children}</QueryClientProvider>
    </MinecraftContext.Provider>
  );
}
