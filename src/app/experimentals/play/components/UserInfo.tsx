'use client';

import { useContext, useEffect, useState } from 'react';
import { useGetUserInfoQuery } from '../../hooks/useGetUserInfoQuery';
import { MinecraftContext } from '../../providers';

export const UserInfo = () => {
  const { setUserData } = useContext(MinecraftContext);
  const [userId, setUserId] = useState<string | null>(null);
  const { data } = useGetUserInfoQuery({ id: userId });

  useEffect(() => {
    setUserData(data?.userData);
  }, [data, setUserData]);

  useEffect(() => {
    setUserId(window.localStorage.getItem('userId'));
  }, []);

  return <div>{JSON.stringify(data?.userData)}</div>;
};
