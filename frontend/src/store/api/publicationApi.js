import { apiSlice } from "./apiSlice"

export const publicationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPublications: builder.query({
      query: (params) => {
        // Filter out undefined and empty string values
        const filteredParams = Object.fromEntries(
          Object.entries(params).filter(([key, value]) => 
            value !== undefined && value !== "" && value !== null
          )
        )
        return {
          url: "/publications",
          params: filteredParams,
        }
      },
      providesTags: ["Publication"],
    }),
    getPublicationStats: builder.query({
      query: () => "/publications/stats",
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
  useGetPublicationStatsQuery,
  useGetPublicationByIdQuery,
  useCreatePublicationMutation,
  useUpdatePublicationMutation,
  useDeletePublicationMutation,
} = publicationApi
