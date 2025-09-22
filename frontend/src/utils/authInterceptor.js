// This utility is handled by RTK Query's baseQueryWithReauth
// but we can add additional client-side session management here

export const checkSessionExpiry = () => {
  try {
    const authData = sessionStorage.getItem("auth")
    if (authData) {
      const parsedAuth = JSON.parse(authData)
      const now = new Date().getTime()

      if (parsedAuth.sessionExpiry && now > parsedAuth.sessionExpiry) {
        sessionStorage.removeItem("auth")
        return false
      }
      return true
    }
  } catch (error) {
    console.error("Error checking session:", error)
    sessionStorage.removeItem("auth")
  }
  return false
}

export const getAuthToken = () => {
  try {
    const authData = sessionStorage.getItem("auth")
    if (authData) {
      const parsedAuth = JSON.parse(authData)
      return parsedAuth.token
    }
  } catch (error) {
    console.error("Error getting auth token:", error)
  }
  return null
}

export const clearAuthData = () => {
  sessionStorage.removeItem("auth")
}
