"use client"

import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { X, Plus, Save, FileText, User, Building, Wrench, Users, BookOpen, DollarSign } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { useGetDisciplinesQuery } from "../../store/api/categoryApi"
import { useGetSchemesQuery } from "../../store/api/schemeApi"
import { useGetAllManpowerTypesQuery } from "../../store/api/manpowerTypeApi"

const ProjectForm = ({ project, onSubmit, onCancel, isLoading = false }) => {
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
    
    // Patent Details
    patentDetail: "",
  })

  // Initialize form data when project prop changes
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        fileNumber: project.fileNumber || "",
        discipline: project.discipline || "",
        scheme: project.scheme || "",
        projectSummary: project.projectSummary || "",
        status: project.validationStatus || "Ongoing", // Add status field
        principalInvestigators: project.principalInvestigators || [{
          name: project.pi?.name || "",
          designation: project.pi?.designation || "",
          email: project.pi?.email || "",
          instituteName: project.pi?.instituteName || "",
          department: project.pi?.department || "",
          instituteAddress: project.pi?.instituteAddress || "",
        }],
        coPrincipalInvestigators: project.coPrincipalInvestigators || (project.coPI ? [{
          name: project.coPI.name || "",
          designation: project.coPI.designation || "",
          email: project.coPI.email || "",
          instituteName: project.coPI.instituteName || "",
          department: project.coPI.department || "",
          instituteAddress: project.coPI.instituteAddress || "",
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
      })
    }
  }, [project])

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
    
    console.log("Submitting project data:", submitData)
    onSubmit(submitData)
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
  })

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

  const publicationStatuses = [
    "Published",
    "Submitted",
    "Under Review",
    "In Preparation",
    "Other"
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
            <Select value={formData.discipline} onValueChange={(value) => handleInputChange("discipline", value)}>
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
            <Select value={formData.scheme} onValueChange={(value) => handleInputChange("scheme", value)}>
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
              variant="outline"
              size="sm"
              className="bg-[#0d559e] text-white hover:bg-[#0d559e]/90"
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
                  <TableHead className="w-[180px]">Institute Name</TableHead>
                  <TableHead className="w-[150px]">Department</TableHead>
                  <TableHead className="w-[200px]">Institute Address</TableHead>
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
                      <Input
                        value={pi.instituteName || ""}
                        onChange={(e) => handlePIChange("instituteName", e.target.value, index)}
                        placeholder="Enter institute"
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
              variant="outline"
              size="sm"
              className="bg-[#0d559e] text-white hover:bg-[#0d559e]/90"
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
                    <TableHead className="w-[180px]">Institute Name</TableHead>
                    <TableHead className="w-[150px]">Department</TableHead>
                    <TableHead className="w-[200px]">Institute Address</TableHead>
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
                        <Input
                          value={coPI.instituteName || ""}
                          onChange={(e) => handleCoPIChange("instituteName", e.target.value, index)}
                          placeholder="Enter institute"
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
              variant="outline"
              size="sm"
              onClick={() => handleArrayAdd("equipmentSanctioned", { ...newEquipment })}
              className="bg-[#0d559e] text-white hover:bg-[#0d559e]/90"
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
              variant="outline"
              size="sm"
              onClick={() => handleArrayAdd("manpowerSanctioned", { ...newManpower })}
              className="bg-[#0d559e] text-white hover:bg-[#0d559e]/90"
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
              variant="outline"
              size="sm"
              onClick={() => handleArrayAdd("publications", { ...newPublication })}
              className="bg-[#0d559e] text-white hover:bg-[#0d559e]/90"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Publication
            </Button>
          </CardTitle>
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
                    <TableHead className="w-[300px]">Publication Detail</TableHead>
                    <TableHead className="w-[180px]">Status</TableHead>
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

      {/* Patent Detail */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Patent Detail
          </CardTitle>
          <CardDescription>
            Optional patent information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patentDetail">Patent Detail</Label>
            <Textarea
              id="patentDetail"
              value={formData.patentDetail}
              onChange={(e) => handleInputChange("patentDetail", e.target.value)}
              placeholder="Enter patent details"
              rows={4}
            />
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