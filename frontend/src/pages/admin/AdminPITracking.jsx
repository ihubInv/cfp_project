import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  FileText,
  Download,
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  Building,
  Loader2,
  Search,
  Filter
} from "lucide-react"
import { 
  useGetAllProjectsAdminQuery, 
  useGetDashboardStatsQuery
} from "../../store/api/adminApi"

const AdminPITracking = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [filters, setFilters] = useState({
    search: "",
    status: undefined,
    discipline: undefined,
    page: 1
  })

  // API hooks
  const { data: projectsData, isLoading, error, refetch } = useGetAllProjectsAdminQuery(filters)
  const { data: statsData, isLoading: statsLoading } = useGetDashboardStatsQuery()
  // Note: Review functionality will be added later

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === "" ? undefined : value,
      page: 1
    }))
  }

  const openReviewDialog = (project) => {
    setSelectedProject(project)
    setIsReviewDialogOpen(true)
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      "Pending": { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      "Validated": { color: "bg-green-100 text-green-800", icon: CheckCircle },
      "Rejected": { color: "bg-red-100 text-red-800", icon: XCircle },
      "Ongoing": { color: "bg-blue-100 text-blue-800", icon: TrendingUp },
      "Completed": { color: "bg-green-100 text-green-800", icon: CheckCircle }
    }
    
    const config = statusConfig[status] || statusConfig["Pending"]
    const IconComponent = config.icon
    
    return (
      <Badge className={config.color}>
        <IconComponent className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    )
  }


  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">PI Project Tracking</h1>
        <p className="text-gray-600">Monitor and review all Principal Investigator projects</p>
      </div>

      {/* Statistics Cards */}
      {!statsLoading && statsData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsData.totalProjects || 0}</div>
              <p className="text-xs text-muted-foreground">All projects</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsData.activeProjects || 0}</div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsData.completedProjects || 0}</div>
              <p className="text-xs text-muted-foreground">Finished projects</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              <DollarSign className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{statsData.totalBudget?.toLocaleString() || 0}</div>
              <p className="text-xs text-muted-foreground">All projects</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search projects..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={filters.status || ""}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Validated">Validated</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Ongoing">Ongoing</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.discipline || ""}
              onValueChange={(value) => handleFilterChange("discipline", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by discipline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Assistive Technology">Assistive Technology</SelectItem>
                <SelectItem value="Device-Led Technology">Device-Led Technology</SelectItem>
                <SelectItem value="Experience Technology">Experience Technology</SelectItem>
                <SelectItem value="Generative AI">Generative AI</SelectItem>
                <SelectItem value="Road Safety">Road Safety</SelectItem>
                <SelectItem value="Transitional Research">Transitional Research</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => setFilters({ search: "", status: undefined, discipline: undefined, page: 1 })}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>PI Projects ({projectsData?.total || 0})</CardTitle>
          <CardDescription>
            Review and track all Principal Investigator projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#0d559e]" />
              <p className="mt-2 text-gray-600">Loading projects...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">Error loading projects. Please try again.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Details</TableHead>
                  <TableHead>PI Information</TableHead>
                  <TableHead>Budget & Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectsData?.projects?.map((project) => (
                  <TableRow key={project._id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{project.title}</p>
                        <p className="text-sm text-gray-500">{project.discipline}</p>
                        <p className="text-sm text-gray-500">{project.scheme}</p>
                        <p className="text-sm text-gray-500">File: {project.fileNumber}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{project.pi?.name || project.principalInvestigators?.[0]?.name || 'N/A'}</p>
                        <p className="text-sm text-gray-500">{project.pi?.email || project.principalInvestigators?.[0]?.email || 'N/A'}</p>
                        <div className="flex items-center mt-1">
                          <Building className="w-3 h-3 mr-1 text-gray-400" />
                          <span className="text-sm text-gray-500">{project.pi?.instituteName || project.principalInvestigators?.[0]?.instituteName || 'N/A'}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <DollarSign className="w-3 h-3 mr-1 text-gray-400" />
                          <span className="text-sm">₹{project.budget?.totalAmount?.toLocaleString() || 'N/A'}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                          <span className="text-sm">{project.budget?.sanctionYear || 'N/A'}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(project.validationStatus || 'Pending')}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openReviewDialog(project)}
                          title="View Project"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Download Documents"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          {projectsData?.totalPages > 1 && (
            <div className="flex justify-center space-x-2 mt-4">
              <Button
                variant="outline"
                disabled={filters.page <= 1}
                onClick={() => handleFilterChange("page", filters.page - 1)}
              >
                Previous
              </Button>
              <span className="flex items-center px-4 text-sm text-gray-600">
                Page {filters.page} of {projectsData.totalPages}
              </span>
              <Button
                variant="outline"
                disabled={filters.page >= projectsData.totalPages}
                onClick={() => handleFilterChange("page", filters.page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Project Details Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Project Details</DialogTitle>
            <DialogDescription>
              View project: {selectedProject?.title}
            </DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Title</Label>
                  <p className="text-sm">{selectedProject.title}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">File Number</Label>
                  <p className="text-sm">{selectedProject.fileNumber}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Discipline</Label>
                  <p className="text-sm">{selectedProject.discipline}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Scheme</Label>
                  <p className="text-sm">{selectedProject.scheme}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Project Summary</Label>
                <p className="text-sm">{selectedProject.projectSummary}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Principal Investigator</Label>
                  <p className="text-sm">{selectedProject.pi?.name || selectedProject.principalInvestigators?.[0]?.name || 'N/A'}</p>
                  <p className="text-sm text-gray-500">{selectedProject.pi?.email || selectedProject.principalInvestigators?.[0]?.email || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Budget</Label>
                  <p className="text-sm">₹{selectedProject.budget?.totalAmount?.toLocaleString() || 'N/A'}</p>
                  <p className="text-sm text-gray-500">Year: {selectedProject.budget?.sanctionYear || 'N/A'}</p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminPITracking
