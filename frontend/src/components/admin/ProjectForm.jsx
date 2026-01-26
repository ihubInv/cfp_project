"use client"

import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { X, Plus, Save, FileText, User, Building, Wrench, Users, BookOpen, DollarSign, Upload, Download, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { useGetDisciplinesQuery } from "../../store/api/categoryApi"
import { useGetSchemesQuery } from "../../store/api/schemeApi"
import { useGetAllManpowerTypesQuery } from "../../store/api/manpowerTypeApi"
import FileUpload from "../ui/file-upload"
import { useUploadPatentDocumentsMutation, useDeletePatentDocumentMutation, useDownloadPatentDocumentMutation } from "../../store/api/fileApi"

const ProjectForm = ({ project, onSubmit, onCancel, isLoading = false, onProjectUpdate }) => {
  // Fetch disciplines, schemes, and manpower types from the management system
  const { data: disciplines } = useGetDisciplinesQuery()
  const { data: schemes } = useGetSchemesQuery()
  const { data: manpowerTypesData } = useGetAllManpowerTypesQuery({ isActive: true })
  
  const [formData, setFormData] = useState({
    // Basic Project Fields
    title: "",
    fileNumber: "",
    discipline: "",
    scheme: "",
    projectSummary: "",
    status: "Ongoing", // Add Status field
    
    // Multiple Principal Investigators
    principalInvestigators: [{
      name: "",
      designation: "",
      email: "",
      instituteName: "",
      department: "",
      instituteAddress: "",
      affiliationType: "Institute",
    }],
    
    // Multiple Co-Principal Investigators
    coPrincipalInvestigators: [],
    
    // Equipment Sanctioned
    equipmentSanctioned: [],
    
    // Manpower Sanctioned
    manpowerSanctioned: [],
    
    // Publications
    publications: [],
    
    // Budget Information
    budget: {
      sanctionYear: new Date().getFullYear(),
      date: "",
      totalAmount: "",
    },
    
    // Patent Details (legacy - kept for backward compatibility)
    patentDetail: "",
    patentDocuments: [], // Legacy - kept for backward compatibility
    
    // Patents - Array of patent entries
    patents: [], // Array of { patentDetail: string, patentDocument: File }
  })
  
  // State for existing patent documents (legacy)
  const [existingPatentDocuments, setExistingPatentDocuments] = useState([])
  
  // File upload mutations
  const [uploadPatentDocuments, { isLoading: isUploadingPatents }] = useUploadPatentDocumentsMutation()
  const [deletePatentDocument, { isLoading: isDeletingPatent }] = useDeletePatentDocumentMutation()
  const [downloadPatentDocument] = useDownloadPatentDocumentMutation()

  // Initialize form data when project prop changes
  useEffect(() => {
    if (project) {
      // Ensure discipline and scheme values are strings and trimmed
      // Also check if the value exists in the available options to prevent reset
      const disciplineValue = project.discipline ? String(project.discipline).trim() : ""
      const schemeValue = project.scheme ? String(project.scheme).trim() : ""
      
      // Verify the discipline value exists in the available disciplines
      const validDiscipline = disciplines && disciplines.length > 0 && disciplineValue
        ? disciplines.find(d => d.name === disciplineValue || d.name.trim() === disciplineValue)
          ? disciplineValue
          : disciplineValue // Keep the value even if not found (might be loading)
        : disciplineValue
      
      // Verify the scheme value exists in the available schemes
      const validScheme = schemes && schemes.length > 0 && schemeValue
        ? schemes.find(s => s.name === schemeValue || s.name.trim() === schemeValue)
          ? schemeValue
          : schemeValue // Keep the value even if not found (might be loading)
        : schemeValue
      
      setFormData(prev => ({
        ...prev,
        title: project.title || "",
        fileNumber: project.fileNumber || "",
        discipline: validDiscipline,
        scheme: validScheme,
        projectSummary: project.projectSummary || "",
        status: project.validationStatus || "Ongoing", // Add status field
        principalInvestigators: project.principalInvestigators || [{
          name: project.pi?.name || "",
          designation: project.pi?.designation || "",
          email: project.pi?.email || "",
          instituteName: project.pi?.instituteName || "",
          department: project.pi?.department || "",
          instituteAddress: project.pi?.instituteAddress || "",
          affiliationType: project.pi?.affiliationType || "Institute",
        }],
        coPrincipalInvestigators: (project.coPrincipalInvestigators && project.coPrincipalInvestigators.length > 0)
          ? project.coPrincipalInvestigators.map(coPI => ({
              name: coPI.name || "",
              designation: coPI.designation || "",
              email: coPI.email || "",
              instituteName: coPI.instituteName || "",
              department: coPI.department || "",
              instituteAddress: coPI.instituteAddress || "",
              affiliationType: coPI.affiliationType || "Institute", // Ensure affiliationType is always set
            }))
          : (project.coPI ? [{
              name: project.coPI.name || "",
              designation: project.coPI.designation || "",
              email: project.coPI.email || "",
              instituteName: project.coPI.instituteName || "",
              department: project.coPI.department || "",
              instituteAddress: project.coPI.instituteAddress || "",
              affiliationType: project.coPI.affiliationType || "Institute",
            }] : []),
        equipmentSanctioned: project.equipmentSanctioned || [],
        manpowerSanctioned: project.manpowerSanctioned || [],
        publications: project.publications || [],
        budget: {
          sanctionYear: project.budget?.sanctionYear || new Date().getFullYear(),
          date: project.budget?.date ? new Date(project.budget.date).toISOString().split('T')[0] : "",
          totalAmount: project.budget?.totalAmount || "",
        },
        patentDetail: project.patentDetail || "",
        patentDocuments: [], // Legacy - kept for backward compatibility
        patents: project.patents && project.patents.length > 0 
          ? project.patents.map(p => ({
              patentDetail: p.patentDetail || "",
              patentDocument: null, // Files will be handled separately - existing docs shown via project.patents[index].patentDocument
            }))
          : [],
      }))
      
      // Set existing patent documents (legacy)
      if (project.patentDocuments && project.patentDocuments.length > 0) {
        setExistingPatentDocuments(project.patentDocuments)
      } else {
        setExistingPatentDocuments([])
      }
    } else {
      // Reset when no project (creating new)
      setExistingPatentDocuments([])
    }
  }, [project, disciplines, schemes]) // Include disciplines and schemes to update when they load

  const handleInputChange = (field, value, index = null) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handlePIChange = (field, value, index) => {
    setFormData(prev => ({
      ...prev,
      principalInvestigators: prev.principalInvestigators.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const handleCoPIChange = (field, value, index) => {
    setFormData(prev => ({
      ...prev,
      coPrincipalInvestigators: prev.coPrincipalInvestigators.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const handleArrayAdd = (arrayName, newItem) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], newItem]
    }))
  }

  const handleArrayRemove = (arrayName, index) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
    }))
  }

  const addPrincipalInvestigator = () => {
    const newPI = {
      name: "",
      designation: "",
      email: "",
      instituteName: "",
      department: "",
      instituteAddress: "",
      affiliationType: "Institute",
    }
    handleArrayAdd('principalInvestigators', newPI)
  }

  const addCoPrincipalInvestigator = () => {
    const newCoPI = {
      name: "",
      designation: "",
      email: "",
      instituteName: "",
      department: "",
      instituteAddress: "",
      affiliationType: "Institute",
    }
    handleArrayAdd('coPrincipalInvestigators', newCoPI)
  }

  // Function to add custom manpower type
  const addCustomManpowerType = () => {
    if (customManpowerType.trim()) {
      const updatedManpowerTypes = [...manpowerTypes, customManpowerType.trim()]
      // Update the manpowerTypes array (this would ideally be managed globally)
      setCustomManpowerType("")
      setShowCustomManpowerInput(false)
      // For now, we'll handle this in the UI
    }
  }

  // Function to handle manpower type selection
  const handleManpowerTypeChange = (value, index) => {
    if (value === "Other") {
      setShowCustomManpowerInput(true)
    } else {
      setShowCustomManpowerInput(false)
      const newManpower = [...formData.manpowerSanctioned]
      newManpower[index] = { ...newManpower[index], manpowerType: value }
      setFormData(prev => ({ ...prev, manpowerSanctioned: newManpower }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Frontend validation - only validate format, not required fields
    const errors = []
    
    // Email format validation (if provided)
    if (formData.principalInvestigators && formData.principalInvestigators.length > 0) {
      formData.principalInvestigators.forEach((pi, index) => {
        if (pi.email && pi.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pi.email)) {
          errors.push(`PI ${index + 1}: Invalid email format`)
        }
      })
    }
    
    // Co-PI email format validation (if provided)
    if (formData.coPrincipalInvestigators && formData.coPrincipalInvestigators.length > 0) {
      formData.coPrincipalInvestigators.forEach((coPI, index) => {
        if (coPI.email && coPI.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(coPI.email)) {
          errors.push(`Co-PI ${index + 1}: Invalid email format`)
        }
      })
    }
    
    // Budget amount validation (if provided, must be positive)
    if (formData.budget.totalAmount && formData.budget.totalAmount <= 0) {
      errors.push("Budget total amount must be greater than 0 if provided")
    }
    
    if (errors.length > 0) {
      alert("Please fix the following errors:\n\n" + errors.join("\n"))
      return
    }
    
    // Convert string values to appropriate types
    const submitData = {
      ...formData,
      validationStatus: formData.status, // Map status to validationStatus for backend
      budget: {
        ...formData.budget,
        sanctionYear: parseInt(formData.budget.sanctionYear),
        totalAmount: parseFloat(formData.budget.totalAmount) || 0,
        date: formData.budget.date ? new Date(formData.budget.date) : new Date(),
      },
      principalInvestigators: formData.principalInvestigators.map(pi => ({
        name: pi.name || "",
        designation: pi.designation || "",
        email: pi.email || "",
        instituteName: pi.instituteName || "",
        department: pi.department || "",
        instituteAddress: pi.instituteAddress || "",
        affiliationType: pi.affiliationType || "Institute", // Ensure affiliationType is set
      })),
      coPrincipalInvestigators: formData.coPrincipalInvestigators.map(coPI => ({
        name: coPI.name || "",
        designation: coPI.designation || "",
        email: coPI.email || "",
        instituteName: coPI.instituteName || "",
        department: coPI.department || "",
        instituteAddress: coPI.instituteAddress || "",
        affiliationType: coPI.affiliationType || "Institute", // Ensure affiliationType is set
      })),
      equipmentSanctioned: formData.equipmentSanctioned.map(item => ({
        ...item,
        priceInr: parseFloat(item.priceInr) || 0,
      })),
      manpowerSanctioned: formData.manpowerSanctioned.map(item => ({
        ...item,
        number: parseInt(item.number) || 0,
      })),
    }
    
    // Remove the status field from submitData as it's mapped to validationStatus
    delete submitData.status
    
    // Handle patents - separate files from data
    const patentsData = submitData.patents || []
    const patentsWithFiles = patentsData.map((patent, index) => ({
      patentDetail: patent.patentDetail || "",
      patentDocument: patent.patentDocument || null, // File object
    }))
    
    // Remove patentDocuments and patents from submitData - we'll handle separately
    const filesToUpload = submitData.patentDocuments || [] // Legacy
    delete submitData.patentDocuments
    delete submitData.patents
    
    // Debug: Log Co-PI data specifically
    if (submitData.coPrincipalInvestigators) {
      console.log("Co-PI array being submitted:", JSON.stringify(submitData.coPrincipalInvestigators, null, 2))
      submitData.coPrincipalInvestigators.forEach((coPI, index) => {
        console.log(`Co-PI ${index + 1} being submitted:`, {
          name: coPI.name,
          affiliationType: coPI.affiliationType,
          instituteName: coPI.instituteName
        })
      })
    }
    
    console.log("Submitting project data:", submitData)
    console.log("Patents with files:", patentsWithFiles.length)
    console.log("Legacy patent documents to upload:", filesToUpload.length)
    
    // Submit project data with patents (without file objects - files will be uploaded separately)
    submitData.patents = patentsData.map(p => ({ patentDetail: p.patentDetail || "" })) // Remove file objects
    onSubmit(submitData, filesToUpload, patentsWithFiles)
  }

  // New item states for dynamic arrays
  const [newEquipment, setNewEquipment] = useState({
    genericName: "",
    make: "",
    model: "",
    priceInr: "",
    invoiceUpload: "",
  })

  const [newManpower, setNewManpower] = useState({
    manpowerType: "",
    number: "",
  })

  const [newPublication, setNewPublication] = useState({
    name: "",
    publicationDetail: "",
    status: "",
    link: "",
  })
  
  const publicationStatuses = [
    "Published",
    "Submitted",
    "Under Review",
    "In Preparation",
    "Other"
  ]

  // State for custom manpower types
  const [customManpowerType, setCustomManpowerType] = useState("")
  const [showCustomManpowerInput, setShowCustomManpowerInput] = useState(false)

  // Get manpower types from API or use fallback
  const manpowerTypes = manpowerTypesData?.data?.map(type => type.name) || [
    "Research Associate",
    "Junior Research Fellow", 
    "Senior Research Fellow",
    "Project Assistant",
    "Technical Assistant",
    "Other"
  ]

  const projectStatuses = [
    "Completed",
    "Ongoing"
  ]


  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Project Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Basic Project Information
          </CardTitle>
          <CardDescription>
            Enter the basic details of the project
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter project title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fileNumber">File Number</Label>
              <Input
                id="fileNumber"
                value={formData.fileNumber}
                onChange={(e) => handleInputChange("fileNumber", e.target.value)}
                placeholder="Enter file number (auto-generated if empty)"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="discipline">Select Discipline</Label>
            <Select 
              value={formData.discipline || ""} 
              onValueChange={(value) => handleInputChange("discipline", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select discipline" />
              </SelectTrigger>
              <SelectContent>
                {disciplines?.map((discipline) => (
                  <SelectItem key={discipline._id} value={discipline.name}>
                    {discipline.name}
                  </SelectItem>
                )) || []}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scheme">Select Scheme</Label>
            <Select 
              value={formData.scheme || ""} 
              onValueChange={(value) => handleInputChange("scheme", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select scheme" />
              </SelectTrigger>
              <SelectContent>
                {schemes?.map((scheme) => (
                  <SelectItem key={scheme._id} value={scheme.name}>
                    {scheme.name}
                  </SelectItem>
                )) || []}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Project Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select project status" />
              </SelectTrigger>
              <SelectContent>
                {projectStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectSummary">Project Summary</Label>
            <Textarea
              id="projectSummary"
              value={formData.projectSummary}
              onChange={(e) => handleInputChange("projectSummary", e.target.value)}
              placeholder="Enter project summary (can be added later)"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Principal Investigators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Principal Investigators (PIs)
            </div>
            <Button
              type="button"
              onClick={addPrincipalInvestigator}
              size="sm"
              className="bg-[#0d559e] text-white hover:bg-[#0d559e]/90 border-0"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add PI
            </Button>
          </CardTitle>
          <CardDescription>
            Add one or more principal investigators for this project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Name</TableHead>
                  <TableHead className="w-[150px]">Designation</TableHead>
                  <TableHead className="w-[200px]">Email</TableHead>
                  <TableHead className="w-[130px]">Affiliation</TableHead>
                  <TableHead className="w-[180px]">Institute/Industry Name</TableHead>
                  <TableHead className="w-[150px]">Department</TableHead>
                  <TableHead className="w-[200px]">Address</TableHead>
                  <TableHead className="w-[80px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
          {formData.principalInvestigators.map((pi, index) => (
                  <TableRow key={index}>
                    <TableCell>
                  <Input
                        value={pi.name || ""}
                    onChange={(e) => handlePIChange("name", e.target.value, index)}
                        placeholder="Enter name"
                        className="w-full"
                  />
                    </TableCell>
                    <TableCell>
                  <Input
                        value={pi.designation || ""}
                    onChange={(e) => handlePIChange("designation", e.target.value, index)}
                    placeholder="Enter designation"
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                <Input
                  type="email"
                        value={pi.email || ""}
                  onChange={(e) => handlePIChange("email", e.target.value, index)}
                        placeholder="Enter email"
                        className="w-full"
                />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={pi.affiliationType || "Institute"}
                        onValueChange={(value) => handlePIChange("affiliationType", value, index)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Institute">Institute</SelectItem>
                          <SelectItem value="Industry">Industry</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                  <Input
                        value={pi.instituteName || ""}
                    onChange={(e) => handlePIChange("instituteName", e.target.value, index)}
                        placeholder={pi.affiliationType === "Industry" ? "Enter industry name" : "Enter institute name"}
                        className="w-full"
                  />
                    </TableCell>
                    <TableCell>
                  <Input
                        value={pi.department || ""}
                    onChange={(e) => handlePIChange("department", e.target.value, index)}
                    placeholder="Enter department"
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={pi.instituteAddress || ""}
                  onChange={(e) => handlePIChange("instituteAddress", e.target.value, index)}
                        placeholder="Enter address"
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      {formData.principalInvestigators.length > 1 ? (
                        <Button
                          type="button"
                          onClick={() => handleArrayRemove('principalInvestigators', index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      ) : (
                        <span className="text-gray-400 text-xs">Required</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
        </CardContent>
      </Card>

      {/* Co-Principal Investigators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Co-Principal Investigators (Co-PIs)
            </div>
            <Button
              type="button"
              onClick={addCoPrincipalInvestigator}
              size="sm"
              className="bg-[#0d559e] text-white hover:bg-[#0d559e]/90 border-0"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Co-PI
            </Button>
          </CardTitle>
          <CardDescription>
            Optional co-principal investigators for this project
          </CardDescription>
        </CardHeader>
        <CardContent>
          {formData.coPrincipalInvestigators.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No co-principal investigators added yet.</p>
              <p className="text-sm">Click "Add Co-PI" to add one or more co-principal investigators.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Name</TableHead>
                    <TableHead className="w-[150px]">Designation</TableHead>
                    <TableHead className="w-[200px]">Email</TableHead>
                    <TableHead className="w-[130px]">Affiliation</TableHead>
                    <TableHead className="w-[180px]">Institute/Industry Name</TableHead>
                    <TableHead className="w-[150px]">Department</TableHead>
                    <TableHead className="w-[200px]">Address</TableHead>
                    <TableHead className="w-[80px]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formData.coPrincipalInvestigators.map((coPI, index) => (
                    <TableRow key={index}>
                      <TableCell>
                    <Input
                          value={coPI.name || ""}
                      onChange={(e) => handleCoPIChange("name", e.target.value, index)}
                          placeholder="Enter name"
                          className="w-full"
                    />
                      </TableCell>
                      <TableCell>
                    <Input
                          value={coPI.designation || ""}
                      onChange={(e) => handleCoPIChange("designation", e.target.value, index)}
                      placeholder="Enter designation"
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                  <Input
                    type="email"
                          value={coPI.email || ""}
                    onChange={(e) => handleCoPIChange("email", e.target.value, index)}
                          placeholder="Enter email"
                          className="w-full"
                  />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={coPI.affiliationType || "Institute"}
                          onValueChange={(value) => handleCoPIChange("affiliationType", value, index)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Institute">Institute</SelectItem>
                            <SelectItem value="Industry">Industry</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                    <Input
                          value={coPI.instituteName || ""}
                      onChange={(e) => handleCoPIChange("instituteName", e.target.value, index)}
                          placeholder={coPI.affiliationType === "Industry" ? "Enter industry name" : "Enter institute name"}
                          className="w-full"
                    />
                      </TableCell>
                      <TableCell>
                    <Input
                          value={coPI.department || ""}
                      onChange={(e) => handleCoPIChange("department", e.target.value, index)}
                      placeholder="Enter department"
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={coPI.instituteAddress || ""}
                    onChange={(e) => handleCoPIChange("instituteAddress", e.target.value, index)}
                          placeholder="Enter address"
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          onClick={() => handleArrayRemove('coPrincipalInvestigators', index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
                </div>
          )}
        </CardContent>
      </Card>

      {/* Equipment Sanctioned */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
            <Wrench className="h-5 w-5 mr-2" />
            Equipment Sanctioned
            </div>
                <Button
                  type="button"
                  size="sm"
              onClick={() => handleArrayAdd("equipmentSanctioned", { ...newEquipment })}
              className="bg-[#0d559e] text-white hover:bg-[#0d559e]/90 border-0"
                >
              <Plus className="h-4 w-4 mr-1" />
              Add Equipment
                </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {formData.equipmentSanctioned.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Wrench className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No equipment added yet.</p>
              <p className="text-sm">Click "Add Equipment" to add equipment items.</p>
              </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Generic Name</TableHead>
                    <TableHead className="w-[150px]">Make</TableHead>
                    <TableHead className="w-[150px]">Model</TableHead>
                    <TableHead className="w-[150px]">Price (INR)</TableHead>
                    <TableHead className="w-[200px]">Invoice Upload</TableHead>
                    <TableHead className="w-[80px]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formData.equipmentSanctioned.map((equipment, index) => (
                    <TableRow key={index}>
                      <TableCell>
                  <Input
                          value={equipment.genericName || ""}
                    onChange={(e) => {
                      const newEquipment = [...formData.equipmentSanctioned]
                      newEquipment[index] = { ...equipment, genericName: e.target.value }
                      setFormData(prev => ({ ...prev, equipmentSanctioned: newEquipment }))
                    }}
                    placeholder="Enter generic name"
                          className="w-full"
                  />
                      </TableCell>
                      <TableCell>
                  <Input
                          value={equipment.make || ""}
                    onChange={(e) => {
                      const newEquipment = [...formData.equipmentSanctioned]
                      newEquipment[index] = { ...equipment, make: e.target.value }
                      setFormData(prev => ({ ...prev, equipmentSanctioned: newEquipment }))
                    }}
                    placeholder="Enter make"
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                  <Input
                          value={equipment.model || ""}
                    onChange={(e) => {
                      const newEquipment = [...formData.equipmentSanctioned]
                      newEquipment[index] = { ...equipment, model: e.target.value }
                      setFormData(prev => ({ ...prev, equipmentSanctioned: newEquipment }))
                    }}
                    placeholder="Enter model"
                          className="w-full"
                  />
                      </TableCell>
                      <TableCell>
                  <Input
                    type="number"
                          value={equipment.priceInr || ""}
                    onChange={(e) => {
                      const newEquipment = [...formData.equipmentSanctioned]
                      newEquipment[index] = { ...equipment, priceInr: e.target.value }
                      setFormData(prev => ({ ...prev, equipmentSanctioned: newEquipment }))
                    }}
                          placeholder="Enter price"
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                <Input
                  type="file"
                  onChange={(e) => {
                    const newEquipment = [...formData.equipmentSanctioned]
                    newEquipment[index] = { ...equipment, invoiceUpload: e.target.files[0]?.name || "" }
                    setFormData(prev => ({ ...prev, equipmentSanctioned: newEquipment }))
                  }}
                          className="w-full"
                        />
                        {equipment.invoiceUpload && (
                          <p className="text-xs text-gray-500 mt-1">{equipment.invoiceUpload}</p>
                        )}
                      </TableCell>
                      <TableCell>
          <Button
            type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleArrayRemove("equipmentSanctioned", index)}
                          className="text-red-600 hover:text-red-700"
          >
                          <X className="h-4 w-4" />
          </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manpower Sanctioned */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Manpower Sanctioned
            </div>
                <Button
                  type="button"
                  size="sm"
              onClick={() => handleArrayAdd("manpowerSanctioned", { ...newManpower })}
              className="bg-[#0d559e] text-white hover:bg-[#0d559e]/90 border-0"
                >
              <Plus className="h-4 w-4 mr-1" />
              Add Manpower
                </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {formData.manpowerSanctioned.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No manpower added yet.</p>
              <p className="text-sm">Click "Add Manpower" to add manpower items.</p>
              </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Manpower Type</TableHead>
                    <TableHead className="w-[150px]">Number</TableHead>
                    <TableHead className="w-[80px]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formData.manpowerSanctioned.map((manpower, index) => (
                    <TableRow key={index}>
                      <TableCell>
                  <Select
                          value={manpower.manpowerType || ""}
                    onValueChange={(value) => handleManpowerTypeChange(value, index)}
                  >
                          <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select manpower type" />
                    </SelectTrigger>
                    <SelectContent>
                      {manpowerTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {manpower.manpowerType === "Other" && (
                          <div className="mt-2 flex space-x-2">
                        <Input
                              placeholder="Enter custom type"
                          value={customManpowerType}
                          onChange={(e) => setCustomManpowerType(e.target.value)}
                              className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            if (customManpowerType.trim()) {
                              const newManpower = [...formData.manpowerSanctioned]
                              newManpower[index] = { ...manpower, manpowerType: customManpowerType.trim() }
                              setFormData(prev => ({ ...prev, manpowerSanctioned: newManpower }))
                              setCustomManpowerType("")
                            }
                          }}
                          disabled={!customManpowerType.trim()}
                          size="sm"
                        >
                          Add
                        </Button>
                    </div>
                  )}
                      </TableCell>
                      <TableCell>
                  <Input
                    type="number"
                          value={manpower.number || ""}
                    onChange={(e) => {
                      const newManpower = [...formData.manpowerSanctioned]
                      newManpower[index] = { ...manpower, number: e.target.value }
                      setFormData(prev => ({ ...prev, manpowerSanctioned: newManpower }))
                    }}
                    placeholder="Enter number"
                          className="w-full"
                  />
                      </TableCell>
                      <TableCell>
          <Button
            type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleArrayRemove("manpowerSanctioned", index)}
                          className="text-red-600 hover:text-red-700"
          >
                          <X className="h-4 w-4" />
          </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Publications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Publications
            </div>
                <Button
                  type="button"
                  size="sm"
              onClick={() => handleArrayAdd("publications", { ...newPublication })}
              className="bg-[#0d559e] text-white hover:bg-[#0d559e]/90 border-0"
                >
              <Plus className="h-4 w-4 mr-1" />
              Add Publication
                </Button>
          </CardTitle>
          <CardDescription>
            Add publication details including name, description, status, and link
          </CardDescription>
        </CardHeader>
        <CardContent>
          {formData.publications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No publications added yet.</p>
              <p className="text-sm">Click "Add Publication" to add publications.</p>
              </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Name</TableHead>
                    <TableHead className="w-[250px]">Publication Detail</TableHead>
                    <TableHead className="w-[250px]">Link</TableHead>
                    <TableHead className="w-[150px]">Status</TableHead>
                    <TableHead className="w-[80px]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formData.publications.map((publication, index) => (
                    <TableRow key={index}>
                      <TableCell>
                  <Input
                          value={publication.name || ""}
                    onChange={(e) => {
                      const newPublications = [...formData.publications]
                      newPublications[index] = { ...publication, name: e.target.value }
                      setFormData(prev => ({ ...prev, publications: newPublications }))
                    }}
                    placeholder="Enter publication name"
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                  <Textarea
                          value={publication.publicationDetail || ""}
                    onChange={(e) => {
                      const newPublications = [...formData.publications]
                      newPublications[index] = { ...publication, publicationDetail: e.target.value }
                      setFormData(prev => ({ ...prev, publications: newPublications }))
                    }}
                    placeholder="Enter publication details"
                          rows={2}
                          className="w-full"
                  />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="url"
                          value={publication.link || ""}
                          onChange={(e) => {
                            const newPublications = [...formData.publications]
                            newPublications[index] = { ...publication, link: e.target.value }
                            setFormData(prev => ({ ...prev, publications: newPublications }))
                          }}
                          placeholder="Enter publication URL"
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                  <Select
                          value={publication.status || ""}
                    onValueChange={(value) => {
                      const newPublications = [...formData.publications]
                      newPublications[index] = { ...publication, status: value }
                      setFormData(prev => ({ ...prev, publications: newPublications }))
                    }}
                  >
                          <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {publicationStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                      </TableCell>
                      <TableCell>
          <Button
            type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleArrayRemove("publications", index)}
                          className="text-red-600 hover:text-red-700"
          >
                          <X className="h-4 w-4" />
          </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Budget Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Budget
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Sanction Year</TableHead>
                  <TableHead className="w-[200px]">Date</TableHead>
                  <TableHead className="w-[200px]">Total Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
              <Input
                type="number"
                      value={formData.budget.sanctionYear || ""}
                onChange={(e) => handleInputChange("budget.sanctionYear", e.target.value)}
                placeholder="Enter sanction year"
                      className="w-full"
              />
                  </TableCell>
                  <TableCell>
              <Input
                type="date"
                      value={formData.budget.date || ""}
                onChange={(e) => handleInputChange("budget.date", e.target.value)}
                      className="w-full"
              />
                  </TableCell>
                  <TableCell>
              <Input
                type="number"
                      value={formData.budget.totalAmount || ""}
                onChange={(e) => handleInputChange("budget.totalAmount", e.target.value)}
                placeholder="Enter total amount"
                      className="w-full"
              />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Patents - Multiple Patent Entries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
              Patents
            </div>
            <Button
              type="button"
              size="sm"
              onClick={() => handleArrayAdd("patents", { patentDetail: "", patentDocument: null })}
              className="bg-[#0d559e] text-white hover:bg-[#0d559e]/90 border-0"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Patent
            </Button>
          </CardTitle>
          <CardDescription>
            Add multiple patents with details and documents. Each patent can have its own description and file.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.patents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No patents added yet.</p>
              <p className="text-sm">Click "Add Patent" to add patent entries.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {formData.patents.map((patent, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">Patent {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleArrayRemove("patents", index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Patent Details */}
          <div className="space-y-2">
                    <Label htmlFor={`patentDetail-${index}`}>Patent Details</Label>
                    <Textarea
                      id={`patentDetail-${index}`}
                      value={patent.patentDetail || ""}
                      onChange={(e) => {
                        const newPatents = [...formData.patents]
                        newPatents[index] = { ...patent, patentDetail: e.target.value }
                        setFormData(prev => ({ ...prev, patents: newPatents }))
                      }}
                      placeholder="Enter patent details, description, or information"
                      rows={3}
                      className="w-full"
                    />
                  </div>
                  
                  {/* Patent Document Upload for this specific patent */}
                  <div className="space-y-2">
                    <Label>Patent Document</Label>
                    <p className="text-sm text-gray-600 mb-2">
                      Upload a document for this patent (PDF, Word, images - Max 10MB)
                    </p>
                    {patent.patentDocument ? (
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium">{patent.patentDocument.name}</p>
                            <p className="text-xs text-gray-500">
                              {(patent.patentDocument.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newPatents = [...formData.patents]
                            newPatents[index] = { ...patent, patentDocument: null }
                            setFormData(prev => ({ ...prev, patents: newPatents }))
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <FileUpload
                        onFilesSelected={(files) => {
                          if (files && files.length > 0) {
                            const newPatents = [...formData.patents]
                            newPatents[index] = { ...patent, patentDocument: files[0] }
                            setFormData(prev => ({ ...prev, patents: newPatents }))
                          }
                        }}
                        maxFiles={1}
                        maxSize={10 * 1024 * 1024}
                        acceptedTypes={[
                          "application/pdf",
                          "application/msword",
                          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                          "text/plain",
                          "image/jpeg",
                          "image/png",
                          "image/gif",
                        ]}
                        disabled={isLoading}
                      />
                    )}
                  </div>
                  
                  {/* Show existing patent document if editing and document exists */}
                  {project && project.patents && project.patents[index] && project.patents[index].patentDocument && (
                    <div className="space-y-2">
                      <Label>Existing Document</Label>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium">{project.patents[index].patentDocument.originalName}</p>
                            <p className="text-xs text-gray-500">
                              {(project.patents[index].patentDocument.size / 1024).toFixed(2)} KB • {new Date(project.patents[index].patentDocument.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={async () => {
                              try {
                                const blob = await downloadPatentDocument({ 
                                  projectId: project._id, 
                                  filename: project.patents[index].patentDocument.filename 
                                }).unwrap()
                                
                                const downloadUrl = window.URL.createObjectURL(blob)
                                const a = document.createElement('a')
                                a.href = downloadUrl
                                a.download = project.patents[index].patentDocument.originalName
                                document.body.appendChild(a)
                                a.click()
                                window.URL.revokeObjectURL(downloadUrl)
                                document.body.removeChild(a)
                              } catch (error) {
                                console.error("Download error:", error)
                                alert("Failed to download document")
                              }
                            }}
                            disabled={isLoading || isDeletingPatent}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={async () => {
                              if (window.confirm(`Are you sure you want to delete "${project.patents[index].patentDocument.originalName}"?`)) {
                                try {
                                  const deleteResult = await deletePatentDocument({ 
                                    projectId: project._id, 
                                    filename: project.patents[index].patentDocument.filename 
                                  }).unwrap()
                                  
                                  // If the delete result includes the updated project, use it to update the parent
                                  if (deleteResult?.project && onProjectUpdate) {
                                    onProjectUpdate(deleteResult.project)
                                  } else {
                                    // Fallback: reload the page if callback not available
                                    window.location.reload()
                                  }
                                  
                                  alert("Document deleted successfully")
                                } catch (error) {
                                  console.error("Failed to delete document:", error)
                                  alert(`Failed to delete document: ${error?.data?.message || error?.message || 'Unknown error'}`)
                                }
                              }
                            }}
                            disabled={isLoading || isDeletingPatent}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Legacy Patent Detail (for backward compatibility) */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="space-y-2">
              <Label htmlFor="patentDetail">Legacy Patent Detail (Optional)</Label>
            <Textarea
              id="patentDetail"
              value={formData.patentDetail}
              onChange={(e) => handleInputChange("patentDetail", e.target.value)}
                placeholder="Enter general patent details (legacy field)"
                rows={3}
            />
              <p className="text-xs text-gray-500">
                This field is kept for backward compatibility. Use the "Patents" section above for new entries.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {project ? "Update Project" : "Create Project"}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

export default ProjectForm