"use client"

import { useSelector } from "react-redux"
import { Navigate, useLocation } from "react-router-dom"
import { selectCurrentUser, selectCurrentToken } from "../../store/slices/authSlice"

const AdminProtectedRoute = ({ children }) => {
  const user = useSelector(selectCurrentUser)
  const accessToken = useSelector(selectCurrentToken)
  const location = useLocation()

  // Check if user is authenticated
  if (!accessToken || !user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  // Check if user has admin privileges
  if (user.role !== "Admin" && user.role !== "Validator") {
    // Redirect PI users to their dashboard, others to homepage
    if (user.role === "PI") {
      return <Navigate to="/pi" replace />
    }
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminProtectedRoute
