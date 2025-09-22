import { apiSlice } from "./apiSlice"

export const settingsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query({
      query: () => "/settings",
      providesTags: ["Settings"],
    }),
    updateSettings: builder.mutation({
      query: (settings) => ({
        url: "/settings",
        method: "PUT",
        body: settings,
      }),
      invalidatesTags: ["Settings"],
    }),
    testEmailConfig: builder.mutation({
      query: (emailConfig) => ({
        url: "/settings/test-email",
        method: "POST",
        body: emailConfig,
      }),
    }),
    resetSettings: builder.mutation({
      query: () => ({
        url: "/settings/reset",
        method: "POST",
      }),
      invalidatesTags: ["Settings"],
    }),
    exportSettings: builder.query({
      query: () => ({
        url: "/settings/export",
        responseType: "blob",
      }),
    }),
  }),
})

export const {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useTestEmailConfigMutation,
  useResetSettingsMutation,
  useExportSettingsQuery,
} = settingsApi
