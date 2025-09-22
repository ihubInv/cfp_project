import { apiSlice } from "./apiSlice"

export const manpowerTypeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all manpower types
    getAllManpowerTypes: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== "" && params[key] !== "all") {
            searchParams.append(key, params[key])
          }
        })
        return `/manpower-types?${searchParams.toString()}`
      },
      providesTags: ["ManpowerType"],
    }),

    // Get manpower type by ID
    getManpowerTypeById: builder.query({
      query: (id) => `/manpower-types/${id}`,
      providesTags: (result, error, id) => [{ type: "ManpowerType", id }],
    }),

    // Create manpower type
    createManpowerType: builder.mutation({
      query: (manpowerTypeData) => ({
        url: "/manpower-types",
        method: "POST",
        body: manpowerTypeData,
      }),
      invalidatesTags: ["ManpowerType"],
    }),

    // Update manpower type
    updateManpowerType: builder.mutation({
      query: ({ id, ...manpowerTypeData }) => ({
        url: `/manpower-types/${id}`,
        method: "PUT",
        body: manpowerTypeData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "ManpowerType", id }],
    }),

    // Delete manpower type
    deleteManpowerType: builder.mutation({
      query: (id) => ({
        url: `/manpower-types/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ManpowerType"],
    }),

    // Get manpower type statistics
    getManpowerTypeStats: builder.query({
      query: () => "/manpower-types/stats",
      providesTags: ["ManpowerType"],
    }),
  }),
})

export const {
  useGetAllManpowerTypesQuery,
  useGetManpowerTypeByIdQuery,
  useCreateManpowerTypeMutation,
  useUpdateManpowerTypeMutation,
  useDeleteManpowerTypeMutation,
  useGetManpowerTypeStatsQuery,
} = manpowerTypeApi
