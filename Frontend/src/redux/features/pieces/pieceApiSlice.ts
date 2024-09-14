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
    createEditPiecePrices: builder.mutation<ApiResponse<any>, any>({
      query: (piecePrices) => ({
        url: '/pieces',
        method: 'POST',
        body: piecePrices,
      }),
      invalidatesTags: ['PiecePrices'],
    }),
    getAllPiecePrices: builder.query<any, void>({
      query: () => ({
        url: '/salesOrder',
        method: 'GET',
      }),
      providesTags: ['SalesOrder'],
      transformResponse: (res: ApiResponse<any[]>): any => {
        return res.data;
      },
    }),
  }),
});

export const { useCreateEditPiecePricesMutation, useGetAllPiecePricesQuery } = piecePriceApiSlice;
