import { axiosInstance } from '@/api/axiosInstance';
import { useSuspendedQuery } from '@toss/react-query';
import { UserData } from '../utils/types';

type ApiParams = {
  id?: string | null;
};

type ApiResponse = {
  userData: UserData;
};

const getUserInfo = async (params: ApiParams) => {
  const { data } = await axiosInstance().get<ApiResponse>(`/user?id=${params.id}`);
  return data;
};

export const useGetUserInfoQuery = (params: ApiParams) =>
  useSuspendedQuery(['user', params.id], () => getUserInfo(params), {
    enabled: !!params.id,
  });
