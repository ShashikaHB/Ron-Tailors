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
      providesTags: ['Users'],
      transformResponse: (res: ApiResponse<User[]>): User[] => {
        if (!res.success) {
          toast.error('Users data fetching failed!');
          return []; // Return an empty array in case of failure
        }
        return res.data as User[]; // Return the array of users directly
      },
    }),
    updateUserSalaryGrade: builder.mutation({
      query: ({ userId, salaryGrade }) => ({
        url: `/user/salary/${userId}`,
        method: 'PATCH',
        body: { salaryGrade },
      }),
      invalidatesTags: ['Users'],
      transformResponse: (res) => {
        return res.data;
      },
    }),
    markAttendance: builder.mutation({
      query: (data) => ({
        url: `/user/attendance`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['MonthlySummary'],
    }),
    getAllMonthlySummary: builder.query({
      query: (month) => ({
        url: `/monthlySummary/${month ?? ''}`,
        method: 'GET',
      }),
      transformResponse: (res) => {
        return res.data; // Return the array of users directly
      },
      providesTags: ['MonthlySummary'],
    }),
  }),
});

export const { useGetAllUsersQuery, useUpdateUserSalaryGradeMutation, useGetAllMonthlySummaryQuery, useMarkAttendanceMutation } = userApiSlice;
