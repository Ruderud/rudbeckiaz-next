'use client';
import { useEffect, useState } from 'react';

const getHash = () =>
  typeof window !== 'undefined' ? decodeURIComponent(window.location.hash.replace('#', '')) : undefined;

const useHash = () => {
  const [hash, setHash] = useState(getHash());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const handleHashChange = () => {
      console.log('hash changed');
      setHash(getHash());
    };
    window.addEventListener('hashchange', handleHashChange, false);
    return () => {
      window.removeEventListener('hashchange', handleHashChange, false);
    };
  }, []);

  return isClient ? hash : null;
};

export default useHash;
