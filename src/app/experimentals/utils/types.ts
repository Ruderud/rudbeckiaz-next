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
  userData: UserData;
  message: string;
};
