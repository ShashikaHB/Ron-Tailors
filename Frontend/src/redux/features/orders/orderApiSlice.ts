/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { toast } from 'sonner';
import apiSlice from '../../api/apiSlice';
import { ApiResponse } from '../../../types/common';
import { CustomerSchema } from '../../../forms/formSchemas/customerSchema';
import handleApiResponse from '../../../utils/handleApiResponse';

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllSalesOrders: builder.query<any, string>({
      query: () => ({
        url: '/salesOrder',
        method: 'GET',
      }),
      providesTags: ['SalesOrder'],
      transformResponse: (res: ApiResponse<any[]>): any => {
        if (!res.success) {
          toast.error('Material data fetching failed!');
        }
        return res.data;
      },
    }),
    getSingleSalesOrder: builder.query<any, string>({
      query: (salesOrderId: string) => ({
        url: `/salesOrder/${salesOrderId}`,
        method: 'GET',
      }),
      providesTags: (result, error, args) => (result ? [{ type: 'SalesOrder', id: args?.toString() }] : []),
      transformResponse: (res: ApiResponse<any>): any => {
        if (!res.success) {
          return [];
        }
        return { ...res.data, variant: 'edit' };
      },
    }),
    addNewOrder: builder.mutation({
      query: (newOrder) => ({
        url: '/salesOrder',
        method: 'POST',
        body: { ...newOrder },
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transformResponse: (res: ApiResponse<any>) => {
        if (!res.success) {
          toast.error('Order creation failed.');
        }
        return { ...res.data };
      },
      invalidatesTags: ['SalesOrder', 'Transactions', 'DayEnd', 'RentOrder'],
    }),
    searchCustomer: builder.query<CustomerSchema, string>({
      query: (customerQuery) => ({
        url: `/customer/searchCustomer?searchQuery=${customerQuery}`,
        method: 'GET',
      }),
      transformResponse: (res: ApiResponse<CustomerSchema>): CustomerSchema => handleApiResponse(res, 'Customer search successful!'),
    }),
    updateSalesOrder: builder.mutation<ApiResponse<string>, any>({
      query: (salesOrderData: any) => {
        return {
          url: `/salesOrder/${salesOrderData.salesOrderId}`,
          method: 'PATCH',
          body: { ...salesOrderData },
        };
      },
      invalidatesTags: (result, error, args) => (result ? [{ type: 'SalesOrder', id: args.salesOrderId }, { type: 'SalesOrder' }] : []),
    }),
    addReadyMadeItemOrder: builder.mutation<ApiResponse<string>, any>({
      query: (data: any) => {
        return {
          url: `/readyMade/`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['Transactions', 'DayEnd'],
    }),
    getSalesOrRentOrderForPayment: builder.query<any, any>({
      query: (orderId: any) => {
        return {
          url: `/salesOrder/payment/${orderId}`,
          method: 'GET',
        };
      },
      transformResponse: (res: any): any => {
        return res.data;
      },
      providesTags: ['Payment'],
    }),
    updateSalesOrRentPayment: builder.mutation<any, any>({
      query: (data: any) => {
        return {
          url: `/salesOrder/payment/${data.orderId}`,
          method: 'POST',
          body: data.orderData,
        };
      },
      invalidatesTags: ['Transactions', 'Payment'],
    }),
    updateFitOnData: builder.mutation<ApiResponse<string>, any>({
      query: (data: any) => {
        return {
          url: `/salesOrder/updateFitOn`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['SalesOrder'],
    }),
  }),
});

export const {
  useLazySearchCustomerQuery,
  useAddNewOrderMutation,
  useGetAllSalesOrdersQuery,
  useLazyGetSingleSalesOrderQuery,
  useUpdateSalesOrderMutation,
  useAddReadyMadeItemOrderMutation,
  useLazyGetSalesOrRentOrderForPaymentQuery,
  useUpdateSalesOrRentPaymentMutation,
  useUpdateFitOnDataMutation,
} = orderApiSlice;
