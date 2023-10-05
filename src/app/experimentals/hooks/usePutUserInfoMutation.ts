import { axiosInstance } from '@/api/axiosInstance';
import { useMutation } from '@tanstack/react-query';
import { UserData } from '../utils/types';
import { minecraftQueryClient } from '../providers';

type ApiParams = {
  id: string;
  userName: string;
};

type ApiResponse = {
  message: string;
  userData: UserData;
};

const putUserInfo = async (params: ApiParams) => {
  const { data } = await axiosInstance().put<ApiResponse>(`/user`, params);
  return data;
};

const usePutUserInfoMutation = () =>
  useMutation(putUserInfo, {
    onSuccess: (data) => {
      minecraftQueryClient.invalidateQueries(['user', data.userData.id]);
    },
  });

export default usePutUserInfoMutation;
