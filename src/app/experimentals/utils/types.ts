export type Room = {
  id: string;
  roomName: string;
  host: UserData;
};

export type UserData = {
  id: string;
  userName: string;
  nameCode: string;
  createdAt: string;
};
