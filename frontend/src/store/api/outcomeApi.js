import { apiSlice } from "./apiSlice"

export const outcomeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOutcomes: builder.query({
      query: (params) => ({
        url: "/outcomes",
        params,
      }),
      providesTags: ["Outcome"],
    }),
    getOutcomeById: builder.query({
      query: (id) => `/outcomes/${id}`,
      providesTags: (result, error, id) => [{ type: "Outcome", id }],
    }),
    createOutcome: builder.mutation({
      query: (data) => ({
        url: "/outcomes",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Outcome"],
    }),
    updateOutcome: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/outcomes/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Outcome", id }],
    }),
    deleteOutcome: builder.mutation({
      query: (id) => ({
        url: `/outcomes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Outcome"],
    }),
  }),
})

export const {
  useGetOutcomesQuery,
  useGetOutcomeByIdQuery,
  useCreateOutcomeMutation,
  useUpdateOutcomeMutation,
  useDeleteOutcomeMutation,
} = outcomeApi
