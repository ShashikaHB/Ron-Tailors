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
    getFilteredTransactions: builder.query({
      query: (dates) => ({
        url: '/transaction/filteredTransactions',
        method: 'POST',
        body: dates,
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
        url: '/transaction',
        method: 'POST',
        body: transaction,
      }),
      invalidatesTags: ['Transactions'],
    }),

    getAllTransactionCategories: builder.query({
      query: () => ({
        url: '/transactionCategory',
        method: 'GET',
      }),
      providesTags: ['TransactionCategory'],
      transformResponse: (response: any) => response.data,
    }),

    addCustomTransactionCategory: builder.mutation({
      query: (transactionCategory) => ({
        url: '/transactionCategory',
        method: 'POST',
        body: transactionCategory,
      }),
      invalidatesTags: ['TransactionCategory', 'DayEnd'],
    }),

    deleteTransactionCategory: builder.mutation({
      query: (transactionCategory) => ({
        url: `/transactionCategory`,
        method: 'DELETE',
        body: { transactionCategory },
      }),
      invalidatesTags: ['TransactionCategory'],
    }),
    getAllDayEndRecords: builder.query({
      query: (store) => ({
        url: `/transaction/dayend/${store}`,
        method: 'GET',
      }),
      providesTags: ['DayEnd'],
      transformResponse: (response: any) => response.data,
    }),
    getSingleDayEndRecords: builder.query({
      query: (data) => ({
        url: '/transaction/dayend',
        method: 'POST',
        body: { date: data.selectedDate, store: data.selectedStore },
      }),
      providesTags: ['DayEnd'],
      transformResponse: (response: any) => response.data,
    }),
    updateCashInHand: builder.mutation({
      query: (data) => ({
        url: '/transaction/dayend/update',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['DayEnd'],
      transformResponse: (response: any) => response.data,
    }),
  }),
});

export const {
  useGetAllTransactionsQuery,
  useAddCustomTransactionMutation,
  useLazyGetTransactionsByTimePeriodQuery,
  useAddCustomTransactionCategoryMutation,
  useDeleteTransactionCategoryMutation,
  useGetAllTransactionCategoriesQuery,
  useGetFilteredTransactionsQuery,
  useGetAllDayEndRecordsQuery,
  useGetSingleDayEndRecordsQuery,
  useUpdateCashInHandMutation,
} = transactionApiSlice;
