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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manpower Type Management</h1>
          <p className="text-gray-600">Manage different types of manpower for projects</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Manpower Type
        </Button>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Types</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Types</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactive Types</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.byCategory?.length || 0}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
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
      <Card>
        <CardHeader>
          <CardTitle>Manpower Types ({manpowerTypes?.data?.length || 0})</CardTitle>
          <CardDescription>Manage different types of manpower available for projects</CardDescription>
        </CardHeader>
        <CardContent>
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
                <TableRow key={manpowerType._id}>
                  <TableCell className="font-medium">{manpowerType.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{manpowerType.description || "No description"}</TableCell>
                  <TableCell>{getCategoryBadge(manpowerType.category)}</TableCell>
                  <TableCell>
                    <Badge variant={manpowerType.isActive ? "default" : "secondary"}>
                      {manpowerType.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {manpowerType.createdBy?.firstName} {manpowerType.createdBy?.lastName}
                  </TableCell>
                  <TableCell>
                    {new Date(manpowerType.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(manpowerType)}
                        title="Edit manpower type"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(manpowerType._id)}
                        disabled={isDeleting}
                        title="Delete manpower type"
                        className="text-red-600 hover:text-red-700"
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
