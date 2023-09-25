import { axiosInstance } from '@/api/axiosInstance';
import { useSuspendedQuery } from '@toss/react-query';
import { Room } from '../utils/types';

type ApiResponse = {
  Count: string;
  Items: Room[];
  ScannedCount: string;
};

export type InitialRoomsData = ApiResponse;

export const getRooms = async () => {
  const { data } = await axiosInstance().get<ApiResponse>('/room');
  return data;
};

export const useGetRoomsQuery = (initialData?: ApiResponse) =>
  useSuspendedQuery(['rooms'], getRooms, {
    initialData,
  });
