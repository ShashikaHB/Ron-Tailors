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

export type OptionCheckBox = { id: string; label: string; checked?: boolean };

export type ApiResonseError = {
  status: number;
  data: {
    error: string;
    success: boolean;
  };
};
