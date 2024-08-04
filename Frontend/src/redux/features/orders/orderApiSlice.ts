/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { toast } from 'sonner';
import { omit } from 'lodash';
import apiSlice from '../../api/apiSlice';
import { ApiResponse } from '../../../types/common';
import { MaterialSchema } from '../../../forms/formSchemas/materialsSchema';
import { CustomerSchema } from '../../../forms/formSchemas/customerSchema';
import { ApiGetRentItem } from '../../../types/rentItem';

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
    getSingleSalesOrder: builder.query<ApiGetRentItem, string>({
      query: (rentItemId: string) => ({
        url: `/rentOrder/${rentItemId}`,
        method: 'GET',
      }),
      providesTags: (result, error, args) => (result ? [{ type: 'RentOrder', id: args?.toString() }] : []),
      transformResponse: (res: ApiResponse<ApiGetRentItem>): any => {
        if (!res.success) {
          toast.error('Material data fetching failed!');
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
      invalidatesTags: ['SalesOrder'],
    }),
    searchCustomer: builder.query<CustomerSchema, string>({
      query: (customerQuery) => ({
        url: `/customer/searchCustomer?searchQuery=${customerQuery}`,
        method: 'GET',
      }),
      providesTags: ['Customer'],
      transformResponse: (res: ApiResponse<CustomerSchema>): CustomerSchema => {
        if (!res.success) {
          toast.error('Customer search failed!');
        }
        return res.data as CustomerSchema;
      },
    }),
    updateSingleMaterial: builder.mutation<ApiResponse<string>, MaterialSchema>({
      query: (material: MaterialSchema) => {
        if (material.variant === 'edit') {
          const materialData = omit(material, ['variant', 'materialId']);
          return {
            url: `/material/${material.materialId}`,
            method: 'PATCH',
            body: materialData,
          };
        }
        throw new Error('Unsupported variant type for update.');
      },
      invalidatesTags: (
        result: any,
        error: any,
        args: {
          variant: string;
          materialId: { toString: () => any };
        }
      ) => [
        {
          type: 'Materials',
          id: args?.variant === 'edit' ? args.materialId.toString() : 'unknown',
        },
        { type: 'Materials' },
      ],
    }),
  }),
});

export const { useLazySearchCustomerQuery, useAddNewOrderMutation, useGetAllSalesOrdersQuery } = orderApiSlice;
