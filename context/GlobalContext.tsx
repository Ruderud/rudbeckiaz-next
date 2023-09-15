'use client';

import { SnackbarProvider } from 'notistack';
import { Dispatch, ReactNode, createContext, useEffect, useState } from 'react';

type GlobalContext = {
  isDarkMode: boolean;
  setIsDarkMode: Dispatch<React.SetStateAction<boolean>>;
};

export const GlobalContext = createContext<GlobalContext>({
  isDarkMode: false,
  setIsDarkMode: () => {},
});

export const GlobalContextProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const changeDeviceDarkMode = (event: MediaQueryListEvent) => setIsDarkMode(event.matches);
  useEffect(() => {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(prefersDarkMode.matches);
    prefersDarkMode.addEventListener('change', changeDeviceDarkMode);

    return () => {
      prefersDarkMode.removeEventListener('change', changeDeviceDarkMode);
    };
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isDarkMode,
        setIsDarkMode,
      }}
    >
      <SnackbarProvider maxSnack={3}>{children}</SnackbarProvider>
    </GlobalContext.Provider>
  );
};
