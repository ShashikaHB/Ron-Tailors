import { User } from "./user";

export type ApiResponse<T = undefined> = {
  data?: T;
  message: string;
  success: boolean;
  stack?: string;
};

export type AuthResponse = {
  message: string;
  success: boolean;
  user: User;
  accessToken: string;
};

export type Option = {
  label: string;
  value: any;
};
