'use client';

import { useContext, useEffect, useState } from 'react';
import { Moon, Sun } from './icons';
import { GlobalContext } from 'context/GlobalContext';

export const DarkModeButton = () => {
  const { isDarkMode, setIsDarkMode } = useContext(GlobalContext);
  // const [toggleCnt, setToggleCnt] = useState<number>(0);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // setToggleCnt((cur) => cur + 1);
  };

  useEffect(() => {
    const htmlElement = document.querySelector('html');
    if (!htmlElement) return;

    if (isDarkMode) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <button
      className="bg-transparent text-black dark:text-slate-400 rounded-full flex justify-center items-center p-1"
      onClick={toggleDarkMode}
    >
      {isDarkMode ? <Moon /> : <Sun />}
    </button>
  );
};
