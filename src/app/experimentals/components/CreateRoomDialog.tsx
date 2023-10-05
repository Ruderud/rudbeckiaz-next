import { forwardRef, useContext } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { Button } from '@/components/Ui/Button';
import { reportError } from '@/utils';
import { useCreateRoomMutation } from '../hooks/useCreateRoomMutation';
import { MinecraftContext } from '../providers';
import { useRouter } from 'next/navigation';

type CreateRoomDialogProps = {
  handleDialogClose: () => void;
};

type CreateRoomForm = {
  roomName: string;
  isPrivate: boolean;
};

export const CreateRoomDialog = forwardRef<HTMLDialogElement, CreateRoomDialogProps>(function CreateRoomDialog(
  props: CreateRoomDialogProps,
  ref
) {
  const { userData } = useContext(MinecraftContext);
  const { handleDialogClose } = props;
  const { mutateAsync } = useCreateRoomMutation();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRoomForm>();

  const onSubmit: SubmitHandler<CreateRoomForm> = async (data) => {
    try {
      if (!userData) throw new Error('User Data is not found');
      const res = await mutateAsync({
        host: userData,
        ...data,
      });
      handleDialogClose();
      router.push(`/experimentals?room=${res.roomData.id}`);
    } catch (error) {
      reportError({
        error,
        notice: true,
      });
    }
  };

  return (
    <dialog ref={ref} className="relative flex flex-col gap-2 p-8 bg-white rounded-md shadow-md">
      <div className="text-2xl font-bold">CREATE ROOM</div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="flex flex-col gap-3 pb-5">
          <div className="flex flex-col">
            <label htmlFor="roomName">Room Name</label>
            <input
              type="text"
              className={errors.roomName ? 'border-2 border-rose-500 rounded p-1' : 'border-2 rounded p-1'}
              placeholder="Foo's Room"
              {...register('roomName', { required: true })}
            />
            {errors.roomName && <p className="font-bold text-red-500">Room Name is required</p>}
          </div>

          <div className="flex gap-2">
            <label htmlFor="isPrivate">Private</label>
            <input type="checkbox" {...register('isPrivate')} />
          </div>
        </fieldset>

        <div className="flex justify-end">
          <Button variant="secondary" type="button" onClick={handleDialogClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Create Room
          </Button>
        </div>
      </form>
    </dialog>
  );
});
