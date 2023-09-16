import { axiosInstance } from '@/api/axiosInstance';
import { useMutation } from '@tanstack/react-query';
// import { minecraftQueryClient } from '../getQueryClient';

type ApiParams = {
  userName: string;
};

type ApiResponse = {
  message: string;
  userData: {
    id: string;
    userName: string;
  };
};

const createUserId = async (params: ApiParams) => {
  const { data } = await axiosInstance().post<ApiResponse>('/user', params);
  return data;
};

export const useCreateUserIdMutation = () =>
  useMutation(createUserId, {
    onSuccess: (data) => {
      // minecraftQueryClient.invalidateQueries(['user']);
    },
  });
