import { SubmitHandler, useForm } from 'react-hook-form';
import { useCreateUserIdMutation } from '../hooks/useCreateUserIdMutation';
import { Button } from '@/components/Ui/Button';

type UserInput = {
  userName: string;
};

export const UserSection = () => {
  const { mutateAsync } = useCreateUserIdMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserInput>();

  const onSubmit: SubmitHandler<UserInput> = async (data) => {
    console.log('submitCreateRoomForm', data);

    const { message } = await mutateAsync({
      ...data,
    });
    console.log('message', message);
  };

  return (
    <div>
      <div className="text-2xl">USER SETTINGS</div>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col">
          <label htmlFor="roomName">User Name</label>
          <input
            type="text"
            className={errors.userName ? 'border-2 border-rose-500 rounded p-1' : 'border-2 rounded p-1'}
            {...register('userName', { required: true })}
          />
          {errors.userName && <p className="font-bold text-red-500">User Name is required</p>}
        </div>
        <Button type="submit" color="green">
          Sign Up
        </Button>
      </form>
    </div>
  );
};
