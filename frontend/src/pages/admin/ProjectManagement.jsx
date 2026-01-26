"use client"

import React, { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { ChevronLeft, ChevronRight, Eye, Edit, Trash2, CheckCircle, Plus, RefreshCw, Upload, FileText } from "lucide-react"
import { useGetAllProjectsAdminQuery, useGetProjectByIdQuery, useCreateProjectMutation, useUpdateProjectMutation, useDeleteProjectMutation } from "../../store/api/adminApi"
import { useUploadPatentDocumentsMutation } from "../../store/api/fileApi"
import ProjectForm from "../../components/admin/ProjectForm"
import FileManager from "../../components/admin/FileManager"
import CSVImportProjects from "../../components/admin/CSVImportProjects"
import { formatCurrencyInLakhsOrCrores } from "../../lib/utils"

const ProjectManagement = () => {
  const [searchParams] = useSearchParams()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(12)
  
  // Initialize filters from URL params
  const [filters, setFilters] = useState({
    search: "",
    discipline: "",
    year: "",
    validationStatus: searchParams.get("validationStatus") || ""
  })
  
  // Update filters when URL params change
  useEffect(() => {
    const statusFromUrl = searchParams.get("validationStatus")
    if (statusFromUrl) {
      setFilters(prev => ({ ...prev, validationStatus: statusFromUrl }))
      setCurrentPage(1) // Reset to first page when filter changes
    }
  }, [searchParams])
  
  const [projectFormDialog, setProjectFormDialog] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [selectedProject, setSelectedProject] = useState(null)
  const [csvImportDialog, setCsvImportDialog] = useState(false)

  const { data, isLoading, error, refetch } = useGetAllProjectsAdminQuery({
    page: currentPage,
    limit: pageSize,
    ...filters
  })

  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation()
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation()
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation()
  const [uploadPatentDocuments] = useUploadPatentDocumentsMutation()
  
  // Get project by ID query for refetching after upload
  const getProjectByIdQuery = useGetProjectByIdQuery(editingProject?._id, {
    skip: !editingProject?._id, // Skip if no project is being edited
  })

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const handleCreateProject = async (projectData, patentFiles = [], patentsWithFiles = []) => {
    try {
      const result = await createProject(projectData).unwrap()
      const projectId = result.project?._id
      
      if (!projectId) {
        throw new Error("Project ID not returned from server")
      }
      
      // Upload legacy patent documents if any
      if (patentFiles && patentFiles.length > 0) {
        try {
          await uploadPatentDocuments({ projectId, files: patentFiles }).unwrap()
          console.log("Legacy patent documents uploaded successfully")
        } catch (uploadError) {
          console.error("Failed to upload legacy patent documents:", uploadError)
        }
      }
      
      // Upload individual patent documents
      if (patentsWithFiles && patentsWithFiles.length > 0) {
        for (let i = 0; i < patentsWithFiles.length; i++) {
          const patent = patentsWithFiles[i]
          if (patent.patentDocument) {
            try {
              // Upload file and link it to the specific patent index
              const uploadResult = await uploadPatentDocuments({ 
                projectId, 
                files: [patent.patentDocument],
                patentIndex: i 
              }).unwrap()
              console.log(`Patent ${i + 1} document uploaded successfully`)
              console.log("Upload result:", uploadResult)
              
              // If the upload result includes the updated project, use it to update editingProject
              if (uploadResult.project && editingProject?._id === projectId) {
                setEditingProject(uploadResult.project)
                console.log("Updated editingProject with uploaded document")
              }
            } catch (uploadError) {
              console.error(`Failed to upload patent ${i + 1} document:`, uploadError)
              alert(`Project created successfully, but patent ${i + 1} document failed to upload. Please try uploading it again.`)
            }
          }
        }
      }
      
      setProjectFormDialog(false)
      refetch()
      alert("Project created successfully!")
    } catch (error) {
      console.error("Failed to create project:", error)
      alert(`Failed to create project: ${error?.data?.message || error?.message || 'Unknown error'}`)
    }
  }

  const handleUpdateProject = async (projectData, patentFiles = [], patentsWithFiles = []) => {
    try {
      console.log("Updating project with data:", { id: editingProject._id, ...projectData })
      const result = await updateProject({ id: editingProject._id, ...projectData }).unwrap()
      console.log("Update result:", result)
      
      const projectId = editingProject._id
      
      // Upload legacy patent documents if any
      if (patentFiles && patentFiles.length > 0) {
        try {
          await uploadPatentDocuments({ projectId, files: patentFiles }).unwrap()
          console.log("Legacy patent documents uploaded successfully")
        } catch (uploadError) {
          console.error("Failed to upload legacy patent documents:", uploadError)
        }
      }
      
      // Upload individual patent documents and collect updated projects
      let latestProject = null
      if (patentsWithFiles && patentsWithFiles.length > 0) {
        for (let i = 0; i < patentsWithFiles.length; i++) {
          const patent = patentsWithFiles[i]
          if (patent.patentDocument) {
            try {
              // Upload file and link it to the specific patent index
              const uploadResult = await uploadPatentDocuments({ 
                projectId, 
                files: [patent.patentDocument],
                patentIndex: i 
              }).unwrap()
              console.log(`Patent ${i + 1} document uploaded successfully`)
              console.log("Upload result:", uploadResult)
              
              // If the upload result includes the updated project, use it
              if (uploadResult.project) {
                latestProject = uploadResult.project
                console.log("Got updated project from upload:", latestProject.patents)
              }
            } catch (uploadError) {
              console.error(`Failed to upload patent ${i + 1} document:`, uploadError)
              alert(`Project updated, but patent ${i + 1} document failed to upload. Please try uploading it again.`)
            }
          }
        }
      }
      
      // Use the project from upload result, or refetch if not available
      if (latestProject && editingProject?._id === projectId) {
        // Use the project returned from the last upload
        setEditingProject(latestProject)
        console.log("Updated editingProject with project from upload:", latestProject.patents)
      } else if (editingProject?._id) {
        // Fallback: Refetch the project if upload didn't return it
        try {
          const updatedProjectResult = await getProjectByIdQuery.refetch()
          if (updatedProjectResult?.data) {
            setEditingProject(updatedProjectResult.data)
            console.log("Updated editingProject from refetch:", updatedProjectResult.data.patents)
          }
        } catch (refetchError) {
          console.error("Failed to refetch project:", refetchError)
        }
      }
      
      // Refetch the projects list to show updated data
      await refetch()
      
      // Keep dialog open briefly so user can see uploaded documents, then close
      alert("Project updated successfully! Patent documents have been uploaded. The form will refresh to show the uploaded documents.")
      
      // Close dialog and reset editing state after a short delay to allow user to see the update
      setTimeout(() => {
        setProjectFormDialog(false)
        setEditingProject(null)
      }, 3000)
    } catch (error) {
      console.error("Failed to update project:", error)
      console.error("Error details:", error?.data || error)
      alert(`Failed to update project: ${error?.data?.message || error?.message || 'Unknown error'}`)
    }
  }

  const handleDeleteProject = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(projectId).unwrap()
        refetch()
        alert("Project deleted successfully!")
      } catch (error) {
        console.error("Failed to delete project:", error)
        alert(`Failed to delete project: ${error?.data?.message || error?.message || 'Unknown error'}`)
      }
    }
  }

  const handleCSVImportSuccess = () => {
    refetch()
  }


  const handleEditProject = (project) => {
    setEditingProject(project)
    setProjectFormDialog(true)
  }

  const formatCurrency = (amount) => {
    // For admin view, show in standard INR format
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0)
  }
  
  const formatCurrencyInCrores = (amount) => {
    if (!amount || amount === 0) return "₹0 Cr"
    const crores = amount / 10000000
    return `₹${crores.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })} Cr`
  }


  return (
    <div className="space-y-6 bg-gradient-to-br from-gray-50 to-white min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-8">
        <div className="flex-1">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Project Management
          </h1>
          <p className="text-gray-600 text-lg">Manage and validate research projects</p>
          {filters.validationStatus && (
            <div className="mt-2">
              <Badge className="bg-blue-600 text-white">
                Filtered by: {filters.validationStatus} Projects
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFilterChange("validationStatus", "")}
                className="ml-2 text-blue-600 hover:text-blue-700"
              >
                Clear Status Filter
              </Button>
            </div>
          )}
          <p className="text-sm text-blue-600 mt-1">CSV Import feature is available - look for the "Import CSV" button</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={() => setCsvImportDialog(true)} 
            variant="outline"
            className="border-2 border-blue-600 text-blue-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 hover:text-white hover:border-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Button 
            onClick={() => setProjectFormDialog(true)} 
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Project
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="group hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-200 overflow-hidden relative bg-gradient-to-br from-white to-blue-50/20">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardHeader className="relative z-10">
          <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-blue-700 transition-colors">Filters</CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <input
                type="text"
                placeholder="Search projects..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Discipline</label>
              <input
                type="text"
                placeholder="Filter by discipline..."
                value={filters.discipline}
                onChange={(e) => handleFilterChange("discipline", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Year</label>
              <input
                type="number"
                placeholder="Filter by year..."
                value={filters.year}
                onChange={(e) => handleFilterChange("year", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={filters.validationStatus || "All"}
                onValueChange={(value) => handleFilterChange("validationStatus", value === "All" ? "" : value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Ongoing">Ongoing</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button 
              variant="outline" 
              onClick={() => refetch()}
              className="border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 hover:scale-105"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card className="group hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-200 overflow-hidden relative bg-gradient-to-br from-white to-purple-50/20">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-400/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardHeader className="relative z-10">
          <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-purple-700 transition-colors">
            Projects <span className="text-purple-600">({data?.total || 0})</span>
          </CardTitle>
          <CardDescription className="text-gray-600">Manage and validate research projects</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading projects...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">Error loading projects. Please try again.</p>
              <p className="text-sm text-gray-500 mt-2">
                {error?.data?.message || error?.message || 'Unknown error occurred'}
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Number</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Discipline</TableHead>
                    <TableHead>PI Name</TableHead>
                    <TableHead>Institute</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Sanction Year</TableHead>
                    <TableHead>Validation</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.projects?.map((project) => (
                    <TableRow 
                      key={project._id}
                      className="group/row hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300 cursor-pointer hover:shadow-md"
                    >
                      <TableCell className="font-medium">
                        <div className="text-sm font-mono text-blue-700 group-hover/row:text-blue-900 transition-colors">{project.fileNumber || 'N/A'}</div>
                      </TableCell>
                      <TableCell className="font-medium max-w-xs">
                        <div className="truncate group-hover/row:text-gray-900 transition-colors">{project.title}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100 transition-colors">
                          {project.discipline}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{project.principalInvestigators?.[0]?.name || project.pi?.name || 'N/A'}</div>
                          <div className="text-gray-500">{project.principalInvestigators?.[0]?.email || project.pi?.email || ''}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{project.principalInvestigators?.[0]?.instituteName || project.pi?.instituteName || 'N/A'}</div>
                          <div className="text-gray-500">{project.principalInvestigators?.[0]?.department || project.pi?.department || ''}</div>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrencyInLakhsOrCrores(project.budget?.totalAmount || 0)}</TableCell>
                      <TableCell>{project.budget?.sanctionYear || 'N/A'}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                title="View Details"
                                className="hover:bg-blue-100 hover:text-blue-700 transition-all duration-300 hover:scale-110"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>{project.title}</DialogTitle>
                                <DialogDescription>Project details and file management</DialogDescription>
                              </DialogHeader>

                              <div className="space-y-6">
                                {/* Project Basic Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium mb-2">File Number</h4>
                                    <p className="font-mono text-sm">{project.fileNumber || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-2">Discipline</h4>
                                    <Badge variant="outline">{project.discipline}</Badge>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-2">Project Summary</h4>
                                    <p className="text-sm">{project.projectSummary}</p>
                                  </div>
                                </div>

                                {/* Principal Investigators */}
                                <div>
                                  <h4 className="font-medium mb-3">Principal Investigators</h4>
                                  {project.principalInvestigators && project.principalInvestigators.length > 0 ? (
                                    <div className="space-y-4">
                                      {project.principalInvestigators.map((pi, index) => (
                                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                          <div>
                                            <p className="font-medium">{pi.name || 'N/A'}</p>
                                            <p className="text-sm text-gray-600">{pi.email || ''}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm">{pi.designation || ''}</p>
                                            <p className="text-sm text-gray-600">{pi.department || ''}</p>
                                            <p className="text-sm text-gray-600">{pi.instituteName || ''}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                      <div>
                                        <p className="font-medium">{project.pi?.name || 'N/A'}</p>
                                        <p className="text-sm text-gray-600">{project.pi?.email || ''}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm">{project.pi?.designation || ''}</p>
                                        <p className="text-sm text-gray-600">{project.pi?.department || ''}</p>
                                        <p className="text-sm text-gray-600">{project.pi?.instituteName || ''}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Co-Principal Investigators */}
                                {project.coPrincipalInvestigators && project.coPrincipalInvestigators.length > 0 && (
                                  <div>
                                    <h4 className="font-medium mb-3">Co-Principal Investigators</h4>
                                    <div className="space-y-4">
                                      {project.coPrincipalInvestigators.map((coPI, index) => (
                                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                                          <div>
                                            <p className="font-medium">{coPI.name || 'N/A'}</p>
                                            <p className="text-sm text-gray-600">{coPI.email || ''}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm">{coPI.designation || ''}</p>
                                            <p className="text-sm text-gray-600">{coPI.department || ''}</p>
                                            <p className="text-sm text-gray-600">{coPI.instituteName || ''}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Legacy Co-Principal Investigator (for backward compatibility) */}
                                {project.coPI?.name && !project.coPrincipalInvestigators?.length && (
                                  <div>
                                    <h4 className="font-medium mb-3">Co-Principal Investigator</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                                      <div>
                                        <p className="font-medium">{project.coPI.name}</p>
                                        <p className="text-sm text-gray-600">{project.coPI.email}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm">{project.coPI.designation}</p>
                                        <p className="text-sm text-gray-600">{project.coPI.department}</p>
                                        <p className="text-sm text-gray-600">{project.coPI.instituteName}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Budget Information */}
                                <div>
                                  <h4 className="font-medium mb-3">Budget Information</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div>
                                      <p className="text-sm font-medium">Total Amount</p>
                                      <p className="font-medium">{formatCurrencyInLakhsOrCrores(project.budget?.totalAmount || 0)}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">Sanction Year</p>
                                      <p>{project.budget?.sanctionYear || 'N/A'}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">Date</p>
                                      <p>{project.budget?.date ? new Date(project.budget.date).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Equipment Sanctioned */}
                                {project.equipmentSanctioned && project.equipmentSanctioned.length > 0 && (
                                  <div>
                                    <h4 className="font-medium mb-3">Equipment Sanctioned</h4>
                                    <div className="space-y-3">
                                      {project.equipmentSanctioned.map((equipment, index) => (
                                        <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                              <p className="font-medium">{equipment.genericName}</p>
                                              <p className="text-sm text-gray-600">{equipment.make} - {equipment.model}</p>
                                            </div>
                                            <div>
                                              <p className="font-medium">{formatCurrency(equipment.priceInr)}</p>
                                              {equipment.invoiceUpload && (
                                                <p className="text-sm text-blue-600">Invoice: {equipment.invoiceUpload}</p>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Manpower Sanctioned */}
                                {project.manpowerSanctioned && project.manpowerSanctioned.length > 0 && (
                                  <div>
                                    <h4 className="font-medium mb-3">Manpower Sanctioned</h4>
                                    <div className="space-y-2">
                                      {project.manpowerSanctioned.map((manpower, index) => (
                                        <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-200">
                                          <div className="flex justify-between items-center">
                                            <p className="font-medium">{manpower.manpowerType}</p>
                                            <Badge variant="secondary">{manpower.number}</Badge>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Publications */}
                                {project.publications && project.publications.length > 0 && (
                                  <div>
                                    <h4 className="font-medium mb-3">Publications</h4>
                                    <div className="space-y-3">
                                      {project.publications.map((publication, index) => (
                                        <div key={index} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                          <div className="space-y-2">
                                            <p className="font-medium">{publication.name}</p>
                                            <p className="text-sm text-gray-600">{publication.publicationDetail}</p>
                                            <Badge variant="outline">{publication.status}</Badge>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Patents - Multiple Patent Entries */}
                                {project.patents && project.patents.length > 0 && (
                                  <div>
                                    <h4 className="font-medium mb-3">Patents ({project.patents.length})</h4>
                                    <div className="space-y-4">
                                      {project.patents.map((patent, index) => (
                                        <div key={index} className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                          <div className="space-y-3">
                                            <div className="flex items-start space-x-2">
                                              <span className="text-sm font-bold text-[#0d559e] mt-1">[{index + 1}]</span>
                                              {patent.patentDetail && (
                                                <p className="text-sm text-gray-700 flex-1">{patent.patentDetail}</p>
                                              )}
                                            </div>
                                            {patent.patentDocument && patent.patentDocument.filename && (
                                              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                                                <FileText className="h-5 w-5 text-blue-600" />
                                                <div className="flex-1">
                                                  <p className="text-sm font-medium text-gray-900">{patent.patentDocument.originalName}</p>
                                                  <p className="text-xs text-gray-500">
                                                    {(patent.patentDocument.size / 1024).toFixed(2)} KB • {new Date(patent.patentDocument.uploadedAt).toLocaleDateString()}
                                                  </p>
                                                </div>
                                                <a
                                                  href={`/api/files/projects/${project._id}/patent/${patent.patentDocument.filename}/download`}
                                                  download={patent.patentDocument.originalName}
                                                  className="text-[#0d559e] hover:text-[#004d8c] hover:underline text-sm font-medium"
                                                >
                                                  Download
                                                </a>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Legacy Patent Detail (for backward compatibility) */}
                                {project.patentDetail && (!project.patents || project.patents.length === 0) && (
                                  <div>
                                    <h4 className="font-medium mb-3">Patent Detail</h4>
                                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                      <p className="text-sm text-gray-700">{project.patentDetail}</p>
                                    </div>
                                  </div>
                                )}

                                {/* File Manager */}
                                <FileManager projectId={project._id} projectTitle={project.title} />
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditProject(project)}
                            title="Edit Project"
                            className="hover:bg-green-100 hover:text-green-700 transition-all duration-300 hover:scale-110"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProject(project._id)}
                            disabled={isDeleting}
                            title="Delete Project"
                            className="hover:bg-red-100 hover:text-red-700 transition-all duration-300 hover:scale-110 disabled:opacity-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>

                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {data?.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-6">
                  <Button
                    variant="outline"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 hover:scale-105 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <span className="flex items-center px-4 py-2 text-sm font-semibold text-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-gray-200">
                    Page <span className="mx-1 text-blue-600">{currentPage}</span> of <span className="mx-1 text-purple-600">{data.totalPages}</span>
                  </span>
                  <Button
                    variant="outline"
                    disabled={currentPage >= data.totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 hover:scale-105 disabled:opacity-50"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>


      {/* Project Form Dialog */}
      <Dialog open={projectFormDialog} onOpenChange={setProjectFormDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? "Edit Project" : "Create New Project"}
            </DialogTitle>
            <DialogDescription>
              {editingProject ? "Update project information" : "Fill in the project details below"}
            </DialogDescription>
          </DialogHeader>
          <ProjectForm
            project={editingProject}
            onSubmit={editingProject ? handleUpdateProject : handleCreateProject}
            onCancel={() => {
              setProjectFormDialog(false)
              setEditingProject(null)
            }}
            isLoading={editingProject ? isUpdating : isCreating}
            onProjectUpdate={(updatedProject) => {
              // Update the editingProject state with the fresh data
              setEditingProject(updatedProject)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* CSV Import Dialog */}
      {csvImportDialog && (
        <CSVImportProjects
          onClose={() => setCsvImportDialog(false)}
          onSuccess={handleCSVImportSuccess}
        />
      )}
    </div>
  )
}

export default ProjectManagement