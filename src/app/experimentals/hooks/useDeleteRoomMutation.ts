import { axiosInstance } from '@/api/axiosInstance';
import { useMutation } from '@tanstack/react-query';
import { waitRoomQueryClient } from '../providers';

type ApiResponse = {
  message: string;
};

const deleteRoom = async () => {
  const { data } = await axiosInstance().delete<ApiResponse>('/room');
  return data;
};

export const useDeleteRoomMutation = () =>
  useMutation(deleteRoom, {
    onSuccess: () => {
      waitRoomQueryClient.invalidateQueries(['rooms']);
    },
  });
