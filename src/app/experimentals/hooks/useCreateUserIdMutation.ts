import { axiosInstance } from '@/api/axiosInstance';
import { useMutation } from '@tanstack/react-query';
import { waitRoomQueryClient } from '../providers';

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

export const createUserId = async (params: ApiParams) => {
  const { data } = await axiosInstance().post<ApiResponse>('/user', params);
  return data;
};

export const useCreateUserIdMutation = () =>
  useMutation(createUserId, {
    onSuccess: (data) => {
      waitRoomQueryClient.invalidateQueries(['user', data.userData.id]);
    },
  });
