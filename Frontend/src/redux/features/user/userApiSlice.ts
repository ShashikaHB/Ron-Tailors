/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { toast } from 'sonner';
import { ApiResponse } from '../../../types/common';
import { User } from '../../../types/user';
import apiSlice from '../../api/apiSlice';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<User[], void>({
      query: () => ({
        url: '/user',
        method: 'GET',
      }),
      providesTags: ['Materials'],
      transformResponse: (res: ApiResponse<User[]>): User[] => {
        if (!res.success) {
          toast.error('Material data fetching failed!');
          return []; // Return an empty array in case of failure
        }
        toast.success('All users fetched!');
        return res.data as User[]; // Return the array of users directly
      },
    }),
  }),
});

export const { useGetAllUsersQuery } = userApiSlice;
