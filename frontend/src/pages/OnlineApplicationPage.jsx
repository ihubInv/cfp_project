import React, { useState, useEffect } from "react"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Badge } from "../components/ui/badge"
import { 
  FileText, 
  User, 
  Mail, 
  Phone, 
  Building, 
  Calendar,
  Upload,
  CheckCircle,
  AlertCircle,
  Clock,
  Send,
  Download
} from "lucide-react"
import { useGetSchemesQuery } from "../store/api/schemeApi"
import { useGetDisciplinesQuery } from "../store/api/categoryApi"

const OnlineApplicationPage = () => {
  const [formData, setFormData] = useState({
    applicantName: "",
    email: "",
    phone: "",
    organization: "",
    designation: "",
    scheme: "",
    discipline: "",
    projectTitle: "",
    projectDescription: "",
    duration: "",
    budget: "",
    coInvestigators: "",
    expectedOutcomes: "",
    supportingDocuments: null
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [applicationStatus, setApplicationStatus] = useState("open") // open, closed, coming_soon
  const [applicationSettings, setApplicationSettings] = useState(null)

  // Fetch schemes and disciplines
  const { data: schemesData, isLoading: schemesLoading, error: schemesError } = useGetSchemesQuery()
  const { data: disciplinesData, isLoading: disciplinesLoading, error: disciplinesError } = useGetDisciplinesQuery()

  // Backend returns arrays directly, not wrapped in objects
  const schemes = schemesData || []
  const disciplines = disciplinesData?.map(cat => cat.name) || []


  // Load application settings and check status
  useEffect(() => {
    const loadSettings = () => {
      const savedSettings = localStorage.getItem('applicationSettings')
      if (savedSettings) {
        const settings = JSON.parse(savedSettings)
        setApplicationSettings(settings)
        
        // Determine status based on settings
        const currentDate = new Date()
        const openDate = new Date(settings.openDate)
        const closeDate = new Date(settings.closeDate)
        
        if (settings.autoClose) {
          if (currentDate < openDate) {
            setApplicationStatus("coming_soon")
          } else if (currentDate > closeDate) {
            setApplicationStatus("closed")
          } else {
            setApplicationStatus(settings.isOpen ? "open" : "closed")
          }
        } else {
          setApplicationStatus(settings.isOpen ? "open" : "closed")
        }
      } else {
        // Use default settings if none saved
        const defaultSettings = {
          isOpen: true,
          openDate: "2024-01-01",
          closeDate: "2024-12-31",
          autoClose: true,
          message: "Applications are currently being accepted for Call for Proposal 5.0"
        }
        setApplicationSettings(defaultSettings)
        setApplicationStatus("open")
      }
    }

    loadSettings()

    // Listen for storage changes (when admin updates settings)
    const handleStorageChange = (e) => {
      if (e.key === 'applicationSettings') {
        loadSettings()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Also check for changes periodically (for same-tab updates)
    const interval = setInterval(loadSettings, 1000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setFormData(prev => ({
      ...prev,
      supportingDocuments: file
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Create FormData for file upload
      const submitData = new FormData()
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          submitData.append(key, formData[key])
        }
      })

      // Submit to API
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/online-applications`, {
        method: 'POST',
        body: submitData
      })

      if (response.ok) {
        setSubmitSuccess(true)
        // Reset form
        setFormData({
          applicantName: "",
          email: "",
          phone: "",
          organization: "",
          designation: "",
          scheme: "",
          discipline: "",
          projectTitle: "",
          projectDescription: "",
          duration: "",
          budget: "",
          coInvestigators: "",
          expectedOutcomes: "",
          supportingDocuments: null
        })
      } else {
        throw new Error('Submission failed')
      }
    } catch (error) {
      console.error('Error submitting application:', error)
      alert('Failed to submit application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusBadge = () => {
    switch (applicationStatus) {
      case "open":
        return <Badge className="bg-green-100 text-green-800">Open for Applications</Badge>
      case "closed":
        return <Badge className="bg-red-100 text-red-800">Applications Closed</Badge>
      case "coming_soon":
        return <Badge className="bg-yellow-100 text-yellow-800">Coming Soon</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Status Unknown</Badge>
    }
  }

  const getStatusIcon = () => {
    switch (applicationStatus) {
      case "open":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "closed":
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case "coming_soon":
        return <Clock className="w-5 h-5 text-yellow-600" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0d559e] to-[#004d8c] py-16 pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Online Application Portal
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-6">
              {applicationSettings?.message || "Submit your research proposals for funding through IIT Mandi iHub & HCi Foundation"}
            </p>
            <div className="flex items-center justify-center gap-4">
              {getStatusIcon()}
              {getStatusBadge()}
            </div>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {submitSuccess ? (
            <Card className="text-center">
              <CardContent className="pt-8 pb-8">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted Successfully!</h2>
                <p className="text-gray-600 mb-6">
                  Your application has been received and is under review. You will receive a confirmation email shortly.
                </p>
                <Button 
                  onClick={() => setSubmitSuccess(false)}
                  className="bg-[#0d559e] hover:bg-[#004d8c]"
                >
                  Submit Another Application
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-[#0d559e]" />
                  Research Proposal Application Form
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Please fill out all required fields. Applications will be reviewed by our expert panel.
                </p>
              </CardHeader>
              <CardContent>
                {applicationStatus === "closed" ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Applications are Currently Closed</h3>
                    <p className="text-gray-600">
                      {applicationSettings?.message || "The application deadline has passed. Please check back for future opportunities."}
                    </p>
                    {applicationSettings?.autoClose && (
                      <p className="text-sm text-gray-500 mt-2">
                        Applications closed automatically on {new Date(applicationSettings.closeDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ) : applicationStatus === "coming_soon" ? (
                  <div className="text-center py-8">
                    <Clock className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Applications Coming Soon</h3>
                    <p className="text-gray-600">
                      {applicationSettings?.message || "Applications will open soon. Please check back later."}
                    </p>
                    {applicationSettings?.openDate && (
                      <p className="text-sm text-gray-500 mt-2">
                        Applications will open on {new Date(applicationSettings.openDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="applicantName">Full Name *</Label>
                          <Input
                            id="applicantName"
                            value={formData.applicantName}
                            onChange={(e) => handleInputChange("applicantName", e.target.value)}
                            required
                            placeholder="Enter your full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            required
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            required
                            placeholder="Enter your phone number"
                          />
                        </div>
                        <div>
                          <Label htmlFor="organization">Organization/Institution *</Label>
                          <Input
                            id="organization"
                            value={formData.organization}
                            onChange={(e) => handleInputChange("organization", e.target.value)}
                            required
                            placeholder="Enter your organization"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="designation">Designation/Position *</Label>
                        <Input
                          id="designation"
                          value={formData.designation}
                          onChange={(e) => handleInputChange("designation", e.target.value)}
                          required
                          placeholder="Enter your designation"
                        />
                      </div>
                    </div>

                    {/* Project Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Project Information</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="scheme">Scheme *</Label>
                          <Select value={formData.scheme} onValueChange={(value) => handleInputChange("scheme", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder={schemesLoading ? "Loading schemes..." : "Select Scheme"} />
                            </SelectTrigger>
                            <SelectContent>
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
                          <Label htmlFor="discipline">Discipline *</Label>
                          <Select value={formData.discipline} onValueChange={(value) => handleInputChange("discipline", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder={disciplinesLoading ? "Loading disciplines..." : "Select Discipline"} />
                            </SelectTrigger>
                            <SelectContent>
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

                      <div>
                        <Label htmlFor="projectTitle">Project Title *</Label>
                        <Input
                          id="projectTitle"
                          value={formData.projectTitle}
                          onChange={(e) => handleInputChange("projectTitle", e.target.value)}
                          required
                          placeholder="Enter your project title"
                        />
                      </div>

                      <div>
                        <Label htmlFor="projectDescription">Project Description *</Label>
                        <Textarea
                          id="projectDescription"
                          rows={4}
                          value={formData.projectDescription}
                          onChange={(e) => handleInputChange("projectDescription", e.target.value)}
                          required
                          placeholder="Describe your research project in detail"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="duration">Project Duration (months) *</Label>
                          <Input
                            id="duration"
                            type="number"
                            value={formData.duration}
                            onChange={(e) => handleInputChange("duration", e.target.value)}
                            required
                            placeholder="e.g., 24"
                          />
                        </div>
                        <div>
                          <Label htmlFor="budget">Requested Budget (₹) *</Label>
                          <Input
                            id="budget"
                            type="number"
                            value={formData.budget}
                            onChange={(e) => handleInputChange("budget", e.target.value)}
                            required
                            placeholder="e.g., 500000"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="coInvestigators">Co-Investigators</Label>
                        <Textarea
                          id="coInvestigators"
                          rows={2}
                          value={formData.coInvestigators}
                          onChange={(e) => handleInputChange("coInvestigators", e.target.value)}
                          placeholder="List co-investigators and their affiliations"
                        />
                      </div>

                      <div>
                        <Label htmlFor="expectedOutcomes">Expected Outcomes *</Label>
                        <Textarea
                          id="expectedOutcomes"
                          rows={3}
                          value={formData.expectedOutcomes}
                          onChange={(e) => handleInputChange("expectedOutcomes", e.target.value)}
                          required
                          placeholder="Describe the expected outcomes and impact of your research"
                        />
                      </div>
                    </div>

                    {/* Supporting Documents */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Supporting Documents</h3>
                      
                      <div>
                        <Label htmlFor="supportingDocuments">Upload Supporting Documents</Label>
                        <div className="mt-2">
                          <Input
                            id="supportingDocuments"
                            type="file"
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx"
                            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#0d559e] file:text-white hover:file:bg-[#004d8c]"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Upload PDF, DOC, or DOCX files (Max 10MB)
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6 border-t">
                      <Button
                        type="submit"
                        disabled={isSubmitting || applicationStatus !== "open"}
                        className="w-full bg-[#0d559e] hover:bg-[#004d8c] text-white py-3"
                      >
                        {isSubmitting ? (
                          <>
                            <Clock className="w-4 h-4 mr-2 animate-spin" />
                            Submitting Application...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Submit Application
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Information Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Guidelines</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Important information for applicants
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="w-12 h-12 text-[#0d559e] mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Application Deadline</h3>
                <p className="text-gray-600">
                  Applications must be submitted by December 31, 2024. Late submissions will not be accepted.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <FileText className="w-12 h-12 text-[#0d559e] mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Review Process</h3>
                <p className="text-gray-600">
                  All applications undergo a rigorous peer review process by our expert panel.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-12 h-12 text-[#0d559e] mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Notification</h3>
                <p className="text-gray-600">
                  Applicants will be notified of the decision within 60 days of the deadline.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default OnlineApplicationPage
