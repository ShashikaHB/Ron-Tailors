/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { UserState, User } from '../../../types/user';
import { RootState } from '../../store/store';

const initialState: UserState = {
  user: {} as User,
  accessToken: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<UserState>) => {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
    },
    logOut: (state) => {
      state.user = {} as User;
      state.accessToken = '';
    },
  },
});

export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.accessToken;

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;
