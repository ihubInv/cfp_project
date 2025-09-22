import { useSelector } from "react-redux"
import { Navigate, useLocation } from "react-router-dom"
import { selectIsAuthenticated, selectCurrentUser } from "../../store/slices/authSlice"

const ProtectedRoute = ({ children, requiredRoles = [], allowedRoles = [] }) => {
    const isAuthenticated = useSelector(selectIsAuthenticated)
    const user = useSelector(selectCurrentUser)
    const location = useLocation()

    if (!isAuthenticated) {
        // Redirect to login page with return url
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    // Check if user has required role
    if (requiredRoles.length > 0 && !requiredRoles.includes(user?.role)) {
        return <Navigate to="/unauthorized" replace />
    }

    // Check if user has allowed role
    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/unauthorized" replace />
    }

    return children
}

export default ProtectedRoute
