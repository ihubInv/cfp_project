import { apiSlice } from "./apiSlice"

export const disciplineApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all disciplines
    getDisciplines: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            searchParams.append(key, params[key])
          }
        })
        return `/categories?${searchParams.toString()}`
      },
      providesTags: ["Discipline"],
    }),
    
    // Get discipline by ID
    getDisciplineById: builder.query({
      query: (id) => `/categories/${id}`,
      providesTags: (result, error, id) => [{ type: "Discipline", id }],
    }),
    
    // Create discipline
    createDiscipline: builder.mutation({
      query: (disciplineData) => ({
        url: "/categories",
        method: "POST",
        body: disciplineData,
      }),
      invalidatesTags: ["Discipline"],
    }),
    
    // Update discipline
    updateDiscipline: builder.mutation({
      query: ({ id, ...disciplineData }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        body: disciplineData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Discipline", id },
        "Discipline"
      ],
    }),
    
    // Delete discipline
    deleteDiscipline: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Discipline"],
    }),
    
    // Initialize default disciplines
    initializeDefaultDisciplines: builder.mutation({
      query: () => ({
        url: "/categories/initialize",
        method: "POST",
      }),
      invalidatesTags: ["Discipline"],
    }),
  }),
})

// Backward compatibility exports (aliases)
export const categoryApi = disciplineApi

export const {
  useGetDisciplinesQuery,
  useGetDisciplineByIdQuery,
  useCreateDisciplineMutation,
  useUpdateDisciplineMutation,
  useDeleteDisciplineMutation,
  useInitializeDefaultDisciplinesMutation,
  // Keep old exports for backward compatibility
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useInitializeDefaultCategoriesMutation,
} = disciplineApi
