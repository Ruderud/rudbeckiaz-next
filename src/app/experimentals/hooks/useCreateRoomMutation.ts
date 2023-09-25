import { axiosInstance } from '@/api/axiosInstance';
import { useMutation } from '@tanstack/react-query';
import { minecraftQueryClient } from '../providers';
import { Room, UserData } from '../utils/types';

type ApiParams = {
  host: UserData;
  roomName: string;
  isPrivate: boolean;
};

type ApiResponse = {
  message: string;
  roomData: Room;
};

const createRoom = async (params: ApiParams) => {
  const { data } = await axiosInstance().post<ApiResponse>('/room', params);
  return data;
};

export const useCreateRoomMutation = () =>
  useMutation(createRoom, {
    onSuccess: (data) => {
      minecraftQueryClient.invalidateQueries(['rooms']);
    },
  });
