import { apiSlice } from "./apiSlice"

export const publicPublicationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPublicPublications: builder.query({
      query: (params) => {
        // Filter out undefined and empty string values
        const filteredParams = Object.fromEntries(
          Object.entries(params).filter(([key, value]) => 
            value !== undefined && value !== "" && value !== null
          )
        )
        return {
          url: "/public/publications",
          params: filteredParams,
        }
      },
      providesTags: ["PublicPublication"],
      // Enable polling for real-time updates
      pollingInterval: 30000, // Poll every 30 seconds
    }),
  }),
})

export const {
  useGetPublicPublicationsQuery,
} = publicPublicationApi
