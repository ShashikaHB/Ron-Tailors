/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { BaseQueryFn, FetchArgs, FetchBaseQueryError, FetchBaseQueryMeta, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { toast } from 'sonner';
import { setCredentials, logOut } from '../features/auth/authSlice';
import { RootState } from '../store/store';
import { UserState } from '../../types/user';

const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, object, FetchBaseQueryMeta> = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_BASE_URL}/api/v1/`,
  credentials: 'include', // This will send back the http only cookie which is used in refresh token.
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.accessToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, object, FetchBaseQueryMeta> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  const errorMessage = (result.error?.data as { message?: string })?.message || 'An error occurred!';

  if (result.error) {
    toast.error(errorMessage);
  }
  if (result?.error?.status === 403) {
    // Send refresh token to get new access token

    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);

    if (refreshResult?.data) {
      const state = api.getState() as RootState;
      const { user } = state.auth;

      api.dispatch(
        setCredentials({
          ...(refreshResult.data as UserState),
          user,
        })
      );
      // Retry the original query with new access token

      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logOut());
    }
  }
  return result;
};

const apiSlice = createApi({
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({}),
  tagTypes: [
    'Materials',
    'Customer',
    'Users',
    'Products',
    'SalesOrder',
    'RentOrder',
    'RentItem',
    'RentItemList',
    'PiecePrices',
    'Salary',
    'Transactions',
    'TransactionCategory',
    'DayEnd',
    'Payment',
  ],
});

export default apiSlice;
