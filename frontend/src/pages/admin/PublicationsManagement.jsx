"use client"

import { useState } from "react"
import { 
  useGetPublicationsQuery,
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
    title: "",
    type: "",
    authors: [],
    abstract: "",
    journal: "",
    volume: "",
    issue: "",
    pages: "",
    doi: "",
    publicationDate: "",
    status: "Published",
    keywords: [],
    projectId: "",
  })
  const [newAuthor, setNewAuthor] = useState("")
  const [newKeyword, setNewKeyword] = useState("")
  const [formError, setFormError] = useState("")

  const { data, isLoading, error } = useGetPublicationsQuery(filters)
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

  const handleArrayAdd = (arrayName, value, setter) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [arrayName]: [...prev[arrayName], value.trim()],
      }))
      setter("")
    }
  }

  const handleArrayRemove = (arrayName, index) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError("")

    // Validation
    if (!formData.title || !formData.type || !formData.authors.length) {
      setFormError("Please fill in all required fields")
      return
    }

    try {
      const submitData = {
        ...formData,
        publicationDate: formData.publicationDate ? new Date(formData.publicationDate) : null,
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
        title: "",
        type: "",
        authors: [],
        abstract: "",
        journal: "",
        volume: "",
        issue: "",
        pages: "",
        doi: "",
        publicationDate: "",
        status: "Published",
        keywords: [],
        projectId: "",
      })
    } catch (err) {
      setFormError(err.data?.message || "Operation failed. Please try again.")
    }
  }

  const handleEditPublication = (publication) => {
    setEditingPublication(publication)
    setFormData({
      title: publication.title || "",
      type: publication.type || "",
      authors: publication.authors || [],
      abstract: publication.abstract || "",
      journal: publication.journal || "",
      volume: publication.volume || "",
      issue: publication.issue || "",
      pages: publication.pages || "",
      doi: publication.doi || "",
      publicationDate: publication.publicationDate ? new Date(publication.publicationDate).toISOString().split('T')[0] : "",
      status: publication.status || "Published",
      keywords: publication.keywords || [],
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
      title: "",
      type: "",
      authors: [],
      abstract: "",
      journal: "",
      volume: "",
      issue: "",
      pages: "",
      doi: "",
      publicationDate: "",
      status: "Published",
      keywords: [],
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

  const getTypeBadge = (type) => {
    const variants = {
      "Journal Article": { variant: "default", className: "bg-blue-100 text-blue-800" },
      "Conference Paper": { variant: "default", className: "bg-purple-100 text-purple-800" },
      "Book Chapter": { variant: "default", className: "bg-green-100 text-green-800" },
      "Technical Report": { variant: "default", className: "bg-orange-100 text-orange-800" },
      "Preprint": { variant: "default", className: "bg-gray-100 text-gray-800" },
    }

    const config = variants[type] || { variant: "secondary", className: "bg-gray-100 text-gray-800" }

    return (
      <Badge variant={config.variant} className={config.className}>
        {type}
      </Badge>
    )
  }

  const publicationTypes = [
    "Journal Article",
    "Conference Paper",
    "Book Chapter",
    "Technical Report",
    "Preprint",
    "Other"
  ]

  const getPublicationStats = () => {
    if (!data?.publications) return { total: 0, published: 0, underReview: 0, submitted: 0 }
    
    const stats = data.publications.reduce((acc, pub) => {
      acc.total++
      acc[pub.status.toLowerCase().replace(' ', '')] = (acc[pub.status.toLowerCase().replace(' ', '')] || 0) + 1
      return acc
    }, { total: 0, published: 0, underreview: 0, submitted: 0 })

    return stats
  }

  const stats = getPublicationStats()

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
            <div className="text-2xl font-bold">{data?.publications?.length || 0}</div>
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
            <div className="text-2xl font-bold">{stats.underreview}</div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              value={filters.type}
              onValueChange={(value) => handleFilterChange("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Types">All Types</SelectItem>
                {publicationTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          <CardTitle>Publications ({data?.publications?.length || 0})</CardTitle>
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
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Authors</TableHead>
                  <TableHead>Journal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.publications?.map((publication) => (
                  <TableRow key={publication._id}>
                    <TableCell className="font-medium max-w-xs">
                      <div className="truncate">{publication.title}</div>
                    </TableCell>
                    <TableCell>{getTypeBadge(publication.type)}</TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="truncate text-sm">
                          {publication.authors?.slice(0, 2).join(", ")}
                          {publication.authors?.length > 2 && ` +${publication.authors.length - 2} more`}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="truncate text-sm">{publication.journal}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(publication.status)}</TableCell>
                    <TableCell>
                      {publication.publicationDate ? new Date(publication.publicationDate).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {publication.doi && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`https://doi.org/${publication.doi}`, '_blank')}
                            title="View Publication"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}

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
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Publication title"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {publicationTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

            {/* Authors */}
            <div className="space-y-2">
              <Label>Authors *</Label>
              <div className="flex gap-2">
                <Input
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="Author name"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleArrayAdd("authors", newAuthor, setNewAuthor))}
                />
                <Button type="button" onClick={() => handleArrayAdd("authors", newAuthor, setNewAuthor)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.authors.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.authors.map((author, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {author}
                      <button
                        type="button"
                        onClick={() => handleArrayRemove("authors", index)}
                        className="ml-1 text-xs hover:text-red-600"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="abstract">Abstract</Label>
              <Textarea
                id="abstract"
                value={formData.abstract}
                onChange={(e) => handleInputChange("abstract", e.target.value)}
                placeholder="Publication abstract"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="journal">Journal/Conference</Label>
                <Input
                  id="journal"
                  value={formData.journal}
                  onChange={(e) => handleInputChange("journal", e.target.value)}
                  placeholder="Journal or conference name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doi">DOI</Label>
                <Input
                  id="doi"
                  value={formData.doi}
                  onChange={(e) => handleInputChange("doi", e.target.value)}
                  placeholder="Digital Object Identifier"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="volume">Volume</Label>
                <Input
                  id="volume"
                  value={formData.volume}
                  onChange={(e) => handleInputChange("volume", e.target.value)}
                  placeholder="Volume"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="issue">Issue</Label>
                <Input
                  id="issue"
                  value={formData.issue}
                  onChange={(e) => handleInputChange("issue", e.target.value)}
                  placeholder="Issue"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pages">Pages</Label>
                <Input
                  id="pages"
                  value={formData.pages}
                  onChange={(e) => handleInputChange("pages", e.target.value)}
                  placeholder="Page numbers"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="publicationDate">Publication Date</Label>
              <Input
                id="publicationDate"
                type="date"
                value={formData.publicationDate}
                onChange={(e) => handleInputChange("publicationDate", e.target.value)}
              />
            </div>

            {/* Keywords */}
            <div className="space-y-2">
              <Label>Keywords</Label>
              <div className="flex gap-2">
                <Input
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="Keyword"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleArrayAdd("keywords", newKeyword, setNewKeyword))}
                />
                <Button type="button" onClick={() => handleArrayAdd("keywords", newKeyword, setNewKeyword)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {keyword}
                      <button
                        type="button"
                        onClick={() => handleArrayRemove("keywords", index)}
                        className="ml-1 text-xs hover:text-red-600"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
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
