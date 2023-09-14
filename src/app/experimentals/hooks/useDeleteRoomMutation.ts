import { axiosInstance } from '@/api/axiosInstance';

type ApiResponse = {
  message: string;
};

const deleteRoom = async () => {
  const { data } = await axiosInstance().delete<ApiResponse>('/room');
  return data;
};
