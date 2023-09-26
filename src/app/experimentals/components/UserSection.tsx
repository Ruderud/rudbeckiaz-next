'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { useCreateUserIdMutation } from '../hooks/useCreateUserIdMutation';
import { Button } from '@/components/Ui/Button';
import { useGetUserInfoQuery } from '../hooks/useGetUserInfoQuery';
import { enqueueSnackbar } from 'notistack';
import { Dispatch, SetStateAction, use, useContext, useEffect, useState } from 'react';
import { MinecraftContext } from '../providers';
import { UserData } from '../utils/types';

type UserInput = {
  userName: string;
};

type UserSectionProps = {
  dispatchUserData?: Dispatch<SetStateAction<UserData | undefined>>;
};

export const UserSection = ({ dispatchUserData }: UserSectionProps) => {
  const { storedId, setUserData } = useContext(MinecraftContext);
  const { data } = useGetUserInfoQuery({ id: storedId });
  const { mutateAsync } = useCreateUserIdMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserInput>();

  const onSubmit: SubmitHandler<UserInput> = async (data) => {
    const { message, userData } = await mutateAsync({
      ...data,
    });
    window.localStorage.setItem('userId', userData.id);
    enqueueSnackbar(message, { variant: 'success' });
  };

  useEffect(() => {
    setUserData(data?.userData);
    dispatchUserData && dispatchUserData(data?.userData);
  }, [setUserData, dispatchUserData, data]);

  return (
    <div>
      {!data && (
        <>
          <h3 className="text-2xl">Create User Name</h3>
          <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col">
              <label htmlFor="roomName">User Name</label>
              <input
                type="text"
                className={
                  errors.userName
                    ? 'border-2 border-rose-500 rounded p-1 text-black'
                    : 'border-2 rounded p-1 text-black'
                }
                {...register('userName', { required: true })}
              />
              {errors.userName && <p className="font-bold text-red-500">User Name is required</p>}
            </div>
            <Button type="submit" color="green">
              Sign Up
            </Button>
          </form>
        </>
      )}

      {data && (
        <div>
          <h3 className="text-2xl">USER SETTINGS</h3>
          <div>{`UserName: ${data.userData.userName}${data.userData.nameCode}`}</div>
          <Button color="orange">Delete UserData</Button>
        </div>
      )}
    </div>
  );
};
