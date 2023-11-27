import { axiosInstance } from '@/api/axiosInstance';
import { Room } from '../utils/types';
import { useSuspendedQuery } from '@toss/react-query';

type ApiParams = {
  id?: string | null;
};

type ApiResponse = {
  message: string;
  Item: Room;
};

export const getRoomInfo = async (params: ApiParams) => {
  const { data } = await axiosInstance().get<ApiResponse>(`/room?id=${params.id}`);
  return data;
};

export const useGetRoomInfoQuery = (params: ApiParams) =>
  useSuspendedQuery(['room', params.id], () => getRoomInfo(params), {
    enabled: !!params.id,
  });
