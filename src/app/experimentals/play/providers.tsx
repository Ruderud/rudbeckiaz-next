'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Dispatch, ReactNode, SetStateAction, createContext, useEffect, useState } from 'react';
import { Cube, UserData } from '../utils/types';

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
  userData: UserData | null;
  setUserData: Dispatch<SetStateAction<UserData | null>>;
  cubes: Cube[];
  setCubes: Dispatch<SetStateAction<Cube[]>>;
};

export const MinecraftContext = createContext<MinecraftContext>({
  isInputActive: false,
  setIsInputActive: () => {},
  sendChannel: null,
  setSendChannel: () => {},
  receiveChannel: null,
  setReceiveChannel: () => {},
  userData: null,
  setUserData: () => {},
  cubes: [],
  setCubes: () => {},
});

export default function Providers({ children }: ProvidersProps) {
  const [isInputActive, setIsInputActive] = useState<boolean>(false);
  const [sendChannel, setSendChannel] = useState<RTCDataChannel | null>(null);
  const [receiveChannel, setReceiveChannel] = useState<RTCDataChannel | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [cubes, setCubes] = useState<Cube[]>([]);

  return (
    <MinecraftContext.Provider
      value={{
        isInputActive,
        setIsInputActive,
        sendChannel,
        setSendChannel,
        receiveChannel,
        setReceiveChannel,
        userData,
        setUserData,
        cubes,
        setCubes,
      }}
    >
      <QueryClientProvider client={minecraftQueryClient}>{children}</QueryClientProvider>
    </MinecraftContext.Provider>
  );
}
