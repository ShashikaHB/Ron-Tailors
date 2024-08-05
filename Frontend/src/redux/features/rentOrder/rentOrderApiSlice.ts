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
        if (!res.success) {
          toast.error('Material data fetching failed!');
        }
        return { ...res.data, variant: 'edit' };
      },
    }),
    getAllRentOrders: builder.query<ApiGetRentOrder[], void>({
      query: () => ({
        url: `/rentOrder`,
        method: 'GET',
      }),
      providesTags: (result, error, args) => (result ? [{ type: 'RentOrder', id: args?.toString() }] : []),
      transformResponse: (res: ApiResponse<ApiGetRentOrder[]>): any => {
        if (!res.success) {
          toast.error('Material data fetching failed!');
        }
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
        if (!res.success) {
          toast.error('Rent order creation failed.');
        } else {
          return { ...res.data };
        }
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

export const { useAddNewRentOrderMutation, useLazyGetSingleRentOrderQuery, useLazySearchRentOrderByItemQuery, useGetAllRentOrdersQuery } = rentOutApiSlice;
