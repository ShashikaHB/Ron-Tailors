/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { ApiResponse } from '../../../types/common';
import apiSlice from '../../api/apiSlice';

export const measurementApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createMeasurement: builder.mutation({
      query: (measurementData) => ({
        url: '/measurement/',
        method: 'POST',
        body: { ...measurementData },
      }),
      transformResponse: (res: ApiResponse<any>) => {
        return res.data;
      },
    }),
  }),
});

export const { useCreateMeasurementMutation } = measurementApiSlice;
