import { apiSlice } from "./apiSlice"

export const piProjectApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all PI projects (Admin only)
    getAllPIProjects: builder.query({
      query: (params) => {
        const searchParams = new URLSearchParams()
        Object.keys(params).forEach((key) => {
          if (params[key] && params[key] !== "all") {
            searchParams.append(key, params[key])
          }
        })
        return `/pi-projects?${searchParams.toString()}`
      },
      providesTags: ["PIProject"],
    }),
    
    // Get PI's own projects
    getMyPIProjects: builder.query({
      query: (params) => {
        const searchParams = new URLSearchParams()
        Object.keys(params).forEach((key) => {
          if (params[key] && params[key] !== "all") {
            searchParams.append(key, params[key])
          }
        })
        return `/pi-projects/my-projects?${searchParams.toString()}`
      },
      providesTags: ["PIProject"],
    }),
    
    // Get single PI project
    getPIProjectById: builder.query({
      query: (id) => `/pi-projects/${id}`,
      providesTags: (result, error, id) => [{ type: "PIProject", id }],
    }),
    
    // Get PI project statistics
    getPIProjectStats: builder.query({
      query: () => "/pi-projects/stats",
      providesTags: ["PIProject"],
    }),
    
    // Create new PI project
    createPIProject: builder.mutation({
      query: (projectData) => ({
        url: "/pi-projects",
        method: "POST",
        body: projectData,
      }),
      invalidatesTags: ["PIProject"],
    }),
    
    // Update PI project
    updatePIProject: builder.mutation({
      query: ({ id, ...projectData }) => ({
        url: `/pi-projects/${id}`,
        method: "PUT",
        body: projectData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "PIProject", id },
        "PIProject",
      ],
    }),
    
    // Upload project documents
    uploadProjectDocuments: builder.mutation({
      query: ({ projectId, formData }) => ({
        url: `/pi-projects/${projectId}/documents`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "PIProject", id: projectId },
        "PIProject",
      ],
    }),
    
    // Submit progress report
    submitProgressReport: builder.mutation({
      query: ({ projectId, reportData }) => ({
        url: `/pi-projects/${projectId}/progress-report`,
        method: "POST",
        body: reportData,
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "PIProject", id: projectId },
        "PIProject",
      ],
    }),
    
    // Admin review project
    reviewProject: builder.mutation({
      query: ({ projectId, reviewData }) => ({
        url: `/pi-projects/${projectId}/review`,
        method: "POST",
        body: reviewData,
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "PIProject", id: projectId },
        "PIProject",
      ],
    }),
  }),
})

export const {
  useGetAllPIProjectsQuery,
  useGetMyPIProjectsQuery,
  useGetPIProjectByIdQuery,
  useGetPIProjectStatsQuery,
  useCreatePIProjectMutation,
  useUpdatePIProjectMutation,
  useUploadProjectDocumentsMutation,
  useSubmitProgressReportMutation,
  useReviewProjectMutation,
} = piProjectApi
