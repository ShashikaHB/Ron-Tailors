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
    updatePiecePrices: builder.mutation<ApiResponse<any>, any>({
      query: (piecePrices) => ({
        url: '/pieces',
        method: 'POST',
        body: piecePrices,
      }),
      invalidatesTags: ['PiecePrices'],
    }),
    getAllPiecePrices: builder.query<any, void>({
      query: () => ({
        url: '/pieces',
        method: 'GET',
      }),
      providesTags: ['PiecePrices'],
      transformResponse: (res: ApiResponse<any[]>): any => {
        return { items: res.data };
      },
    }),
  }),
});

export const { useUpdatePiecePricesMutation, useGetAllPiecePricesQuery } = piecePriceApiSlice;
