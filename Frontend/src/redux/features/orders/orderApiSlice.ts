/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { toast } from 'sonner';
import { omit } from 'lodash';
import { GetMaterial } from '../../../types/material';
import { apiSlice } from '../../api/apiSlice';
import { ApiResponse } from '../../../types/common';
import { MaterialSchema } from '../../../forms/formSchemas/materialsSchema';
import { CustomerSchema } from '../../../forms/formSchemas/customerSchema';

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
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
        } else {
          toast.success('New order created.');
          return { ...res.data };
        }
      },
      invalidatesTags: ['Orders'],
    }),
    addNewRentOrder: builder.mutation({
      query: (newRentOrder) => ({
        url: '/rentOrder',
        method: 'POST',
        body: { ...newRentOrder },
      }),
      transformResponse: (res: ApiResponse<any>) => {
        if (!res.success) {
          toast.error('Rent order creation failed.');
        } else {
          toast.success('New rent order created.');
          return { ...res.data };
        }
      },
      invalidatesTags: ['RentOrder']
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
    getSingleMaterial: builder.query<GetMaterial, number>({
      query: (id: number) => ({
        url: `/material/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, args) => (result ? [{ type: 'Materials', id: args?.toString() }] : []),
      transformResponse: (res: ApiResponse<GetMaterial>): any => {
        if (!res.success) {
          toast.error('Material data fetching failed!');
        }
        return { ...res.data, variant: 'edit' };
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

export const { useLazySearchCustomerQuery, useAddNewOrderMutation, useAddNewRentOrderMutation } = orderApiSlice;
