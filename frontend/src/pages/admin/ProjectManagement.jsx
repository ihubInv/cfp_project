"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { ChevronLeft, ChevronRight, Eye, Edit, Trash2, CheckCircle, Plus, RefreshCw, Upload } from "lucide-react"
import { useGetAllProjectsAdminQuery, useCreateProjectMutation, useUpdateProjectMutation, useDeleteProjectMutation } from "../../store/api/adminApi"
import ProjectForm from "../../components/admin/ProjectForm"
import FileManager from "../../components/admin/FileManager"
import CSVImportProjects from "../../components/admin/CSVImportProjects"

const ProjectManagement = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(12)
  const [filters, setFilters] = useState({
    search: "",
    discipline: "",
    year: ""
  })
  
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

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const handleCreateProject = async (projectData) => {
    try {
      await createProject(projectData).unwrap()
      setProjectFormDialog(false)
      refetch()
      alert("Project created successfully!")
    } catch (error) {
      console.error("Failed to create project:", error)
      alert(`Failed to create project: ${error?.data?.message || error?.message || 'Unknown error'}`)
    }
  }

  const handleUpdateProject = async (projectData) => {
    try {
      await updateProject({ id: editingProject._id, ...projectData }).unwrap()
      setProjectFormDialog(false)
      setEditingProject(null)
      refetch()
      alert("Project updated successfully!")
    } catch (error) {
      console.error("Failed to update project:", error)
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
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0)
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Project Management</h1>
          <p className="text-gray-600">Manage and validate research projects</p>
          <p className="text-sm text-blue-600">CSV Import feature is available - look for the "Import CSV" button</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={() => setCsvImportDialog(true)} 
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Button onClick={() => setProjectFormDialog(true)} className="bg-[#0d559e] hover:bg-[#004d8c]">
            <Plus className="h-4 w-4 mr-2" />
            Create Project
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
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>Projects ({data?.total || 0})</CardTitle>
          <CardDescription>Manage and validate research projects</CardDescription>
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
                    <TableRow key={project._id}>
                      <TableCell className="font-medium">
                        <div className="text-sm font-mono">{project.fileNumber || 'N/A'}</div>
                      </TableCell>
                      <TableCell className="font-medium max-w-xs">
                        <div className="truncate">{project.title}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{project.discipline}</Badge>
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
                      <TableCell>{formatCurrency(project.budget?.totalAmount || 0)}</TableCell>
                      <TableCell>{project.budget?.sanctionYear || 'N/A'}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" title="View Details">
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
                                      <p className="font-medium">{formatCurrency(project.budget?.totalAmount || 0)}</p>
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

                                {/* Patent Detail */}
                                {project.patentDetail && (
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
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProject(project._id)}
                            disabled={isDeleting}
                            title="Delete Project"
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
                <div className="flex justify-center space-x-2 mt-4">
                  <Button
                    variant="outline"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <span className="flex items-center px-4 text-sm text-gray-600">
                    Page {currentPage} of {data.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={currentPage >= data.totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
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