import { axiosInstance } from '@/api/axiosInstance';
import { useMutation } from '@tanstack/react-query';

type ApiParams = {
  userName: string;
};

const createUserId = async (params: ApiParams) => {
  const { data } = await axiosInstance().post('/user', params);
  return data;
};

export const useCreateUserIdMutation = () => useMutation(createUserId);
