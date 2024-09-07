/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import apiSlice from '../../api/apiSlice';
import { ApiResponse } from '../../../types/common';

export const piecePriceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create piece prices
    createPiecePrices: builder.mutation<ApiResponse<any>, any>({
      query: (piecePrices) => ({
        url: '/pieces',
        method: 'POST',
        body: piecePrices,
      }),
      invalidatesTags: ['PiecePrices'],
    }),

    // Update piece prices by type
    updatePiecePrices: builder.mutation<ApiResponse<any>, { type: string; prices: any }>({
      query: ({ type, prices }) => ({
        url: `/pieces/${type}`,
        method: 'PATCH',
        body: prices,
      }),
      invalidatesTags: ['PiecePrices'],
    }),

    // Get piece prices by type
    getPiecePricesByType: builder.query<ApiResponse<any>, string>({
      query: (type) => ({
        url: `/pieces/${type}`,
        method: 'GET',
      }),
      providesTags: ['PiecePrices'],
      transformResponse: (res: ApiResponse<any>): any => res.data,
    }),

    // Delete piece prices by type
    deletePiecePricesByType: builder.mutation<ApiResponse<any>, string>({
      query: (type) => ({
        url: `/pieces/${type}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PiecePrices'],
    }),
  }),
});

export const { useCreatePiecePricesMutation, useUpdatePiecePricesMutation, useGetPiecePricesByTypeQuery, useDeletePiecePricesByTypeMutation } =
  piecePriceApiSlice;
