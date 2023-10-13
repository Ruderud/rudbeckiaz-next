'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Dispatch, ReactNode, SetStateAction, createContext, useEffect, useState } from 'react';

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
  isInputActive: boolean;
  setIsInputActive: Dispatch<SetStateAction<boolean>>;
  sendChannel: RTCDataChannel | null;
  setSendChannel: Dispatch<SetStateAction<RTCDataChannel | null>>;
  receiveChannel: RTCDataChannel | null;
  setReceiveChannel: Dispatch<SetStateAction<RTCDataChannel | null>>;
};

export const MinecraftContext = createContext<MinecraftContext>({
  isInputActive: false,
  setIsInputActive: () => {},
  sendChannel: null,
  setSendChannel: () => {},
  receiveChannel: null,
  setReceiveChannel: () => {},
});

export default function Providers({ children }: ProvidersProps) {
  const [isInputActive, setIsInputActive] = useState<boolean>(false);
  const [sendChannel, setSendChannel] = useState<RTCDataChannel | null>(null);
  const [receiveChannel, setReceiveChannel] = useState<RTCDataChannel | null>(null);

  return (
    <MinecraftContext.Provider
      value={{
        isInputActive,
        setIsInputActive,
        sendChannel,
        setSendChannel,
        receiveChannel,
        setReceiveChannel,
      }}
    >
      <QueryClientProvider client={minecraftQueryClient}>{children}</QueryClientProvider>
    </MinecraftContext.Provider>
  );
}
