import { axiosInstance } from '@/api/axiosInstance';
import { useMutation } from '@tanstack/react-query';
import { type } from 'os';
import { minecraftQueryClient } from '../providers';

type ApiParams = {
  host: string;
  roomName: string;
  isPrivate: boolean;
};

type ApiResponse = {
  message: string;
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
