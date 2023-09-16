import { axiosInstance } from '@/api/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { useSuspendedQuery } from '@toss/react-query';

type Room = {
  id: string;
  roomName: string;
  host: string;
};

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
