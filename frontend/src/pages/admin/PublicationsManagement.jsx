"use client"

import { useState } from "react"
import { 
  useGetPublicationsQuery,
  useGetPublicationStatsQuery,
  useCreatePublicationMutation,
  useUpdatePublicationMutation,
  useDeletePublicationMutation
} from "../../store/api/publicationApi"
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
} from "../../components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Textarea } from "../../components/ui/textarea"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Search, Plus, Edit, Trash2, FileText, ExternalLink, Calendar, Users } from "lucide-react"

const PublicationsManagement = () => {
  const [filters, setFilters] = useState({
    search: "",
    type: "All Types",
    status: "All Status",
    page: 1,
  })
  const [publicationFormDialog, setPublicationFormDialog] = useState(false)
  const [editingPublication, setEditingPublication] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    publicationDetail: "",
    status: "Published",
    projectId: "",
  })
  const [formError, setFormError] = useState("")

  const { data, isLoading, error } = useGetPublicationsQuery(filters)
  const { data: statsData, isLoading: statsLoading } = useGetPublicationStatsQuery()
  const [createPublication, { isLoading: isCreating }] = useCreatePublicationMutation()
  const [updatePublication, { isLoading: isUpdating }] = useUpdatePublicationMutation()
  const [deletePublication, { isLoading: isDeleting }] = useDeletePublicationMutation()

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
    if (!formData.name || !formData.publicationDetail || !formData.projectId) {
      setFormError("Please fill in all required fields")
      return
    }

    try {
      const submitData = {
        ...formData,
      }

      if (editingPublication) {
        await updatePublication({
          id: editingPublication._id,
          ...submitData,
        }).unwrap()
      } else {
        await createPublication(submitData).unwrap()
      }

      setPublicationFormDialog(false)
      setEditingPublication(null)
      setFormData({
        name: "",
        publicationDetail: "",
        status: "Published",
        projectId: "",
      })
    } catch (err) {
      setFormError(err.data?.message || "Operation failed. Please try again.")
    }
  }

  const handleEditPublication = (publication) => {
    setEditingPublication(publication)
    setFormData({
      name: publication.name || "",
      publicationDetail: publication.publicationDetail || "",
      status: publication.status || "Published",
      projectId: publication.projectId || "",
    })
    setPublicationFormDialog(true)
  }

  const handleDeletePublication = async (publicationId) => {
    if (window.confirm("Are you sure you want to delete this publication? This action cannot be undone.")) {
      try {
        await deletePublication(publicationId).unwrap()
      } catch (error) {
        console.error("Failed to delete publication:", error)
      }
    }
  }

  const handleNewPublication = () => {
    setEditingPublication(null)
    setFormData({
      name: "",
      publicationDetail: "",
      status: "Published",
      projectId: "",
    })
    setPublicationFormDialog(true)
  }

  const getStatusBadge = (status) => {
    const variants = {
      Published: { variant: "default", className: "bg-green-100 text-green-800" },
      "Under Review": { variant: "default", className: "bg-yellow-100 text-yellow-800" },
      Submitted: { variant: "default", className: "bg-blue-100 text-blue-800" },
      Draft: { variant: "secondary", className: "bg-gray-100 text-gray-800" },
    }

    const config = variants[status] || { variant: "secondary", className: "bg-gray-100 text-gray-800" }

    return (
      <Badge variant={config.variant} className={config.className}>
        {status}
      </Badge>
    )
  }


  const stats = statsData?.stats || { total: 0, published: 0, underReview: 0, submitted: 0, draft: 0 }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Publications Management</h1>
          <p className="text-gray-600">Manage research publications and academic papers</p>
        </div>
        <Button onClick={handleNewPublication} className="bg-[#0d559e] hover:bg-[#0d559e]/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Publication
        </Button>
      </div>

      {/* Publication Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Publications</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All publications</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.published}</div>
            <p className="text-xs text-muted-foreground">Published papers</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
            <FileText className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.underReview}</div>
            <p className="text-xs text-muted-foreground">In review process</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submitted</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.submitted}</div>
            <p className="text-xs text-muted-foreground">Recently submitted</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search publications..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Status">All Status</SelectItem>
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="Under Review">Under Review</SelectItem>
                <SelectItem value="Submitted">Submitted</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Publications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Publications ({data?.total || 0})</CardTitle>
          <CardDescription>Manage research publications and academic papers</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading publications...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">Error loading publications. Please try again.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Publication Name</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.publications?.map((publication) => (
                  <TableRow key={publication._id}>
                    <TableCell className="font-medium max-w-xs">
                      <div className="truncate">{publication.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="truncate text-sm font-medium">{publication.projectTitle}</p>
                        <p className="text-xs text-gray-500">{publication.projectFileNumber}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="truncate text-sm">{publication.publicationDetail}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(publication.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditPublication(publication)}
                          title="Edit Publication"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePublication(publication._id)}
                          disabled={isDeleting}
                          title="Delete Publication"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
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

      {/* Publication Form Dialog */}
      <Dialog open={publicationFormDialog} onOpenChange={setPublicationFormDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPublication ? "Edit Publication" : "Add New Publication"}
            </DialogTitle>
            <DialogDescription>
              {editingPublication 
                ? "Update the publication information below" 
                : "Fill in the details to add a new publication"
              }
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <Alert variant="destructive">
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <div>
              <Label htmlFor="name">Publication Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Publication name"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="projectId">Project ID *</Label>
                <Input
                  id="projectId"
                  value={formData.projectId}
                  onChange={(e) => handleInputChange("projectId", e.target.value)}
                  placeholder="Project ID"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Published">Published</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="Submitted">Submitted</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="publicationDetail">Publication Details *</Label>
              <Textarea
                id="publicationDetail"
                value={formData.publicationDetail}
                onChange={(e) => handleInputChange("publicationDetail", e.target.value)}
                placeholder="Publication details (journal, conference, etc.)"
                rows={4}
                required
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setPublicationFormDialog(false)
                  setEditingPublication(null)
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
                {isCreating || isUpdating ? "Saving..." : editingPublication ? "Update Publication" : "Add Publication"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PublicationsManagement
