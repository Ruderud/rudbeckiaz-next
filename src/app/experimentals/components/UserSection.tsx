'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { useCreateUserIdMutation } from '../hooks/useCreateUserIdMutation';
import { Button } from '@/components/Ui/Button';
import { useGetUserInfoQuery } from '../hooks/useGetUserInfoQuery';
import { enqueueSnackbar } from 'notistack';

type UserInput = {
  userName: string;
};

export const UserSection = () => {
  const { data } = useGetUserInfoQuery({
    id: window.localStorage.getItem('userId'),
  });
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

  return (
    <div>
      <div className="text-2xl">USER SETTINGS</div>

      {data ? (
        <div className="flex flex-col gap-2">{JSON.stringify(data)}</div>
      ) : (
        <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col">
            <label htmlFor="roomName">User Name</label>
            <input
              type="text"
              className={
                errors.userName ? 'border-2 border-rose-500 rounded p-1 text-black' : 'border-2 rounded p-1 text-black'
              }
              {...register('userName', { required: true })}
            />
            {errors.userName && <p className="font-bold text-red-500">User Name is required</p>}
          </div>
          <Button type="submit" color="green">
            Sign Up
          </Button>
        </form>
      )}
    </div>
  );
};
