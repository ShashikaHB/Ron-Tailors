/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { toast } from 'sonner';
import { ProductSchema } from '../../../forms/formSchemas/productSchema';
import { ApiResponse } from '../../../types/common';
import apiSlice from '../../api/apiSlice';
import { ApiGetRentItem } from '../../../types/rentItem';

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addNewProduct: builder.mutation<any, ProductSchema>({
      query: (newProduct) => ({
        url: '/product',
        method: 'POST',
        body: { ...newProduct },
      }),
      transformResponse: (res: ApiResponse<any>): any => {
        if (!res.success) {
          toast.error('Product creation failed!');
        }
        return res.data.productId;
      },
      invalidatesTags: ['Products'],
    }),
    getAllProducts: builder.query({
      query: () => ({
        url: '/product',
        method: 'GET',
      }),
      transformResponse: (res: ApiResponse<any>) => {
        if (!res.success) {
          toast.error('Product fetching failed.');
        }
        return res.data;
      },
      providesTags: ['Products'],
    }),
    getSingleProduct: builder.query({
      query: (productId) => ({
        url: `/product/${productId}`,
        method: 'GET',
      }),
      transformResponse: (res: ApiResponse<any>) => {
        if (!res.success) {
          toast.error('Product fetching failed.');
        }
        return res.data;
      },
      providesTags: ['Products'],
    }),
    updateSingleProduct: builder.mutation({
      query: (data) => ({
        url: `/measurement/${data.productId}`,
        method: 'PATCH',
        body: { ...data.measurement },
      }),
      transformResponse: (res: ApiResponse<any>) => {
        toast.success('New measurement created.');
        return res.data;
      },
    }),
    updateProductStatus: builder.mutation({
      query: ({ status, productId }: { status: string; productId: number }) => ({
        url: `/product/updateStatus/${productId}`,
        method: 'PATCH',
        body: { status },
      }),
      transformResponse: (res: ApiResponse<any>) => {
        toast.success('Product Status updated..');
        return res.data;
      },
      invalidatesTags: ['SalesOrder'],
    }),
    searchRentItem: builder.query<ApiGetRentItem, string>({
      query: (rentItemId: string) => ({
        url: `/rentItem/searchRentItem?searchQuery=${rentItemId}`,
        method: 'GET',
      }),
      providesTags: ['Products'],
      transformResponse: (res: ApiResponse<ApiGetRentItem>): ApiGetRentItem => {
        if (!res.success) {
          toast.error('Product search failed!');
        }
        return { ...res.data, variant: 'edit' } as ApiGetRentItem;
      },
    }),
  }),
});

export const {
  useAddNewProductMutation,
  useGetAllProductsQuery,
  useGetSingleProductQuery,
  useUpdateSingleProductMutation,
  useLazySearchRentItemQuery,
  useUpdateProductStatusMutation,
} = productApiSlice;
