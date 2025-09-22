import { apiSlice } from "./apiSlice"

export const schemeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all schemes
    getSchemes: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            searchParams.append(key, params[key])
          }
        })
        return `/schemes?${searchParams.toString()}`
      },
      providesTags: ["Scheme"],
    }),
    
    // Get scheme by ID
    getSchemeById: builder.query({
      query: (id) => `/schemes/${id}`,
      providesTags: (result, error, id) => [{ type: "Scheme", id }],
    }),
    
    // Create scheme
    createScheme: builder.mutation({
      query: (schemeData) => ({
        url: "/schemes",
        method: "POST",
        body: schemeData,
      }),
      invalidatesTags: ["Scheme"],
    }),
    
    // Update scheme
    updateScheme: builder.mutation({
      query: ({ id, ...schemeData }) => ({
        url: `/schemes/${id}`,
        method: "PUT",
        body: schemeData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Scheme", id }],
    }),
    
    // Delete scheme
    deleteScheme: builder.mutation({
      query: (id) => ({
        url: `/schemes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Scheme"],
    }),
    
    // Permanently delete scheme
    permanentDeleteScheme: builder.mutation({
      query: (id) => ({
        url: `/schemes/${id}/permanent`,
        method: "DELETE",
      }),
      invalidatesTags: ["Scheme"],
    }),
    
    // Initialize default schemes
    initializeDefaultSchemes: builder.mutation({
      query: () => ({
        url: "/schemes/initialize",
        method: "POST",
      }),
      invalidatesTags: ["Scheme"],
    }),
  }),
})

export const {
  useGetSchemesQuery,
  useGetSchemeByIdQuery,
  useCreateSchemeMutation,
  useUpdateSchemeMutation,
  useDeleteSchemeMutation,
  usePermanentDeleteSchemeMutation,
  useInitializeDefaultSchemesMutation,
} = schemeApi
