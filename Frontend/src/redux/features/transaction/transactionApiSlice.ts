/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import apiSlice from '../../api/apiSlice';

export const transactionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllTransactions: builder.query({
      query: () => ({
        url: '/transaction',
        method: 'GET',
      }),
      providesTags: ['Transactions'],
      transformResponse: (response: any) => response.data,
    }),
    getTransactionsByTimePeriod: builder.query({
      query: (timePeriod) => ({
        url: `/transactions?timePeriod=${timePeriod}`,
        method: 'POST',
      }),
      providesTags: ['Transactions'],
      transformResponse: (response: any) => response.data,
    }),
    addCustomTransaction: builder.mutation({
      query: (transaction) => ({
        url: '/transactions',
        method: 'POST',
        body: transaction,
      }),
      invalidatesTags: ['Transactions'],
    }),
  }),
});

export const { useGetAllTransactionsQuery, useAddCustomTransactionMutation, useLazyGetTransactionsByTimePeriodQuery } = transactionApiSlice;
