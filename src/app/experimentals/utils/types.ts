import { type } from 'os';

export type Room = {
  id: string;
  roomName: string;
  host: UserData;
  createdAt: string;
};

export type UserData = {
  id: string;
  userName: string;
  nameCode: string;
  createdAt: string;
  updatedAt: string;
};

export type Message = {
  message: string;
  createdAt: string;
};

export type Cube = number[] | [number, number, number];

export type DataChannel = 'MESSAGE' | 'CUBE';

export type DataChannelMessage<T = unknown> = {
  type: DataChannel;
  payload: T;
  userData: UserData;
};
