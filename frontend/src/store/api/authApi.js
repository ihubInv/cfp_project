import { apiSlice } from "./apiSlice"

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    refreshToken: builder.mutation({
      query: (refreshToken) => ({
        url: "/auth/refresh-token",
        method: "POST",
        body: { refreshToken },
      }),
    }),
  }),
})

export const { useLoginMutation, useRegisterMutation, useLogoutMutation, useRefreshTokenMutation } = authApi
