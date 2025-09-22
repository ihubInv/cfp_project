import { apiSlice } from "./apiSlice"

export const publicationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPublications: builder.query({
      query: (params) => ({
        url: "/publications",
        params,
      }),
      providesTags: ["Publication"],
    }),
    getPublicationById: builder.query({
      query: (id) => `/publications/${id}`,
      providesTags: (result, error, id) => [{ type: "Publication", id }],
    }),
    createPublication: builder.mutation({
      query: (data) => ({
        url: "/publications",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Publication"],
    }),
    updatePublication: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/publications/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Publication", id }],
    }),
    deletePublication: builder.mutation({
      query: (id) => ({
        url: `/publications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Publication"],
    }),
  }),
})

export const {
  useGetPublicationsQuery,
  useGetPublicationByIdQuery,
  useCreatePublicationMutation,
  useUpdatePublicationMutation,
  useDeletePublicationMutation,
} = publicationApi
