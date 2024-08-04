/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { ReactElement } from 'react';
import { User } from './user';

export type ApiResponse<T = any> = {
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

export type OptionCheckBox = {
  id: string;
  label: string;
  checked?: boolean;
};

export type ApiResponseError = {
  status: number;
  data: {
    error: string;
    success: boolean;
  };
};

export type SideBarConfig = {
  title: string;
  path?: string;
  icon?: ReactElement;
  children?: SideBarConfig[];
};
