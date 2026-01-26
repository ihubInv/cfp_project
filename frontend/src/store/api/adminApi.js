import { apiSlice } from "./apiSlice"

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // User Management
    getAllUsers: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        Object.keys(params).forEach((key) => {
          if (params[key] && params[key] !== "All Roles" && params[key] !== "All") {
            searchParams.append(key, params[key])
          }
        })
        return `/users?${searchParams.toString()}`
      },
      providesTags: ["User"],
    }),
    createUser: builder.mutation({
      query: (userData) => ({
        url: "/users",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...userData }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    getUserStats: builder.query({
      query: () => "/users/stats",
      providesTags: ["User"],
    }),

    // Project Management
    getAllProjectsAdmin: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        Object.keys(params).forEach((key) => {
          if (params[key]) {
            searchParams.append(key, params[key])
          }
        })
        return `/projects?${searchParams.toString()}`
      },
      providesTags: ["Project"],
    }),
    getProjectById: builder.query({
      query: (id) => `/projects/${id}`,
      providesTags: (result, error, id) => [{ type: "Project", id }],
    }),
    createProject: builder.mutation({
      query: (projectData) => ({
        url: "/projects",
        method: "POST",
        body: projectData,
      }),
      invalidatesTags: ["Project"],
    }),
    updateProject: builder.mutation({
      query: ({ id, ...projectData }) => ({
        url: `/projects/${id}`,
        method: "PUT",
        body: projectData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Project", id },
        "Project", // Also invalidate the list query
      ],
    }),
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Project"],
    }),

    // Analytics
    getDashboardStats: builder.query({
      query: () => "/analytics/dashboard",
      providesTags: ["Analytics"],
    }),

    // Equipment Sync
    syncProjectEquipment: builder.mutation({
      query: () => ({
        url: "/projects/sync-equipment",
        method: "POST",
      }),
      invalidatesTags: ["Equipment", "Project"],
    }),
  }),
})

export const {
  useGetAllUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUserStatsQuery,
  useGetAllProjectsAdminQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetDashboardStatsQuery,
  useSyncProjectEquipmentMutation,
} = adminApi
