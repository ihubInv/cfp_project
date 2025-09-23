import { apiSlice } from "./apiSlice"

export const onlineApplicationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all online applications (admin)
    getOnlineApplications: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null) {
            searchParams.append(key, params[key])
          }
        })
        return `/online-applications?${searchParams.toString()}`
      },
      providesTags: ["OnlineApplication"],
    }),
    
    // Get online application by ID
    getOnlineApplicationById: builder.query({
      query: (id) => `/online-applications/${id}`,
      providesTags: (result, error, id) => [{ type: "OnlineApplication", id }],
    }),
    
    // Submit new online application (public)
    submitOnlineApplication: builder.mutation({
      query: (applicationData) => ({
        url: "/online-applications",
        method: "POST",
        body: applicationData,
      }),
      invalidatesTags: ["OnlineApplication"],
    }),
    
    // Update application status (admin)
    updateApplicationStatus: builder.mutation({
      query: ({ id, status, comments }) => ({
        url: `/online-applications/${id}/status`,
        method: "PUT",
        body: { status, comments },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "OnlineApplication", id }],
    }),
    
    // Delete online application (admin)
    deleteOnlineApplication: builder.mutation({
      query: (id) => ({
        url: `/online-applications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["OnlineApplication"],
    }),
    
    // Get application statistics (admin)
    getApplicationStats: builder.query({
      query: () => "/online-applications/stats",
      providesTags: ["OnlineApplication"],
    }),
    
    // Get application settings (admin)
    getApplicationSettings: builder.query({
      query: () => "/online-applications/settings",
      providesTags: ["ApplicationSettings"],
    }),
    
    // Update application settings (admin)
    updateApplicationSettings: builder.mutation({
      query: (settings) => ({
        url: "/online-applications/settings",
        method: "PUT",
        body: settings,
      }),
      invalidatesTags: ["ApplicationSettings"],
    }),
    
    // Download application document
    downloadApplicationDocument: builder.mutation({
      query: ({ applicationId, documentType }) => ({
        url: `/online-applications/${applicationId}/download/${documentType}`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),
    
    // Export applications to CSV (admin)
    exportApplications: builder.mutation({
      query: (params = {}) => ({
        url: "/online-applications/export",
        method: "POST",
        body: params,
        responseHandler: (response) => response.blob(),
      }),
    }),
    
    // Bulk update application status (admin)
    bulkUpdateApplicationStatus: builder.mutation({
      query: ({ applicationIds, status, comments }) => ({
        url: "/online-applications/bulk-update",
        method: "PUT",
        body: { applicationIds, status, comments },
      }),
      invalidatesTags: ["OnlineApplication"],
    }),
  }),
})

export const {
  useGetOnlineApplicationsQuery,
  useGetOnlineApplicationByIdQuery,
  useSubmitOnlineApplicationMutation,
  useUpdateApplicationStatusMutation,
  useDeleteOnlineApplicationMutation,
  useGetApplicationStatsQuery,
  useGetApplicationSettingsQuery,
  useUpdateApplicationSettingsMutation,
  useDownloadApplicationDocumentMutation,
  useExportApplicationsMutation,
  useBulkUpdateApplicationStatusMutation,
} = onlineApplicationApi
