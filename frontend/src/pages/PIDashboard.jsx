import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { selectCurrentUser, logout } from "../store/slices/authSlice"
import { useLogoutMutation } from "../store/api/authApi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog"
import { Alert, AlertDescription } from "../components/ui/alert"
import { Badge } from "../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { 
  Plus, 
  Edit, 
  Eye, 
  Upload, 
  FileText, 
  Calendar,
  DollarSign,
  Users,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  LogOut,
  User,
  Settings
} from "lucide-react"
import { 
  useGetMyPIProjectsQuery, 
  useGetPIProjectStatsQuery,
  useCreatePIProjectMutation,
  useUpdatePIProjectMutation,
  useUploadProjectDocumentsMutation,
  useSubmitProgressReportMutation
} from "../store/api/piProjectApi"
import { useGetAllProjectsAdminQuery, useCreateProjectMutation, useUpdateProjectMutation, useDeleteProjectMutation } from "../store/api/adminApi"
import ProjectForm from "../components/admin/ProjectForm"
import FileManager from "../components/admin/FileManager"

const PIDashboard = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser)
  const [logoutMutation] = useLogoutMutation()
  
  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      dispatch(logout())
      navigate("/")
    }
  }
  
  const [activeTab, setActiveTab] = useState("management")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [selectedProject, setSelectedProject] = useState(null)
  
  // Admin-style project management state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(12)
  const [filters, setFilters] = useState({
    search: "",
    discipline: "",
    year: ""
  })
  
  const [formData, setFormData] = useState({
    projectTitle: "",
    projectDescription: "",
    projectType: "Research",
    startDate: "",
    endDate: "",
    duration: "",
    fundingAgency: "",
    fundingScheme: "",
    totalBudget: "",
    currency: "INR",
    piDepartment: "",
    objectives: [],
    expectedOutcomes: [],
    deliverables: [],
    methodology: "",
    technologyStack: [],
    teamMembers: []
  })
  const [reportData, setReportData] = useState({
    period: {
      startDate: "",
      endDate: ""
    },
    achievements: [],
    challenges: [],
    nextSteps: [],
    financialStatus: {
      totalSpent: 0,
      remainingBudget: 0
    }
  })
  const [formError, setFormError] = useState("")
  const [newObjective, setNewObjective] = useState("")
  const [newOutcome, setNewOutcome] = useState("")
  const [newDeliverable, setNewDeliverable] = useState("")
  const [newAchievement, setNewAchievement] = useState("")
  const [newChallenge, setNewChallenge] = useState("")
  const [newNextStep, setNewNextStep] = useState("")

  // API hooks
  const { data: projectsData, isLoading, error, refetch } = useGetMyPIProjectsQuery({})
  const { data: statsData, isLoading: statsLoading } = useGetPIProjectStatsQuery()
  const [createProject, { isLoading: isCreating }] = useCreatePIProjectMutation()
  const [updateProject, { isLoading: isUpdating }] = useUpdatePIProjectMutation()
  const [uploadDocuments, { isLoading: isUploading }] = useUploadProjectDocumentsMutation()
  const [submitReport, { isLoading: isSubmitting }] = useSubmitProgressReportMutation()
  
  // Admin-style project management API hooks
  const { data: adminProjectsData, isLoading: adminLoading, error: adminError, refetch: adminRefetch } = useGetAllProjectsAdminQuery({
    page: currentPage,
    limit: pageSize,
    ...filters
  })
  const [createAdminProject, { isLoading: isCreatingAdmin }] = useCreateProjectMutation()
  const [updateAdminProject, { isLoading: isUpdatingAdmin }] = useUpdateProjectMutation()
  const [deleteAdminProject, { isLoading: isDeletingAdmin }] = useDeleteProjectMutation()

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setFormError("")
  }

  // Admin-style project management handlers
  const handleFilterChange = (key, value) => {
    // Convert empty strings to undefined for proper filtering
    const filterValue = value === "" ? undefined : value
    setFilters(prev => ({ ...prev, [key]: filterValue }))
    setCurrentPage(1)
  }

  const handleCreateAdminProject = async (projectData) => {
    try {
      await createAdminProject(projectData).unwrap()
      setIsCreateDialogOpen(false)
      adminRefetch()
      alert("Project created successfully!")
    } catch (error) {
      console.error("Failed to create project:", error)
      alert(`Failed to create project: ${error?.data?.message || error?.message || 'Unknown error'}`)
    }
  }

  const handleUpdateAdminProject = async (projectData) => {
    try {
      await updateAdminProject({ id: editingProject._id, ...projectData }).unwrap()
      setIsEditDialogOpen(false)
      setEditingProject(null)
      adminRefetch()
      alert("Project updated successfully!")
    } catch (error) {
      console.error("Failed to update project:", error)
      alert(`Failed to update project: ${error?.data?.message || error?.message || 'Unknown error'}`)
    }
  }

  const handleDeleteAdminProject = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteAdminProject(projectId).unwrap()
        adminRefetch()
        alert("Project deleted successfully!")
      } catch (error) {
        console.error("Failed to delete project:", error)
        alert(`Failed to delete project: ${error?.data?.message || error?.message || 'Unknown error'}`)
      }
    }
  }

  const handleEditAdminProject = (project) => {
    setEditingProject(project)
    setIsEditDialogOpen(true)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0)
  }

  const handleCreateProject = async (e) => {
    e.preventDefault()
    setFormError("")

    // Validation
    if (!formData.projectTitle || !formData.projectDescription || !formData.startDate || !formData.endDate || !formData.fundingAgency || !formData.totalBudget) {
      setFormError("Please fill in all required fields")
      return
    }

    try {
      await createProject(formData).unwrap()
      setFormData({
        projectTitle: "",
        projectDescription: "",
        projectType: "Research",
        startDate: "",
        endDate: "",
        duration: "",
        fundingAgency: "",
        fundingScheme: "",
        totalBudget: "",
        currency: "INR",
        piDepartment: "",
        objectives: [],
        expectedOutcomes: [],
        deliverables: [],
        methodology: "",
        technologyStack: [],
        teamMembers: []
      })
      setIsCreateDialogOpen(false)
      refetch()
      alert("Project created successfully!")
    } catch (error) {
      console.error("Failed to create project:", error)
      setFormError(error?.data?.message || "Failed to create project. Please try again.")
    }
  }

  const handleUpdateProject = async (projectData) => {
    try {
      await updateProject({ id: editingProject._id, ...projectData }).unwrap()
      setIsEditDialogOpen(false)
      setEditingProject(null)
      refetch()
      alert("Project updated successfully!")
    } catch (error) {
      console.error("Failed to update project:", error)
      setFormError(error?.data?.message || "Failed to update project. Please try again.")
    }
  }

  const handleUploadDocuments = async (formData) => {
    try {
      await uploadDocuments({ projectId: selectedProject._id, formData }).unwrap()
      setIsUploadDialogOpen(false)
      setSelectedProject(null)
      refetch()
      alert("Documents uploaded successfully!")
    } catch (error) {
      console.error("Failed to upload documents:", error)
      setFormError(error?.data?.message || "Failed to upload documents. Please try again.")
    }
  }

  const handleSubmitReport = async (e) => {
    e.preventDefault()
    setFormError("")

    try {
      await submitReport({ projectId: selectedProject._id, reportData }).unwrap()
      setIsReportDialogOpen(false)
      setSelectedProject(null)
      refetch()
      alert("Progress report submitted successfully!")
    } catch (error) {
      console.error("Failed to submit report:", error)
      setFormError(error?.data?.message || "Failed to submit report. Please try again.")
    }
  }

  // Helper functions for adding items to arrays
  const addObjective = () => {
    if (newObjective.trim()) {
      setFormData(prev => ({
        ...prev,
        objectives: [...prev.objectives, newObjective.trim()]
      }))
      setNewObjective("")
    }
  }

  const addOutcome = () => {
    if (newOutcome.trim()) {
      setFormData(prev => ({
        ...prev,
        expectedOutcomes: [...prev.expectedOutcomes, newOutcome.trim()]
      }))
      setNewOutcome("")
    }
  }

  const addDeliverable = () => {
    if (newDeliverable.trim()) {
      setFormData(prev => ({
        ...prev,
        deliverables: [...prev.deliverables, newDeliverable.trim()]
      }))
      setNewDeliverable("")
    }
  }

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setReportData(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }))
      setNewAchievement("")
    }
  }

  const addChallenge = () => {
    if (newChallenge.trim()) {
      setReportData(prev => ({
        ...prev,
        challenges: [...prev.challenges, newChallenge.trim()]
      }))
      setNewChallenge("")
    }
  }

  const addNextStep = () => {
    if (newNextStep.trim()) {
      setReportData(prev => ({
        ...prev,
        nextSteps: [...prev.nextSteps, newNextStep.trim()]
      }))
      setNewNextStep("")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">PI Dashboard</h1>
              <p className="text-gray-600">Manage your research projects and track progress</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="text-left sm:text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      Account
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem disabled>
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="management">Project Management</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">My Projects</TabsTrigger>
            <TabsTrigger value="reports">Progress Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statsData?.totalProjects || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    All your projects
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statsData?.inProgressProjects || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Currently in progress
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statsData?.completedProjects || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Successfully completed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statsData?.pendingProjects || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Awaiting approval
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* My Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>My Projects</CardTitle>
                    <CardDescription>Manage your research projects</CardDescription>
                  </div>
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#0d559e] hover:bg-[#0d559e]/90">
                        <Plus className="h-4 w-4 mr-2" />
                        New Project
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Create New Project</DialogTitle>
                        <DialogDescription>
                          Add a new research project to your portfolio
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCreateProject} className="space-y-4">
                        {formError && (
                          <Alert className="border-red-200 bg-red-50">
                            <AlertDescription className="text-red-800">
                              {formError}
                            </AlertDescription>
                          </Alert>
                        )}
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="projectTitle">Project Title *</Label>
                            <Input
                              id="projectTitle"
                              value={formData.projectTitle}
                              onChange={(e) => handleInputChange("projectTitle", e.target.value)}
                              placeholder="Enter project title"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="projectType">Project Type *</Label>
                            <Select value={formData.projectType} onValueChange={(value) => handleInputChange("projectType", value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Research">Research</SelectItem>
                                <SelectItem value="Development">Development</SelectItem>
                                <SelectItem value="Innovation">Innovation</SelectItem>
                                <SelectItem value="Collaboration">Collaboration</SelectItem>
                                <SelectItem value="Consultancy">Consultancy</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="projectDescription">Project Description *</Label>
                          <Textarea
                            id="projectDescription"
                            value={formData.projectDescription}
                            onChange={(e) => handleInputChange("projectDescription", e.target.value)}
                            placeholder="Describe your project"
                            rows={3}
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="startDate">Start Date *</Label>
                            <Input
                              id="startDate"
                              type="date"
                              value={formData.startDate}
                              onChange={(e) => handleInputChange("startDate", e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="endDate">End Date *</Label>
                            <Input
                              id="endDate"
                              type="date"
                              value={formData.endDate}
                              onChange={(e) => handleInputChange("endDate", e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="duration">Duration (months)</Label>
                            <Input
                              id="duration"
                              type="number"
                              value={formData.duration}
                              onChange={(e) => handleInputChange("duration", e.target.value)}
                              placeholder="Enter duration"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="fundingAgency">Funding Agency *</Label>
                            <Input
                              id="fundingAgency"
                              value={formData.fundingAgency}
                              onChange={(e) => handleInputChange("fundingAgency", e.target.value)}
                              placeholder="Enter funding agency"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="fundingScheme">Funding Scheme</Label>
                            <Input
                              id="fundingScheme"
                              value={formData.fundingScheme}
                              onChange={(e) => handleInputChange("fundingScheme", e.target.value)}
                              placeholder="Enter funding scheme"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="totalBudget">Total Budget *</Label>
                            <Input
                              id="totalBudget"
                              type="number"
                              value={formData.totalBudget}
                              onChange={(e) => handleInputChange("totalBudget", e.target.value)}
                              placeholder="Enter total budget"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="currency">Currency</Label>
                            <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="INR">INR</SelectItem>
                                <SelectItem value="USD">USD</SelectItem>
                                <SelectItem value="EUR">EUR</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="piDepartment">PI Department</Label>
                          <Input
                            id="piDepartment"
                            value={formData.piDepartment}
                            onChange={(e) => handleInputChange("piDepartment", e.target.value)}
                            placeholder="Enter your department"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="methodology">Methodology</Label>
                          <Textarea
                            id="methodology"
                            value={formData.methodology}
                            onChange={(e) => handleInputChange("methodology", e.target.value)}
                            placeholder="Describe your research methodology"
                            rows={3}
                          />
                        </div>
                        
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isCreating} className="bg-[#0d559e] hover:bg-[#0d559e]/90">
                            {isCreating ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Creating...
                              </>
                            ) : (
                              "Create Project"
                            )}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : error ? (
                  <p className="text-red-600">Error loading projects. Please try again.</p>
                ) : (
                  <div className="space-y-4">
                    {projectsData?.projects?.map((project) => (
                      <Card key={project._id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <h3 className="font-semibold text-lg">{project.title}</h3>
                            <p className="text-gray-600 text-sm">{project.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                              </span>
                              <span className="flex items-center">
                                <DollarSign className="h-4 w-4 mr-1" />
                                {project.budget?.amount} {project.budget?.currency}
                              </span>
                              <Badge variant={project.status === 'Approved' ? 'default' : 'secondary'}>
                                {project.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => setEditingProject(project)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setSelectedProject(project)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                    {projectsData?.projects?.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No projects found. Create your first project to get started.
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Project Management Tab - Same as Admin */}
          <TabsContent value="management" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Project Management</CardTitle>
                    <CardDescription>Comprehensive project management with admin-level features</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => adminRefetch()}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-[#0d559e] hover:bg-[#0d559e]/90">
                          <Plus className="h-4 w-4 mr-2" />
                          Create Project
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Create New Project</DialogTitle>
                          <DialogDescription>
                            Create a comprehensive research project with all details
                          </DialogDescription>
                        </DialogHeader>
                        <ProjectForm
                          onSubmit={handleCreateAdminProject}
                          onCancel={() => setIsCreateDialogOpen(false)}
                          isLoading={isCreatingAdmin}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Search and Filters */}
                <div className="mb-6 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Search projects..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange("search", e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <Select value={filters.discipline || "all"} onValueChange={(value) => handleFilterChange("discipline", value === "all" ? undefined : value)}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="All Disciplines" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Disciplines</SelectItem>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="Physics">Physics</SelectItem>
                        <SelectItem value="Chemistry">Chemistry</SelectItem>
                        <SelectItem value="Biology">Biology</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filters.year || "all"} onValueChange={(value) => handleFilterChange("year", value === "all" ? undefined : value)}>
                      <SelectTrigger className="w-full sm:w-32">
                        <SelectValue placeholder="All Years" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Years</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                        <SelectItem value="2021">2021</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Projects Table */}
                {adminLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : adminError ? (
                  <p className="text-red-600">Error loading projects. Please try again.</p>
                ) : (
                  <div className="space-y-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Discipline</TableHead>
                          <TableHead>PI</TableHead>
                          <TableHead>Budget</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {adminProjectsData?.projects?.map((project) => (
                          <TableRow key={project._id}>
                            <TableCell className="font-medium">{project.title}</TableCell>
                            <TableCell>{project.discipline}</TableCell>
                            <TableCell>{project.pi?.name || "N/A"}</TableCell>
                            <TableCell>{formatCurrency(project.budget?.totalAmount)}</TableCell>
                            <TableCell>
                              <Badge variant={project.validationStatus === 'Validated' ? 'default' : 'secondary'}>
                                {project.validationStatus || 'Pending'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm" onClick={() => setSelectedProject(project)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleEditAdminProject(project)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleDeleteAdminProject(project._id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {/* Pagination */}
                    {adminProjectsData?.totalPages > 1 && (
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-700">
                          Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, adminProjectsData?.total)} of {adminProjectsData?.total} results
                        </p>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, adminProjectsData?.totalPages))}
                            disabled={currentPage === adminProjectsData?.totalPages}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Progress Reports</CardTitle>
                <CardDescription>Submit and manage progress reports for your projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Progress reports functionality will be available soon.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update project details
            </DialogDescription>
          </DialogHeader>
          <ProjectForm
            project={editingProject}
            onSubmit={handleUpdateAdminProject}
            onCancel={() => {
              setIsEditDialogOpen(false)
              setEditingProject(null)
            }}
            isLoading={isUpdatingAdmin}
          />
        </DialogContent>
      </Dialog>

      {/* Project Details Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Project Details</DialogTitle>
            <DialogDescription>
              View comprehensive project information and manage files
            </DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-6">
              {/* Project Information */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Title</Label>
                    <p className="text-sm">{selectedProject.title}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Discipline</Label>
                    <p className="text-sm">{selectedProject.discipline}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm">{selectedProject.projectSummary}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Principal Investigator</Label>
                    <p className="text-sm">{selectedProject.pi?.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Budget</Label>
                    <p className="text-sm">{formatCurrency(selectedProject.budget?.totalAmount)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">File Number</Label>
                    <p className="text-sm">{selectedProject.fileNumber || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <Badge variant={selectedProject.validationStatus === 'Validated' ? 'default' : 'secondary'}>
                      {selectedProject.validationStatus || 'Pending'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* File Management */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Project Files</h3>
                  <Button variant="outline" size="sm" onClick={() => setSelectedProject(null)}>
                    Close
                  </Button>
                </div>
                <FileManager projectId={selectedProject._id} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PIDashboard
