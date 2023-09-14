import { axiosInstance } from '@/api/axiosInstance';
import { useMutation } from '@tanstack/react-query';

type ApiResponse = {
  message: string;
};

const deleteRoom = async () => {
  const { data } = await axiosInstance().delete<ApiResponse>('/room');
  return data;
};

export const useDeleteRoomMutation = () => useMutation(deleteRoom);
