import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  sessionExpiry: null,
}

// Load from sessionStorage on initialization
const loadFromStorage = () => {
  try {
    const storedAuth = sessionStorage.getItem("auth")
    if (storedAuth) {
      const parsedAuth = JSON.parse(storedAuth)
      const now = new Date().getTime()

      // Check if session is expired
      if (parsedAuth.sessionExpiry && now > parsedAuth.sessionExpiry) {
        sessionStorage.removeItem("auth")
        return initialState
      }

      return parsedAuth
    }
  } catch (error) {
    console.error("Error loading auth from storage:", error)
    sessionStorage.removeItem("auth")
  }
  return initialState
}

const authSlice = createSlice({
  name: "auth",
  initialState: loadFromStorage(),
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload
      state.user = user
      state.token = accessToken
      state.refreshToken = refreshToken
      state.isAuthenticated = true

      // Set session expiry to 1 hour from now
      state.sessionExpiry = new Date().getTime() + 60 * 60 * 1000

      // Save to sessionStorage
      sessionStorage.setItem("auth", JSON.stringify(state))
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.sessionExpiry = null

      // Clear sessionStorage
      sessionStorage.removeItem("auth")
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }

      // Update sessionStorage
      sessionStorage.setItem("auth", JSON.stringify(state))
    },
  },
})

export const { setCredentials, logout, updateUser } = authSlice.actions

export default authSlice.reducer

// Selectors
export const selectCurrentUser = (state) => state.auth.user
export const selectCurrentToken = (state) => state.auth.token
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
