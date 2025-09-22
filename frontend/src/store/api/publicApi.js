import { apiSlice } from "./apiSlice"

export const publicApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPublicProjects: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        Object.keys(params).forEach((key) => {
          if (params[key] !== undefined && params[key] !== null && params[key] !== "") {
            searchParams.append(key, params[key])
          }
        })
        return `/projects/public?${searchParams.toString()}`
      },
      providesTags: ["Project"],
    }),
    getPublicProjectById: builder.query({
      query: (id) => `/projects/public/${id}`,
      providesTags: (result, error, id) => [{ type: "Project", id }],
    }),
    getProjectsByScheme: builder.query({
      query: ({ scheme, ...params }) => {
        const searchParams = new URLSearchParams()
        Object.keys(params).forEach((key) => {
          if (params[key]) {
            searchParams.append(key, params[key])
          }
        })
        return `/projects/public/scheme/${scheme}?${searchParams.toString()}`
      },
      providesTags: (result, error, { scheme }) => [{ type: "Project", scheme }],
    }),
    getEquipment: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        Object.keys(params).forEach((key) => {
          if (params[key]) {
            searchParams.append(key, params[key])
          }
        })
        return `/equipment?${searchParams.toString()}`
      },
      providesTags: ["Equipment"],
    }),
    getPublications: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        Object.keys(params).forEach((key) => {
          if (params[key]) {
            searchParams.append(key, params[key])
          }
        })
        return `/publications?${searchParams.toString()}`
      },
      providesTags: ["Publication"],
    }),
    getFundingStats: builder.query({
      query: () => "/public/funding-stats",
      providesTags: ["Analytics"],
    }),
    getProjectStats: builder.query({
      query: () => "/public/project-stats",
      providesTags: ["Analytics"],
    }),
    getRecentProjects: builder.query({
      query: (limit = 10) => `/public/recent-projects?limit=${limit}`,
      providesTags: ["Project"],
    }),
    getPlatformOverview: builder.query({
      query: () => "/public/platform-overview",
      providesTags: ["Analytics"],
    }),
  }),
})

export const {
  useGetPublicProjectsQuery,
  useGetPublicProjectByIdQuery,
  useGetProjectsBySchemeQuery,
  useGetEquipmentQuery,
  useGetPublicationsQuery,
  useGetFundingStatsQuery,
  useGetProjectStatsQuery,
  useGetRecentProjectsQuery,
  useGetPlatformOverviewQuery,
} = publicApi
