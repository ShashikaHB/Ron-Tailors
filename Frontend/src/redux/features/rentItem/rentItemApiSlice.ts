/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import apiSlice from '../../api/apiSlice';
import { ApiResponse } from '../../../types/common';
import { RentItemSchema } from '../../../forms/formSchemas/rentItemSchema';
import { ApiGetRentItem } from '../../../types/rentItem';
import { GetMaterial } from '../../../types/material';
import handleApiResponse from '../../../utils/handleApiResponse';

export const rentItemApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllRentItems: builder.query<ApiGetRentItem[], void>({
      query: () => ({
        url: '/rentItem',
        method: 'GET',
      }),
      providesTags: ['RentItem'],
      transformResponse: (res: ApiResponse<ApiGetRentItem[]>) => {
        const data = handleApiResponse(res);
        return (data ?? []).map((item) => ({
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
        const data = handleApiResponse(res);
        if (data) {
          return { ...data, variant: 'edit' };
        }
        return null;
      },
    }),
    addNewRentItem: builder.mutation<ApiResponse, RentItemSchema>({
      query: (addNewRentItem) => ({
        url: '/rentItem',
        method: 'POST',
        body: { ...addNewRentItem },
      }),
      invalidatesTags: ['RentItem'],
      transformResponse: (res: ApiResponse) => handleApiResponse(res, 'Rent Item added Successfully!'),
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
      invalidatesTags: (result, error, args) => {
        if (args.variant === 'edit') {
          return [{ type: 'RentItem', id: args.rentItemId.toString() }];
        }
        return [];
      },
      transformResponse: (res: ApiResponse) => handleApiResponse(res, 'Rent Item updated Successfully!'),
    }),
    deleteRentItem: builder.mutation<ApiResponse, number>({
      query: (itemId) => ({
        url: `/rentItem/${itemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['RentItem'],
      transformResponse: (res: ApiResponse) => handleApiResponse(res, 'Rent Item deleted Successfully!'),
    }),
  }),
});

export const { useGetAllRentItemsQuery, useAddNewRentItemMutation, useUpdateSingleRentItemMutation, useLazyGetSingleRentItemQuery, useDeleteRentItemMutation } =
  rentItemApiSlice;
