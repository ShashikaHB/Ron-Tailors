/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { toast } from 'sonner';
import apiSlice from '../../api/apiSlice';
import { ApiResponse } from '../../../types/common';
import { RentItemSchema } from '../../../forms/formSchemas/rentItemSchema';
import { ApiGetRentItem } from '../../../types/rentItem';
import { GetMaterial } from '../../../types/material';

export const rentItemApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addNewRentItem: builder.mutation<ApiResponse, RentItemSchema>({
      query: (addNewRentItem) => ({
        url: '/rentItem',
        method: 'POST',
        body: { ...addNewRentItem },
      }),
      invalidatesTags: ['RentItem'],
    }),
    getAllRentItems: builder.query<ApiGetRentItem[], void>({
      query: () => ({
        url: '/rentItem',
        method: 'GET',
      }),
      providesTags: ['RentItem'],
      transformResponse: (res: ApiResponse<ApiGetRentItem[]>) => {
        if (!res.success) {
          toast.error('Material data fetching failed!');
          return [];
        }
        return (res.data ?? []).map((item) => ({
          ...item,
          variant: 'edit' as const,
        }));
      },
    }),
    getSingleRentItem: builder.query<ApiGetRentItem, number>({
      query: (id: number) => ({
        url: `/rentItem/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, args) => (result ? [{ type: 'RentItem', id: args?.toString() }] : []),
      transformResponse: (res: ApiResponse<GetMaterial>): any => {
        if (!res.success) {
          toast.error('Material data fetching failed!');
        }
        return { ...res.data, variant: 'edit' };
      },
    }),
    updateSingleRentItem: builder.mutation<ApiResponse, RentItemSchema>({
      query: (rentItem: RentItemSchema) => {
        if (rentItem.variant === 'edit') {
          return {
            url: `/rentItem/${rentItem.rentItemId}`,
            method: 'PATCH',
            body: rentItem,
          };
        }
        throw new Error('Unsupported variant type for update.');
      },
      invalidatesTags: (result: any, error: any, args: { variant: string; rentItemId: { toString: () => any } }) => [
        {
          type: 'RentItem',
          id: args?.variant === 'edit' ? args.rentItemId?.toString() : 'unknown',
        },
        { type: 'RentItem' },
      ],
    }),
  }),
});

export const { useGetAllRentItemsQuery, useAddNewRentItemMutation, useUpdateSingleRentItemMutation, useLazyGetSingleRentItemQuery } = rentItemApiSlice;
