import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { logout, setCredentials } from "../slices/authSlice"

// Use relative path in production (same domain), absolute URL in development
const getApiUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL
  }
  // In production, use relative path since frontend and backend are on same domain
  if (process.env.NODE_ENV === 'production') {
    return '/api'
  }
  // In development, use the IP address
  return "http://72.60.206.223:5000/api"
}

const baseQuery = fetchBaseQuery({
  baseUrl: getApiUrl(),
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token
    if (token) {
      headers.set("authorization", `Bearer ${token}`)
    }
    return headers
  },
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result?.error?.status === 403 || result?.error?.status === 401) {
    // Try to get a new token
    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh-token",
        method: "POST",
        body: {
          refreshToken: api.getState().auth.refreshToken,
        },
      },
      api,
      extraOptions,
    )

    if (refreshResult?.data) {
      // Store the new token
      api.dispatch(
        setCredentials({
          ...api.getState().auth.user,
          token: refreshResult.data.accessToken,
        }),
      )
      // Retry the original query with new token
      result = await baseQuery(args, api, extraOptions)
    } else {
      // Refresh failed, logout user
      api.dispatch(logout())
      sessionStorage.clear()
    }
  }

  return result
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Project", "Equipment", "Publication", "Outcome", "PIProject", "ActivityLog", "Settings", "OnlineApplication", "ApplicationSettings"],
  endpoints: (builder) => ({}),
})
