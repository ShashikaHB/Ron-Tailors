/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import apiSlice from '../../api/apiSlice';
import { ApiResponse } from '../../../types/common';
import { ApiGetRentOrder } from '../../../types/rentOrder';

export const rentOutApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSingleRentOrder: builder.query<ApiGetRentOrder, string>({
      query: (rentOrderId: string) => ({
        url: `/rentOrder/${rentOrderId}`,
        method: 'GET',
      }),
      providesTags: (result, error, args) => (result ? [{ type: 'RentOrder', id: args?.toString() }] : []),
      transformResponse: (res: ApiResponse<ApiGetRentOrder>): any => {
        return { ...res.data, variant: 'edit' };
      },
    }),
    getAllRentOrders: builder.query<ApiGetRentOrder[], void>({
      query: () => ({
        url: `/rentOrder`,
        method: 'GET',
      }),
      providesTags: ['RentOrder'],
      transformResponse: (res: ApiResponse<ApiGetRentOrder[]>): any => {
        return res.data;
      },
    }),
    addNewRentOrder: builder.mutation({
      query: (newRentOrder) => ({
        url: '/rentOrder',
        method: 'POST',
        body: { ...newRentOrder },
      }),
      transformResponse: (res: ApiResponse<any>) => {
        return { ...res.data };
      },
      invalidatesTags: ['RentOrder'],
    }),
    searchRentOrderByItem: builder.query<ApiGetRentOrder, string>({
      query: (rentItemId: string) => ({
        url: `/rentOrder/searchItem/${rentItemId}`,
        method: 'GET',
      }),
      providesTags: (result, error, args) => (result ? [{ type: 'RentOrder', id: args?.toString() }] : []),
      transformResponse: (res: ApiResponse<ApiGetRentOrder>): any => {
        return { ...res.data, variant: 'edit' };
      },
    }),
    updateSingleRentOrder: builder.mutation<ApiResponse<any>, any>({
      query: (rentOrderData: any) => {
        return {
          url: `/rentOrder/${rentOrderData.rentOrderId}`,
          method: 'PATCH',
          body: { ...rentOrderData },
        };
      },
      invalidatesTags: (result, error, args) => (result ? [{ type: 'RentOrder', id: args.rentOrderId }, { type: 'RentOrder' }] : []),
    }),
    rentReturn: builder.mutation<ApiResponse<any>, string>({
      query: (rentOrderId: string) => ({
        url: `/rentOrder/rentReturn/${rentOrderId}`,
        method: 'POST',
      }),
      invalidatesTags: ['RentOrder', 'RentItem'],
    }),
  }),
});

export const {
  useAddNewRentOrderMutation,
  useLazyGetSingleRentOrderQuery,
  useLazySearchRentOrderByItemQuery,
  useGetAllRentOrdersQuery,
  useRentReturnMutation,
  useUpdateSingleRentOrderMutation,
} = rentOutApiSlice;
