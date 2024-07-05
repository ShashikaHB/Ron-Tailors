export type User = {
  userId: number;
  mobile: number;
  name: string;
  role: string;
  isActive: boolean;
};

export type UserState = {
  user: User;
  accessToken: string;
};
