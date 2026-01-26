"use client"

import { useState } from "react"
import { 
  useGetSchemesQuery, 
  useCreateSchemeMutation,
  useUpdateSchemeMutation,
  useDeleteSchemeMutation,
  usePermanentDeleteSchemeMutation,
  useInitializeDefaultSchemesMutation
} from "../../store/api/schemeApi"
import { useGetProjectsBySchemeQuery } from "../../store/api/publicApi"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"
import { Plus, Edit, Trash2, RefreshCw, Award, RotateCcw, ArrowLeft, Eye } from "lucide-react"

const SchemeManagement = () => {
  const [editingScheme, setEditingScheme] = useState(null)
  const [schemeDialog, setSchemeDialog] = useState(false)
  const [selectedScheme, setSelectedScheme] = useState(null)
  const [schemeData, setSchemeData] = useState({
    name: "",
    description: "",
  })

  const { data: schemes, isLoading, error, refetch } = useGetSchemesQuery()
  const [createScheme, { isLoading: isCreating }] = useCreateSchemeMutation()
  const [updateScheme, { isLoading: isUpdating }] = useUpdateSchemeMutation()
  const [deleteScheme, { isLoading: isDeleting }] = useDeleteSchemeMutation()
  const [permanentDeleteScheme, { isLoading: isPermanentlyDeleting }] = usePermanentDeleteSchemeMutation()
  const [initializeDefaultSchemes, { isLoading: isInitializing }] = useInitializeDefaultSchemesMutation()
  
  // Get projects for selected scheme
  const { data: schemeProjects, isLoading: isLoadingProjects } = useGetProjectsBySchemeQuery(
    { scheme: selectedScheme?.name },
    { skip: !selectedScheme }
  )

  const handleCreateScheme = async () => {
    try {
      await createScheme(schemeData).unwrap()
      setSchemeDialog(false)
      setSchemeData({ name: "", description: "" })
    } catch (error) {
      console.error("Failed to create scheme:", error)
      alert(`Failed to create scheme: ${error?.data?.message || error?.message || 'Unknown error'}`)
    }
  }

  const handleUpdateScheme = async () => {
    try {
      await updateScheme({
        id: editingScheme._id,
        ...schemeData,
      }).unwrap()
      setSchemeDialog(false)
      setEditingScheme(null)
      setSchemeData({ name: "", description: "" })
    } catch (error) {
      console.error("Failed to update scheme:", error)
      alert(`Failed to update scheme: ${error?.data?.message || error?.message || 'Unknown error'}`)
    }
  }

  const handleDeleteScheme = async (schemeId) => {
    console.log("Attempting to delete scheme:", schemeId)
    
    if (window.confirm("Are you sure you want to delete this scheme? This action cannot be undone.")) {
      try {
        console.log("Calling deleteScheme API...")
        const result = await deleteScheme(schemeId).unwrap()
        console.log("Delete result:", result)
        
        // Refresh the list after successful deletion
        refetch()
      } catch (error) {
        console.error("Failed to delete scheme:", error)
        console.error("Error details:", {
          status: error?.status,
          data: error?.data,
          message: error?.message
        })
        
        const errorMessage = error?.data?.message || error?.message || 'Unknown error occurred'
        alert(`Failed to delete scheme: ${errorMessage}`)
      }
    }
  }

  const handleRestoreScheme = async (schemeId) => {
    console.log("Attempting to restore scheme:", schemeId)
    
    if (window.confirm("Are you sure you want to restore this scheme?")) {
      try {
        console.log("Calling updateScheme API to restore...")
        const result = await updateScheme({ id: schemeId, isActive: true }).unwrap()
        console.log("Restore result:", result)
        
        // Refresh the list after successful restoration
        refetch()
        alert("Scheme restored successfully!")
      } catch (error) {
        console.error("Failed to restore scheme:", error)
        console.error("Error details:", {
          status: error?.status,
          data: error?.data,
          message: error?.message
        })
        
        const errorMessage = error?.data?.message || error?.message || 'Unknown error occurred'
        alert(`Failed to restore scheme: ${errorMessage}`)
      }
    }
  }

  const handlePermanentDeleteScheme = async (schemeId) => {
    console.log("Attempting to permanently delete scheme:", schemeId)
    
    if (window.confirm("Are you sure you want to PERMANENTLY DELETE this scheme? This action cannot be undone and will remove the scheme from the database completely.")) {
      try {
        console.log("Calling permanentDeleteScheme API...")
        const result = await permanentDeleteScheme(schemeId).unwrap()
        console.log("Permanent delete result:", result)
        
        // Refresh the list after successful deletion
        refetch()
        alert("Scheme permanently deleted successfully!")
      } catch (error) {
        console.error("Failed to permanently delete scheme:", error)
        console.error("Error details:", {
          status: error?.status,
          data: error?.data,
          message: error?.message
        })
        
        const errorMessage = error?.data?.message || error?.message || 'Unknown error occurred'
        alert(`Failed to permanently delete scheme: ${errorMessage}`)
      }
    }
  }

  const handleInitializeDefault = async () => {
    try {
      await initializeDefaultSchemes().unwrap()
      alert("Default schemes initialized successfully!")
      refetch()
    } catch (error) {
      console.error("Failed to initialize default schemes:", error)
      alert(`Failed to initialize default schemes: ${error?.data?.message || error?.message || 'Unknown error'}`)
    }
  }

  const handleEditScheme = (scheme) => {
    setEditingScheme(scheme)
    setSchemeData({
      name: scheme.name,
      description: scheme.description || "",
    })
    setSchemeDialog(true)
  }

  const handleNewScheme = () => {
    setEditingScheme(null)
    setSchemeData({ name: "", description: "" })
    setSchemeDialog(true)
  }

  const handleSchemeClick = (scheme) => {
    setSelectedScheme(scheme)
  }

  const handleBackToSchemes = () => {
    setSelectedScheme(null)
  }

  const getStatusBadge = (isActive) => {
    return (
      <Badge variant={isActive ? "default" : "destructive"}>
        {isActive ? "Active" : "Deleted"}
      </Badge>
    )
  }

  // Component to show project count for a scheme
  const ProjectCount = ({ schemeName }) => {
    const { data: projects } = useGetProjectsBySchemeQuery(
      { scheme: schemeName },
      { skip: !schemeName }
    )
    
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">
          {projects?.total || 0} projects
        </span>
        {projects?.total > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSchemeClick({ name: schemeName })}
            title="View projects"
            className="text-blue-600 hover:text-blue-700 p-1 h-6 w-6"
          >
            <Eye className="h-3 w-3" />
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6 bg-gradient-to-br from-gray-50 to-white min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Scheme Management
          </h1>
          <p className="text-gray-600 text-lg">Manage project schemes and funding programs</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => refetch()} 
            variant="outline"
            className="border-2 border-blue-600 text-blue-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 hover:text-white transition-all duration-300 hover:scale-105"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          {(!schemes || schemes.length === 0) && (
            <Button
              onClick={handleInitializeDefault}
              disabled={isInitializing}
              variant="outline"
              className="border-2 border-green-600 text-green-600 hover:bg-gradient-to-r hover:from-green-600 hover:to-green-700 hover:text-white transition-all duration-300 hover:scale-105"
            >
              {isInitializing ? "Initializing..." : "Initialize Default"}
            </Button>
          )}
          <Button 
            onClick={handleNewScheme} 
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Scheme
          </Button>
        </div>
      </div>

      {/* Schemes Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Project Schemes ({schemes?.length || 0})
          </CardTitle>
          <CardDescription>Manage all project schemes and funding programs</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading schemes...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">Error loading schemes. Please try again.</p>
              <p className="text-sm text-gray-500 mt-2">
                {error?.data?.message || error?.message || 'Unknown error occurred'}
              </p>
            </div>
          ) : schemes && schemes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Projects</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schemes.map((scheme) => (
                  <TableRow key={scheme._id}>
                    <TableCell className="font-medium">
                      <button
                        onClick={() => handleSchemeClick(scheme)}
                        className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                        title="Click to view projects"
                      >
                        {scheme.name}
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">
                        {scheme.description || "No description"}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(scheme.isActive)}</TableCell>
                    <TableCell>
                      <ProjectCount schemeName={scheme.name} />
                    </TableCell>
                    <TableCell>
                      {scheme.createdBy ? 
                        `${scheme.createdBy.firstName} ${scheme.createdBy.lastName}` : 
                        'System'
                      }
                    </TableCell>
                    <TableCell>{new Date(scheme.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditScheme(scheme)}
                          disabled={!scheme.isActive}
                          title={scheme.isActive ? "Edit Scheme" : "Cannot edit deleted scheme"}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {scheme.isActive ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteScheme(scheme._id)}
                            disabled={isDeleting}
                            title="Delete Scheme"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        ) : (
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRestoreScheme(scheme._id)}
                              disabled={isUpdating}
                              title="Restore Scheme"
                              className="text-green-600 hover:text-green-700"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePermanentDeleteScheme(scheme._id)}
                              disabled={isPermanentlyDeleting}
                              title="Permanently Delete Scheme"
                              className="text-red-800 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No schemes found</h3>
              <p className="text-gray-600 mb-4">
                Get started by creating your first scheme or initializing default schemes.
              </p>
              <div className="flex justify-center gap-2">
                <Button onClick={handleNewScheme} className="bg-[#0d559e] hover:bg-[#0d559e]/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Scheme
                </Button>
                <Button
                  onClick={handleInitializeDefault}
                  disabled={isInitializing}
                  variant="outline"
                >
                  {isInitializing ? "Initializing..." : "Initialize Default"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Projects View for Selected Scheme */}
      {selectedScheme && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToSchemes}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Schemes
                </Button>
                <div>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Projects in "{selectedScheme.name}" Scheme
                  </CardTitle>
                  <CardDescription>
                    {schemeProjects?.total || 0} projects found
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingProjects ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading projects...</p>
              </div>
            ) : schemeProjects?.projects && schemeProjects.projects.length > 0 ? (
              <div className="space-y-4">
                {schemeProjects.projects.map((project) => (
                  <div key={project._id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">
                          {project.title}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {project.description || "No description available"}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>File Number: {project.fileNumber}</span>
                          <span>Discipline: {project.discipline}</span>
                          <span>Year: {project.budget?.sanctionYear}</span>
                          <span>Budget: ₹{project.budget?.sanctionAmount?.toLocaleString()}</span>
                        </div>
                        <div className="mt-2">
                          <span className="text-sm text-gray-500">
                            Created by: {project.createdBy?.firstName} {project.createdBy?.lastName}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          {project.validationStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-600">
                  No projects have been created under the "{selectedScheme.name}" scheme yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Scheme Dialog */}
      <Dialog open={schemeDialog} onOpenChange={setSchemeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingScheme ? "Edit Scheme" : "Create New Scheme"}
            </DialogTitle>
            <DialogDescription>
              {editingScheme ? "Update the scheme information" : "Add a new project scheme"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="schemeName">Scheme Name *</Label>
              <Input
                id="schemeName"
                value={schemeData.name}
                onChange={(e) => setSchemeData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter scheme name"
                required
              />
            </div>

            <div>
              <Label htmlFor="schemeDescription">Description</Label>
              <Textarea
                id="schemeDescription"
                value={schemeData.description}
                onChange={(e) => setSchemeData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter scheme description"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSchemeDialog(false)
                  setEditingScheme(null)
                  setSchemeData({ name: "", description: "" })
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={editingScheme ? handleUpdateScheme : handleCreateScheme}
                disabled={!schemeData.name.trim() || (editingScheme ? isUpdating : isCreating)}
                className="bg-[#0d559e] hover:bg-[#0d559e]/90"
              >
                {editingScheme ? 
                  (isUpdating ? "Updating..." : "Update Scheme") :
                  (isCreating ? "Creating..." : "Create Scheme")
                }
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SchemeManagement
