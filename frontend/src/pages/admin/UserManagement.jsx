"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import { 
  useGetAllUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation
} from "../../store/api/adminApi"
import { selectCurrentUser, selectCurrentToken } from "../../store/slices/authSlice"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Search, Plus, Edit, Trash2, Eye, UserCheck, UserX, RefreshCw } from "lucide-react"

const UserManagement = () => {
  const user = useSelector(selectCurrentUser)
  const token = useSelector(selectCurrentToken)
  
  const [filters, setFilters] = useState({
    search: "",
    role: "All Roles",
    isActive: "All",
    page: 1,
  })
  const [userFormDialog, setUserFormDialog] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    institution: "",
    role: "Public",
    isActive: true,
  })
  const [formError, setFormError] = useState("")

  const { data, isLoading, error, refetch } = useGetAllUsersQuery(filters)
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation()
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation()
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation()

  // Debug logging
  console.log("UserManagement - filters:", filters)
  console.log("UserManagement - data:", data)
  console.log("UserManagement - isLoading:", isLoading)
  console.log("UserManagement - error:", error)
  console.log("UserManagement - users count:", data?.users?.length || 0)
  console.log("UserManagement - total users:", data?.total || 0)
  console.log("UserManagement - API URL:", process.env.REACT_APP_API_URL || "http://localhost:5000/api")
  console.log("UserManagement - current user:", user)
  console.log("UserManagement - token exists:", !!token)
  console.log("UserManagement - user role:", user?.role)

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }))
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
    if (formError) setFormError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError("")

    // Validation
    if (!formData.username || !formData.email || !formData.firstName || 
        !formData.lastName || !formData.institution) {
      setFormError("Please fill in all required fields")
      return
    }

    if (!editingUser && !formData.password) {
      setFormError("Password is required for new users")
      return
    }

    try {
      if (editingUser) {
        // Update user
        await updateUser({
          id: editingUser._id,
          ...formData,
        }).unwrap()
        alert("User updated successfully!")
      } else {
        // Create user
        const result = await createUser(formData).unwrap()
        console.log("User created successfully:", result)
        alert("User created successfully!")
        
        // Force refresh the users list
        await refetch()
      }

      setUserFormDialog(false)
      setEditingUser(null)
      setFormData({
        username: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        institution: "",
        role: "Public",
        isActive: true,
      })
    } catch (err) {
      console.error("Error creating/updating user:", err)
      setFormError(err.data?.message || "Operation failed. Please try again.")
    }
  }

  const handleEditUser = (user) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      firstName: user.firstName,
      lastName: user.lastName,
      institution: user.institution,
      role: user.role,
      isActive: user.isActive,
    })
    setUserFormDialog(true)
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to deactivate this user? This action cannot be undone.")) {
      try {
        await deleteUser(userId).unwrap()
      } catch (error) {
        console.error("Failed to delete user:", error)
      }
    }
  }

  const handleNewUser = () => {
    setEditingUser(null)
    setFormData({
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      institution: "",
      role: "Public",
      isActive: true,
    })
    setUserFormDialog(true)
  }

  const getRoleBadge = (role) => {
    const variants = {
      Admin: { variant: "default", className: "bg-red-100 text-red-800" },
      Validator: { variant: "default", className: "bg-blue-100 text-blue-800" },
      Public: { variant: "secondary", className: "bg-gray-100 text-gray-800" },
    }

    const config = variants[role] || { variant: "secondary", className: "bg-gray-100 text-gray-800" }

    return (
      <Badge variant={config.variant} className={config.className}>
        {role}
      </Badge>
    )
  }

  const getStatusBadge = (isActive) => {
    return (
      <Badge variant={isActive ? "default" : "secondary"} className={isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
        {isActive ? (
          <>
            <UserCheck className="mr-1 h-3 w-3" />
            Active
          </>
        ) : (
          <>
            <UserX className="mr-1 h-3 w-3" />
            Inactive
          </>
        )}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage system users and their permissions</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => refetch()}
            disabled={isLoading}
            title="Refresh users list"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleNewUser} className="bg-[#0d559e] hover:bg-[#0d559e]/90">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={filters.role}
              onValueChange={(value) => handleFilterChange("role", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Roles">All Roles</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Validator">Validator</SelectItem>
                <SelectItem value="Public">Public</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.isActive}
              onValueChange={(value) => handleFilterChange("isActive", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({data?.total || 0})</CardTitle>
          <CardDescription>Manage system users and their roles</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading users...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">Error loading users. Please try again.</p>
              {error.data?.message && (
                <p className="text-sm text-red-500 mt-2">{error.data.message}</p>
              )}
              <Button 
                variant="outline" 
                onClick={() => refetch()} 
                className="mt-4"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Institution</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.users && data.users.length > 0 ? (
                  data.users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">
                        {user.firstName} {user.lastName}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.institution}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.isActive)}</TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                            title="Edit User"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user._id)}
                            disabled={isDeleting}
                            title="Deactivate User"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="text-gray-500">
                        <UserX className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">No users found</p>
                        <p className="text-sm">Try adjusting your filters or add a new user</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          {data?.totalPages > 1 && (
            <div className="flex justify-center space-x-2 mt-4">
              <Button
                variant="outline"
                disabled={filters.page <= 1}
                onClick={() => handleFilterChange("page", filters.page - 1)}
              >
                Previous
              </Button>
              <span className="flex items-center px-4 text-sm text-gray-600">
                Page {filters.page} of {data.totalPages}
              </span>
              <Button
                variant="outline"
                disabled={filters.page >= data.totalPages}
                onClick={() => handleFilterChange("page", filters.page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Form Dialog */}
      <Dialog open={userFormDialog} onOpenChange={setUserFormDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Edit User" : "Create New User"}
            </DialogTitle>
            <DialogDescription>
              {editingUser 
                ? "Update the user information below" 
                : "Fill in the details to create a new user account"
              }
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <Alert variant="destructive">
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  placeholder="First name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  placeholder="Last name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                placeholder="Choose a username"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="institution">Institution *</Label>
              <Input
                id="institution"
                value={formData.institution}
                onChange={(e) => handleInputChange("institution", e.target.value)}
                placeholder="Enter institution"
                required
              />
            </div>

            {!editingUser && (
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Enter password"
                  required={!editingUser}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Public">Public</SelectItem>
                    <SelectItem value="Validator">Validator</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="isActive">Status *</Label>
                <Select value={formData.isActive.toString()} onValueChange={(value) => handleInputChange("isActive", value === "true")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setUserFormDialog(false)
                  setEditingUser(null)
                  setFormError("")
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
                className="bg-[#0d559e] hover:bg-[#0d559e]/90"
              >
                {isCreating || isUpdating ? "Saving..." : editingUser ? "Update User" : "Create User"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UserManagement