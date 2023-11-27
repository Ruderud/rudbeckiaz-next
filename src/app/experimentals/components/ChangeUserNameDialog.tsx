import { ForwardedRef, forwardRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useCreateUserIdMutation } from '../hooks/useCreateUserIdMutation';
import { enqueueSnackbar } from 'notistack';
import { Button } from '@/components/Ui/Button';
import usePutUserInfoMutation from '../hooks/usePutUserInfoMutation';

type UserInput = {
  userName: string;
};

type ChangeUserNameDialogProps = {
  handleDialogClose: () => void;
};

const ChangeUserNameDialog = (
  { handleDialogClose }: ChangeUserNameDialogProps,
  ref: ForwardedRef<HTMLDialogElement>
) => {
  const { mutateAsync } = usePutUserInfoMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserInput>();

  const onSubmit: SubmitHandler<UserInput> = async (data) => {
    const userId = window.localStorage.getItem('userId');
    if (!userId) {
      enqueueSnackbar('User Id Not Exist', { variant: 'error' });
      return;
    }
    const { message, userData } = await mutateAsync({
      id: userId,
      userName: data.userName,
    });
    window.localStorage.setItem('userId', userData.id);
    enqueueSnackbar(message, { variant: 'success' });
    handleDialogClose();
  };

  return (
    <dialog ref={ref} className="relative flex flex-col gap-2 p-8 bg-white rounded-md shadow-md">
      <h3 className="text-2xl">Create User Name</h3>
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

        <div className="flex justify-end">
          <Button type="button" onClick={handleDialogClose}>
            Cancel
          </Button>
          <Button type="submit">Change Name</Button>
        </div>
      </form>
    </dialog>
  );
};

export default forwardRef<HTMLDialogElement, ChangeUserNameDialogProps>(ChangeUserNameDialog);
