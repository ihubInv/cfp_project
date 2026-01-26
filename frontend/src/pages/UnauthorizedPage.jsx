import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectCurrentUser } from "../store/slices/authSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { AlertTriangle, Home, ArrowLeft } from "lucide-react"

const UnauthorizedPage = () => {
  const user = useSelector(selectCurrentUser)
  const navigate = useNavigate()

  const getDashboardRoute = () => {
    if (user?.role === "Admin" || user?.role === "Validator") {
      return "/admin/dashboard"
    } else if (user?.role === "PI") {
      return "/pi"
    }
    return "/"
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="mt-4 text-2xl font-bold text-gray-900">
              Access Denied
            </CardTitle>
            <CardDescription className="text-gray-600">
              You don't have permission to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-gray-600">
              {user ? (
                <p>
                  You are logged in as <strong>{user.firstName} {user.lastName}</strong> 
                  with role <strong>{user.role}</strong>, but you don't have the required 
                  permissions for this page.
                </p>
              ) : (
                <p>Please log in to access this page.</p>
              )}
            </div>
            
            <div className="flex flex-col space-y-2">
              {user ? (
                <Button 
                  onClick={() => navigate(getDashboardRoute())}
                  className="w-full"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Go to Dashboard
                </Button>
              ) : (
                <Link to="/login" className="w-full">
                  <Button className="w-full">
                    Log In
                  </Button>
                </Link>
              )}
              
              <Button 
                variant="outline" 
                onClick={() => navigate(-1)}
                className="w-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
              
              <Link to="/" className="w-full">
                <Button variant="ghost" className="w-full">
                  <Home className="mr-2 h-4 w-4" />
                  Home Page
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default UnauthorizedPage
