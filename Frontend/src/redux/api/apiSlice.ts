import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { setCredentials, logOut } from "../features/auth/authSlice";
import { RootState } from "../store/store";
import { UserState } from "../../types/user";

const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  {},
  FetchBaseQueryMeta
> = fetchBaseQuery({
  baseUrl: "http://localhost:8000/api/v1/",
  credentials: "include", // This will send back the http only cookie which is used in refresh token.
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  {},
  FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 403) {
    // Send refresh token to get new access token

    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

    if (refreshResult?.data) {
      const state = api.getState() as RootState;
      const user = state.auth.user;

      api.dispatch(
        setCredentials({ ...(refreshResult.data as UserState), user })
      );
      // Retry the original query with new access token

      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logOut());
    }
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({}),
  tagTypes: ["Materials", "Customer"],
});
