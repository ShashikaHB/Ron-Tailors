/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { UserRegistrationSchema } from '../../../forms/formSchemas/userRegistrationSchema';
import { AuthResponse } from '../../../types/common';
import apiSlice from '../../api/apiSlice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: { ...credentials },
      }),
    }),
    register: builder.mutation<AuthResponse, UserRegistrationSchema>({
      query: (registerData: UserRegistrationSchema) => ({
        url: '/auth/register',
        method: 'POST',
        body: { ...registerData },
      }),
    }),
    logout: builder.query({
      query: () => ({
        url: '/auth/logout',
        method: 'GET',
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useLazyLogoutQuery } = authApiSlice;
