/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { omit } from 'lodash';
import { GetMaterial, Material } from '../../../types/material';
import apiSlice from '../../api/apiSlice';
import { ApiResponse } from '../../../types/common';
import { MaterialSchema } from '../../../forms/formSchemas/materialsSchema';

export const materialApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addNewMaterial: builder.mutation<ApiResponse<string>, MaterialSchema>({
      query: (newMaterial) => ({
        url: '/material',
        method: 'POST',
        body: { ...newMaterial },
      }),
      invalidatesTags: ['Materials'],
    }),
    getAllMaterials: builder.query<Material[], void>({
      query: () => ({
        url: '/material',
        method: 'GET',
      }),
      providesTags: ['Materials'],
      transformResponse: (res: ApiResponse<Material[]>): Material[] => {
        return res.data as Material[];
      },
    }),
    getSingleMaterial: builder.query<GetMaterial, string>({
      query: (id: string) => ({
        url: `/material/${id}`,
        method: 'GET',
      }),
      providesTags: (result, _error, args) => (result ? [{ type: 'Materials', id: args?.toString() }] : []),
      transformResponse: (res: ApiResponse<GetMaterial>): any => {
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
      invalidatesTags: ['Materials'],
    }),
    deleteNewMaterial: builder.mutation<ApiResponse, string>({
      query: (materialId) => ({
        url: `/material/${materialId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Materials'],
    }),
  }),
});

export const { useGetAllMaterialsQuery, useAddNewMaterialMutation, useGetSingleMaterialQuery, useUpdateSingleMaterialMutation, useDeleteNewMaterialMutation } =
  materialApiSlice;
