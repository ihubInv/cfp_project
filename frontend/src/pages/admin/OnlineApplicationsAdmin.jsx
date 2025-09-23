import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table"
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertCircle,
  RefreshCw,
  Settings,
  Calendar,
  Save
} from "lucide-react"
import { useGetOnlineApplicationsQuery, useUpdateApplicationStatusMutation } from "../../store/api/onlineApplicationApi"
import { useGetSchemesQuery } from "../../store/api/schemeApi"
import { useGetDisciplinesQuery } from "../../store/api/categoryApi"

const OnlineApplicationsAdmin = () => {
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    scheme: "all",
    discipline: "all"
  })
  const [applicationStatus, setApplicationStatus] = useState("open")
  const [lastDate, setLastDate] = useState("2024-12-31")
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [applicationSettings, setApplicationSettings] = useState(() => {
    // Load settings from localStorage or use defaults
    const savedSettings = localStorage.getItem('applicationSettings')
    if (savedSettings) {
      return JSON.parse(savedSettings)
    }
    return {
      isOpen: true,
      openDate: "2024-01-01",
      closeDate: "2024-12-31",
      autoClose: true,
      message: "Applications are currently being accepted for Call for Proposal 5.0"
    }
  })

  // Fetch applications from API
  const { 
    data: applicationsData, 
    isLoading, 
    error, 
    refetch 
  } = useGetOnlineApplicationsQuery(filters)
  
  const [updateApplicationStatus] = useUpdateApplicationStatusMutation()

  // Fetch schemes and disciplines for filters
  const { data: schemesData, isLoading: schemesLoading } = useGetSchemesQuery()
  const { data: disciplinesData, isLoading: disciplinesLoading } = useGetDisciplinesQuery()

  const applications = applicationsData?.applications || []
  const filteredApplications = applications // API handles filtering
  
  // Get schemes and disciplines from admin panel data
  const schemes = schemesData || []
  const disciplines = disciplinesData?.map(cat => cat.name) || []


  // Debug logging
  console.log("Applications data:", applicationsData)
  console.log("Applications:", applications)
  console.log("Loading:", isLoading)
  console.log("Error:", error)
  console.log("Schemes data:", schemesData)
  console.log("Disciplines data:", disciplinesData)
  console.log("Schemes:", schemes)
  console.log("Disciplines:", disciplines)

  // Filter applications based on current filters
  useEffect(() => {
    // The API handles filtering, so we just need to refetch when filters change
    refetch()
  }, [filters, refetch])

  // Check application status based on current date and settings
  useEffect(() => {
    const currentDate = new Date()
    const openDate = new Date(applicationSettings.openDate)
    const closeDate = new Date(applicationSettings.closeDate)
    
    if (applicationSettings.autoClose) {
      if (currentDate < openDate) {
        setApplicationStatus("coming_soon")
      } else if (currentDate > closeDate) {
        setApplicationStatus("closed")
      } else {
        setApplicationStatus("open")
      }
    } else {
      setApplicationStatus(applicationSettings.isOpen ? "open" : "closed")
    }
  }, [applicationSettings])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      console.log("=== Frontend Status Update ===")
      console.log("Application ID:", applicationId)
      console.log("New Status:", newStatus)
      
      const result = await updateApplicationStatus({
        id: applicationId,
        status: newStatus,
        comments: `Status changed to ${newStatus}`
      }).unwrap()
      
      console.log("Status update successful:", result)
      
      // Refetch applications to get updated data
      refetch()
      
      // Show success message
      alert(`Application status updated to ${newStatus} successfully!`)
    } catch (error) {
      console.error("Error updating application status:", error)
      console.error("Error details:", error.data || error.message)
      alert(`Failed to update application status: ${error.data?.message || error.message}`)
    }
  }

  const handleViewApplication = (application) => {
    setSelectedApplication(application)
    setShowApplicationModal(true)
  }

  const handleDownloadDocument = async (applicationId, documentType = 'supportingDocuments') => {
    try {
      console.log("=== Frontend Download Request ===")
      console.log("Application ID:", applicationId)
      console.log("Document Type:", documentType)
      
      const url = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/online-applications/${applicationId}/download/${documentType}`
      console.log("Download URL:", url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Add auth token if needed
        }
      })

      console.log("Response status:", response.status)
      console.log("Response headers:", response.headers)

      if (response.ok) {
        // Get the filename from the response headers or use a default
        const contentDisposition = response.headers.get('Content-Disposition')
        const filename = contentDisposition 
          ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
          : `document_${applicationId}.pdf`

        console.log("Downloading file:", filename)

        // Create a blob from the response
        const blob = await response.blob()
        console.log("Blob size:", blob.size)
        
        // Create a download link
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
        
        console.log("Download completed successfully")
      } else {
        const errorText = await response.text()
        console.error("Download failed:", response.status, errorText)
        throw new Error(`Failed to download document: ${response.status}`)
      }
    } catch (error) {
      console.error('Error downloading document:', error)
      alert('Failed to download document. Please try again.')
    }
  }

  const handleExportApplications = () => {
    // Export functionality
    const csvContent = [
      ["Name", "Email", "Organization", "Scheme", "Discipline", "Project Title", "Status", "Submitted Date"],
      ...filteredApplications.map(app => [
        app.applicantName,
        app.email,
        app.organization,
        app.scheme,
        app.discipline,
        app.projectTitle,
        app.status,
        new Date(app.submittedAt).toLocaleDateString()
      ])
    ].map(row => row.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "online_applications.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleToggleApplicationStatus = () => {
    const newSettings = {
      ...applicationSettings,
      isOpen: !applicationSettings.isOpen,
      autoClose: false // Disable auto-close when manually toggling
    }
    setApplicationSettings(newSettings)
    // Save to localStorage immediately
    localStorage.setItem('applicationSettings', JSON.stringify(newSettings))
  }

  const handleSettingsChange = (key, value) => {
    const newSettings = {
      ...applicationSettings,
      [key]: value
    }
    setApplicationSettings(newSettings)
    // Save to localStorage immediately
    localStorage.setItem('applicationSettings', JSON.stringify(newSettings))
  }

  const handleSaveSettings = () => {
    // Settings are already saved to localStorage in handleSettingsChange
    // Here you would also save to the database
    console.log("Saving application settings:", applicationSettings)
    setShowSettingsModal(false)
    
    // Show success message
    alert("Settings saved successfully!")
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Online Applications</h1>
            <p className="text-gray-600">Manage research proposal applications</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setShowSettingsModal(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Application Settings
            </Button>
            <Button
              onClick={handleToggleApplicationStatus}
              variant={applicationStatus === "open" ? "destructive" : "default"}
              className="flex items-center gap-2"
            >
              {applicationStatus === "open" ? (
                <>
                  <XCircle className="w-4 h-4" />
                  Close Applications
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Open Applications
                </>
              )}
            </Button>
            <Button
              onClick={handleExportApplications}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        </div>


        {/* Application Status */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getStatusIcon(applicationStatus)}
                <div>
                  <h3 className="text-lg font-semibold">
                    Application Status: {applicationStatus === "open" ? "Open" : applicationStatus === "closed" ? "Closed" : "Coming Soon"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {applicationStatus === "open" 
                      ? "Applications are currently being accepted"
                      : applicationStatus === "closed"
                      ? "Applications are currently closed"
                      : "Applications will open soon"
                    }
                  </p>
                  {applicationSettings.autoClose && (
                    <p className="text-xs text-blue-600 mt-1">
                      Auto-close enabled: {new Date(applicationSettings.closeDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="space-y-1">
                  <div>
                    <p className="text-sm text-gray-600">Open Date</p>
                    <p className="font-semibold">{new Date(applicationSettings.openDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Close Date</p>
                    <p className="font-semibold">{new Date(applicationSettings.closeDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Search</label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search applications..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Scheme</label>
                <Select value={filters.scheme} onValueChange={(value) => handleFilterChange("scheme", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={schemesLoading ? "Loading schemes..." : "All Schemes"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Schemes</SelectItem>
                    {schemesLoading ? (
                      <SelectItem value="loading" disabled>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 animate-spin" />
                          Loading schemes...
                        </div>
                      </SelectItem>
                    ) : schemes.length === 0 ? (
                      <SelectItem value="empty" disabled>
                        No schemes available
                      </SelectItem>
                    ) : (
                      schemes.map(scheme => (
                        <SelectItem key={scheme._id} value={scheme.name}>
                          {scheme.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Discipline</label>
                <Select value={filters.discipline} onValueChange={(value) => handleFilterChange("discipline", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={disciplinesLoading ? "Loading disciplines..." : "All Disciplines"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Disciplines</SelectItem>
                    {disciplinesLoading ? (
                      <SelectItem value="loading" disabled>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 animate-spin" />
                          Loading disciplines...
                        </div>
                      </SelectItem>
                    ) : disciplines.length === 0 ? (
                      <SelectItem value="empty" disabled>
                        No disciplines available
                      </SelectItem>
                    ) : (
                      disciplines.map(discipline => (
                        <SelectItem key={discipline} value={discipline}>
                          {discipline}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Applications ({filteredApplications.length})</span>
              <Button
                onClick={() => refetch()}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-[#0d559e]" />
                <span className="ml-2 text-gray-600">Loading applications...</span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <AlertCircle className="w-8 h-8 text-red-600" />
                <span className="ml-2 text-red-600">Error loading applications: {error.message}</span>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Project Title</TableHead>
                    <TableHead>Scheme</TableHead>
                    <TableHead>Discipline</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((application) => (
                    <TableRow key={application._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{application.applicantName}</div>
                          <div className="text-sm text-gray-500">{application.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{application.organization}</div>
                          <div className="text-sm text-gray-500">{application.designation}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={application.projectTitle}>
                          {application.projectTitle}
                        </div>
                      </TableCell>
                      <TableCell>{application.scheme}</TableCell>
                      <TableCell>{application.discipline}</TableCell>
                      <TableCell>₹{application.budget.toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(application.status)}</TableCell>
                      <TableCell>
                        {new Date(application.submittedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleViewApplication(application)}
                            variant="outline"
                            size="sm"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {application.status === "pending" && (
                            <>
                              <Button
                                onClick={() => handleStatusChange(application._id, "approved")}
                                variant="outline"
                                size="sm"
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() => handleStatusChange(application._id, "rejected")}
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Application Detail Modal */}
        {showApplicationModal && selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Application Details</CardTitle>
                  <Button
                    onClick={() => setShowApplicationModal(false)}
                    variant="outline"
                    size="sm"
                  >
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Name</label>
                      <p className="text-gray-900">{selectedApplication.applicantName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900">{selectedApplication.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-gray-900">{selectedApplication.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Organization</label>
                      <p className="text-gray-900">{selectedApplication.organization}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Designation</label>
                      <p className="text-gray-900">{selectedApplication.designation}</p>
                    </div>
                  </div>
                </div>

                {/* Project Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Project Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Project Title</label>
                      <p className="text-gray-900">{selectedApplication.projectTitle}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Description</label>
                      <p className="text-gray-900">{selectedApplication.projectDescription}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Scheme</label>
                        <p className="text-gray-900">{selectedApplication.scheme}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Discipline</label>
                        <p className="text-gray-900">{selectedApplication.discipline}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Duration</label>
                        <p className="text-gray-900">{selectedApplication.duration} months</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Budget</label>
                      <p className="text-gray-900">₹{selectedApplication.budget.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Co-Investigators</label>
                      <p className="text-gray-900">{selectedApplication.coInvestigators || "None"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Expected Outcomes</label>
                      <p className="text-gray-900">{selectedApplication.expectedOutcomes}</p>
                    </div>
                  </div>
                </div>

                {/* Supporting Documents */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Supporting Documents</h3>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-900">{selectedApplication.supportingDocuments}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadDocument(selectedApplication._id, 'supportingDocuments')}
                      disabled={!selectedApplication.supportingDocuments}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-4 border-t">
                  <Button
                    onClick={() => handleStatusChange(selectedApplication._id, "approved")}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={selectedApplication.status === "approved"}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleStatusChange(selectedApplication._id, "rejected")}
                    variant="destructive"
                    disabled={selectedApplication.status === "rejected"}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Application Settings Modal */}
        {showSettingsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Application Settings
                  </CardTitle>
                  <Button
                    onClick={() => setShowSettingsModal(false)}
                    variant="outline"
                    size="sm"
                  >
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Settings */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Basic Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isOpen"
                        checked={applicationSettings.isOpen}
                        onChange={(e) => handleSettingsChange("isOpen", e.target.checked)}
                        className="w-4 h-4"
                      />
                      <label htmlFor="isOpen" className="text-sm font-medium">
                        Applications are currently open
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="autoClose"
                        checked={applicationSettings.autoClose}
                        onChange={(e) => handleSettingsChange("autoClose", e.target.checked)}
                        className="w-4 h-4"
                      />
                      <label htmlFor="autoClose" className="text-sm font-medium">
                        Automatically close applications based on dates
                      </label>
                    </div>
                  </div>
                </div>

                {/* Date Settings */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Date Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Open Date</label>
                      <Input
                        type="date"
                        value={applicationSettings.openDate}
                        onChange={(e) => handleSettingsChange("openDate", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Close Date</label>
                      <Input
                        type="date"
                        value={applicationSettings.closeDate}
                        onChange={(e) => handleSettingsChange("closeDate", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Message Settings */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Public Message</h3>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status Message</label>
                    <textarea
                      value={applicationSettings.message}
                      onChange={(e) => handleSettingsChange("message", e.target.value)}
                      rows={3}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter a message to display to applicants..."
                    />
                  </div>
                </div>

                {/* Current Status Preview */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Status Preview</h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(applicationStatus)}
                      <span className="font-medium">
                        {applicationStatus === "open" ? "Open" : applicationStatus === "closed" ? "Closed" : "Coming Soon"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{applicationSettings.message}</p>
                    {applicationSettings.autoClose && (
                      <p className="text-xs text-blue-600 mt-2">
                        Auto-close: {new Date(applicationSettings.closeDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 pt-4 border-t">
                  <Button
                    onClick={handleSaveSettings}
                    className="bg-[#0d559e] hover:bg-[#004d8c] flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Settings
                  </Button>
                  <Button
                    onClick={() => setShowSettingsModal(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
    </div>
  )
}

export default OnlineApplicationsAdmin
