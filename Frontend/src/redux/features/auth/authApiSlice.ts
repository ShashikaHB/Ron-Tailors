import { UserRegistrationSchema } from "../../../forms/formSchemas/userRegistrationSchema";
import { ApiResponse, AuthResponse } from "../../../types/common";
import { User } from "../../../types/user.ts";
import { apiSlice } from "../../api/apiSlice.ts";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    register: builder.mutation<AuthResponse, UserRegistrationSchema>({
      query: (registerData: UserRegistrationSchema) => ({
        url: "/auth/register",
        method: "POST",
        body: { ...registerData },
      }),
    }),
    logout: builder.query({
      query: () => ({
        url: "/auth/logout",
        method: "GET",
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useLazyLogoutQuery } =
  authApiSlice;
