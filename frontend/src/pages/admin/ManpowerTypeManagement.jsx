"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Badge } from "../../components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { Switch } from "../../components/ui/switch"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Search, 
  Filter,
  CheckCircle,
  XCircle
} from "lucide-react"
import {
  useGetAllManpowerTypesQuery,
  useCreateManpowerTypeMutation,
  useUpdateManpowerTypeMutation,
  useDeleteManpowerTypeMutation,
  useGetManpowerTypeStatsQuery
} from "../../store/api/manpowerTypeApi"

const ManpowerTypeManagement = () => {
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    isActive: "true"
  })
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedManpowerType, setSelectedManpowerType] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Research",
    isActive: true
  })

  const { data: manpowerTypes, isLoading, error } = useGetAllManpowerTypesQuery(filters)
  const { data: stats } = useGetManpowerTypeStatsQuery()
  const [createManpowerType, { isLoading: isCreating }] = useCreateManpowerTypeMutation()
  const [updateManpowerType, { isLoading: isUpdating }] = useUpdateManpowerTypeMutation()
  const [deleteManpowerType, { isLoading: isDeleting }] = useDeleteManpowerTypeMutation()

  const categories = [
    { value: "Research", label: "Research" },
    { value: "Technical", label: "Technical" },
    { value: "Administrative", label: "Administrative" },
    { value: "Support", label: "Support" },
    { value: "Other", label: "Other" }
  ]

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await createManpowerType(formData).unwrap()
      setIsCreateDialogOpen(false)
      setFormData({ name: "", description: "", category: "Research", isActive: true })
    } catch (error) {
      console.error("Error creating manpower type:", error)
      alert(`Error creating manpower type: ${error?.data?.message || error?.message || 'Unknown error'}`)
    }
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    try {
      await updateManpowerType({ id: selectedManpowerType._id, ...formData }).unwrap()
      setIsEditDialogOpen(false)
      setSelectedManpowerType(null)
      setFormData({ name: "", description: "", category: "Research", isActive: true })
    } catch (error) {
      console.error("Error updating manpower type:", error)
      alert(`Error updating manpower type: ${error?.data?.message || error?.message || 'Unknown error'}`)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this manpower type? This action cannot be undone.")) {
      try {
        await deleteManpowerType(id).unwrap()
      } catch (error) {
        console.error("Error deleting manpower type:", error)
        alert(`Error deleting manpower type: ${error?.data?.message || error?.message || 'Unknown error'}`)
      }
    }
  }

  const openEditDialog = (manpowerType) => {
    setSelectedManpowerType(manpowerType)
    setFormData({
      name: manpowerType.name,
      description: manpowerType.description || "",
      category: manpowerType.category,
      isActive: manpowerType.isActive
    })
    setIsEditDialogOpen(true)
  }

  const getCategoryBadge = (category) => {
    const colors = {
      Research: "bg-blue-100 text-blue-800",
      Technical: "bg-green-100 text-green-800",
      Administrative: "bg-purple-100 text-purple-800",
      Support: "bg-orange-100 text-orange-800",
      Other: "bg-gray-100 text-gray-800"
    }
    return <Badge className={colors[category] || colors.Other}>{category}</Badge>
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading manpower types...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading manpower types. Please try again.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 bg-gradient-to-br from-gray-50 to-white min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Manpower Type Management
          </h1>
          <p className="text-gray-600 text-lg">Manage different types of manpower for projects</p>
        </div>
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Manpower Type
        </Button>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-blue-200 overflow-hidden relative bg-gradient-to-br from-white to-blue-50/30">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-700 group-hover:text-blue-700 transition-colors">Total Types</CardTitle>
              <div className="bg-blue-100 group-hover:bg-blue-200 rounded-full p-2 transition-all duration-300 group-hover:scale-110">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 inline-block">
                {stats.total}
              </div>
            </CardContent>
          </Card>
          <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-green-200 overflow-hidden relative bg-gradient-to-br from-white to-green-50/30">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-700 group-hover:text-green-700 transition-colors">Active Types</CardTitle>
              <div className="bg-green-100 group-hover:bg-green-200 rounded-full p-2 transition-all duration-300 group-hover:scale-110">
              <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 inline-block">
                {stats.active}
              </div>
            </CardContent>
          </Card>
          <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-red-200 overflow-hidden relative bg-gradient-to-br from-white to-red-50/30">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-700 group-hover:text-red-700 transition-colors">Inactive Types</CardTitle>
              <div className="bg-red-100 group-hover:bg-red-200 rounded-full p-2 transition-all duration-300 group-hover:scale-110">
              <XCircle className="h-4 w-4 text-red-600" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 inline-block">
                {stats.inactive}
              </div>
            </CardContent>
          </Card>
          <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-purple-200 overflow-hidden relative bg-gradient-to-br from-white to-purple-50/30">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-gray-700 group-hover:text-purple-700 transition-colors">Categories</CardTitle>
              <div className="bg-purple-100 group-hover:bg-purple-200 rounded-full p-2 transition-all duration-300 group-hover:scale-110">
                <Filter className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 inline-block">
                {stats.byCategory?.length || 0}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="group hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-200 overflow-hidden relative bg-gradient-to-br from-white to-blue-50/20">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardHeader className="relative z-10">
          <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-blue-700 transition-colors">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search manpower types..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filters.isActive} onValueChange={(value) => setFilters(prev => ({ ...prev, isActive: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manpower Types Table */}
      <Card className="group hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-200 overflow-hidden relative bg-gradient-to-br from-white to-purple-50/20">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-400/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardHeader className="relative z-10">
          <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-purple-700 transition-colors">
            Manpower Types <span className="text-purple-600">({manpowerTypes?.data?.length || 0})</span>
          </CardTitle>
          <CardDescription className="text-gray-600">Manage different types of manpower available for projects</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {manpowerTypes?.data?.map((manpowerType) => (
                <TableRow 
                  key={manpowerType._id}
                  className="group/row hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300 cursor-pointer hover:shadow-md"
                >
                  <TableCell className="font-medium group-hover/row:text-gray-900 transition-colors">{manpowerType.name}</TableCell>
                  <TableCell className="max-w-xs truncate group-hover/row:text-gray-700 transition-colors">{manpowerType.description || "No description"}</TableCell>
                  <TableCell>{getCategoryBadge(manpowerType.category)}</TableCell>
                  <TableCell>
                    <Badge variant={manpowerType.isActive ? "default" : "secondary"}>
                      {manpowerType.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="group-hover/row:text-gray-700 transition-colors">
                    {manpowerType.createdBy?.firstName} {manpowerType.createdBy?.lastName}
                  </TableCell>
                  <TableCell className="group-hover/row:text-gray-600 transition-colors">
                    {new Date(manpowerType.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(manpowerType)}
                        title="Edit manpower type"
                        className="hover:bg-green-100 hover:text-green-700 transition-all duration-300 hover:scale-110"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(manpowerType._id)}
                        disabled={isDeleting}
                        title="Delete manpower type"
                        className="text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-300 hover:scale-110 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Manpower Type</DialogTitle>
            <DialogDescription>Create a new type of manpower for projects</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Senior Research Fellow"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe this manpower type..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Creating..." : "Create Manpower Type"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Manpower Type</DialogTitle>
            <DialogDescription>Update the manpower type information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Senior Research Fellow"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe this manpower type..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="edit-isActive">Active</Label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Update Manpower Type"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ManpowerTypeManagement
