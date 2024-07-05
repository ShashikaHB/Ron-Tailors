import { createSlice } from "@reduxjs/toolkit";
import { UserState, User } from "../../../types/user";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";

const initialState: UserState = {
  user: {} as User,
  accessToken: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<UserState>) => {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
    },
    logOut: (state) => {
      state.user = {} as User;
      state.accessToken = "";
    },
  },
});

export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.accessToken;

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;
