import { apiSlice } from "./apiSlice"

export const activityLogApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getActivityLogs: builder.query({
      query: (params) => {
        // Filter out undefined and empty string values
        const filteredParams = Object.fromEntries(
          Object.entries(params).filter(([key, value]) => 
            value !== undefined && value !== "" && value !== null
          )
        )
        return {
          url: "/activity-logs",
          params: filteredParams,
        }
      },
      providesTags: ["ActivityLog"],
    }),
    getActivityStats: builder.query({
      query: () => "/activity-logs/stats",
      providesTags: ["ActivityLog"],
    }),
    exportActivityLogs: builder.query({
      query: (params) => {
        const filteredParams = Object.fromEntries(
          Object.entries(params).filter(([key, value]) => 
            value !== undefined && value !== "" && value !== null
          )
        )
        return {
          url: "/activity-logs/export",
          params: filteredParams,
          responseType: "blob",
        }
      },
    }),
  }),
})

export const {
  useGetActivityLogsQuery,
  useGetActivityStatsQuery,
  useExportActivityLogsQuery,
} = activityLogApi
