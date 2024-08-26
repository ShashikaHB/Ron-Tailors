/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import apiSlice from '../../api/apiSlice';
import { ApiResponse } from '../../../types/common';
import handleApiResponse from '../../../utils/handleApiResponse';

export const salaryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSalary: builder.query<any, void>({
      query: () => ({
        url: '/salary',
        method: 'GET',
      }),
      providesTags: ['Salary'],
      transformResponse: (res: ApiResponse<any>) => {
        const data = handleApiResponse(res);
        return { ...data, variant: 'edit' as const };
      },
    }),
    createSalary: builder.mutation<ApiResponse, any>({
      query: (newSalary) => ({
        url: '/salary',
        method: 'POST',
        body: { ...newSalary },
      }),
      invalidatesTags: ['Salary'],
      transformResponse: (res: ApiResponse) => handleApiResponse(res, 'Salary created successfully!'),
    }),
    updateSalary: builder.mutation<ApiResponse, any>({
      query: (salary: any) => {
        return {
          url: `/salary`,
          method: 'PATCH',
          body: salary,
        };
      },
      invalidatesTags: ['Salary'],
      transformResponse: (res: ApiResponse) => handleApiResponse(res, 'Salary updated successfully!'),
    }),
  }),
});

export const { useGetSalaryQuery, useCreateSalaryMutation, useUpdateSalaryMutation } = salaryApiSlice;
