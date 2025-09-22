import { apiSlice } from "./apiSlice"

export const equipmentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEquipment: builder.query({
      query: (params) => {
        // Filter out undefined and empty string values
        const filteredParams = Object.fromEntries(
          Object.entries(params).filter(([key, value]) => 
            value !== undefined && value !== "" && value !== null
          )
        )
        return {
          url: "/equipment",
          params: filteredParams,
        }
      },
      providesTags: ["Equipment"],
    }),
    getEquipmentById: builder.query({
      query: (id) => `/equipment/${id}`,
      providesTags: (result, error, id) => [{ type: "Equipment", id }],
    }),
    createEquipment: builder.mutation({
      query: (data) => ({
        url: "/equipment",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Equipment"],
    }),
    updateEquipment: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/equipment/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Equipment", id }],
    }),
    deleteEquipment: builder.mutation({
      query: (id) => ({
        url: `/equipment/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Equipment"],
    }),
  }),
})

export const {
  useGetEquipmentQuery,
  useGetEquipmentByIdQuery,
  useCreateEquipmentMutation,
  useUpdateEquipmentMutation,
  useDeleteEquipmentMutation,
} = equipmentApi
