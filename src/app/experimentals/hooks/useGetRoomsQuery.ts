import { axiosInstance } from '@/api/axiosInstance';
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

const getRooms = async () => {
  const { data } = await axiosInstance().get<ApiResponse>('/room');
  return data;
};

export const useGetRoomsQuery = () => useSuspendedQuery(['room'], getRooms);
