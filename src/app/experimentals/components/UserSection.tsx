'use client';

import { useCreateUserIdMutation } from '../hooks/useCreateUserIdMutation';
import { Button } from '@/components/Ui/Button';
import { useGetUserInfoQuery } from '../hooks/useGetUserInfoQuery';

import { useCallback, useContext, useEffect, useRef } from 'react';
import { MinecraftContext } from '../providers';
import ChangeUserNameDialog from './ChangeUserNameDialog';

export const UserSection = () => {
  const { storedId, setUserData, setStoredId } = useContext(MinecraftContext);
  const { data } = useGetUserInfoQuery({ id: storedId });
  const { mutateAsync } = useCreateUserIdMutation();

  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleDialogOpen = () => dialogRef.current?.showModal();
  const handleDialogClose = () => dialogRef.current?.close();

  const createGuestUser = useCallback(async () => {
    const res = await mutateAsync({
      userName: 'Guest',
    });
    window.localStorage.setItem('userId', res.userData.id);
    setStoredId(res.userData.id);
    return res;
  }, [mutateAsync, setStoredId]);

  useEffect(() => {
    setUserData(data.userData);
  }, [setUserData, data]);

  useEffect(() => {
    const storedId = window.localStorage.getItem('userId');
    if (!storedId) {
      createGuestUser();
    }
  }, [createGuestUser]);

  return (
    <div className="flex justify-between bg-slate-700 bg-opacity-50 p-4">
      <header className="flex gap-4 items-baseline">
        <span className="text-2xl font-bold">USER SETTINGS</span>
        <span className="text-md">{`UserName: ${data?.userData.userName}${data?.userData.nameCode}`}</span>
      </header>

      <Button variant="secondary" className="text-md font-bold" onClick={handleDialogOpen}>
        Change UserName
      </Button>

      <ChangeUserNameDialog ref={dialogRef} handleDialogClose={handleDialogClose} />
    </div>
  );
};
