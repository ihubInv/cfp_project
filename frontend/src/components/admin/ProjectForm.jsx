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
    
    // Frontend validation
    const errors = []
    
    if (!formData.title.trim()) {
      errors.push("Project title is required")
    }
    
    if (!formData.discipline) {
      errors.push("Discipline is required")
    }
    
    if (!formData.scheme) {
      errors.push("Scheme is required")
    }
    
    if (!formData.projectSummary.trim()) {
      errors.push("Project summary is required")
    }
    
    if (!formData.principalInvestigators || formData.principalInvestigators.length === 0) {
      errors.push("At least one principal investigator is required")
    } else {
      formData.principalInvestigators.forEach((pi, index) => {
        if (!pi.name.trim()) errors.push(`PI ${index + 1}: Name is required`)
        if (!pi.designation.trim()) errors.push(`PI ${index + 1}: Designation is required`)
        if (!pi.email.trim()) errors.push(`PI ${index + 1}: Email is required`)
        if (!pi.instituteName.trim()) errors.push(`PI ${index + 1}: Institute name is required`)
        if (!pi.department.trim()) errors.push(`PI ${index + 1}: Department is required`)
        if (!pi.instituteAddress.trim()) errors.push(`PI ${index + 1}: Institute address is required`)
      })
    }
    
    if (!formData.budget.sanctionYear) {
      errors.push("Budget sanction year is required")
    }
    
    if (!formData.budget.date) {
      errors.push("Budget date is required")
    }
    
    if (!formData.budget.totalAmount || formData.budget.totalAmount <= 0) {
      errors.push("Budget total amount is required and must be greater than 0")
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
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter project title"
                required
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
            <Label htmlFor="discipline">Select Discipline *</Label>
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
            <Label htmlFor="scheme">Select Scheme *</Label>
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
            <Label htmlFor="projectSummary">Project Summary *</Label>
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
        <CardContent className="space-y-6">
          {formData.principalInvestigators.map((pi, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">PI #{index + 1}</h4>
                {formData.principalInvestigators.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => handleArrayRemove('principalInvestigators', index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`pi-${index}-name`}>Name *</Label>
                  <Input
                    id={`pi-${index}-name`}
                    value={pi.name}
                    onChange={(e) => handlePIChange("name", e.target.value, index)}
                    placeholder="Enter PI name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`pi-${index}-designation`}>Designation *</Label>
                  <Input
                    id={`pi-${index}-designation`}
                    value={pi.designation}
                    onChange={(e) => handlePIChange("designation", e.target.value, index)}
                    placeholder="Enter designation"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`pi-${index}-email`}>Email *</Label>
                <Input
                  id={`pi-${index}-email`}
                  type="email"
                  value={pi.email}
                  onChange={(e) => handlePIChange("email", e.target.value, index)}
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`pi-${index}-instituteName`}>Institute Name *</Label>
                  <Input
                    id={`pi-${index}-instituteName`}
                    value={pi.instituteName}
                    onChange={(e) => handlePIChange("instituteName", e.target.value, index)}
                    placeholder="Enter institute name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`pi-${index}-department`}>Department *</Label>
                  <Input
                    id={`pi-${index}-department`}
                    value={pi.department}
                    onChange={(e) => handlePIChange("department", e.target.value, index)}
                    placeholder="Enter department"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`pi-${index}-instituteAddress`}>Institute Address *</Label>
                <Textarea
                  id={`pi-${index}-instituteAddress`}
                  value={pi.instituteAddress}
                  onChange={(e) => handlePIChange("instituteAddress", e.target.value, index)}
                  placeholder="Enter institute address"
                  rows={2}
                  required
                />
              </div>
            </div>
          ))}
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
        <CardContent className="space-y-6">
          {formData.coPrincipalInvestigators.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No co-principal investigators added yet.</p>
              <p className="text-sm">Click "Add Co-PI" to add one or more co-principal investigators.</p>
            </div>
          ) : (
            formData.coPrincipalInvestigators.map((coPI, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Co-PI #{index + 1}</h4>
                  <Button
                    type="button"
                    onClick={() => handleArrayRemove('coPrincipalInvestigators', index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`copi-${index}-name`}>Name</Label>
                    <Input
                      id={`copi-${index}-name`}
                      value={coPI.name}
                      onChange={(e) => handleCoPIChange("name", e.target.value, index)}
                      placeholder="Enter co-PI name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`copi-${index}-designation`}>Designation</Label>
                    <Input
                      id={`copi-${index}-designation`}
                      value={coPI.designation}
                      onChange={(e) => handleCoPIChange("designation", e.target.value, index)}
                      placeholder="Enter designation"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`copi-${index}-email`}>Email</Label>
                  <Input
                    id={`copi-${index}-email`}
                    type="email"
                    value={coPI.email}
                    onChange={(e) => handleCoPIChange("email", e.target.value, index)}
                    placeholder="Enter email address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`copi-${index}-instituteName`}>Institute Name</Label>
                    <Input
                      id={`copi-${index}-instituteName`}
                      value={coPI.instituteName}
                      onChange={(e) => handleCoPIChange("instituteName", e.target.value, index)}
                      placeholder="Enter institute name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`copi-${index}-department`}>Department</Label>
                    <Input
                      id={`copi-${index}-department`}
                      value={coPI.department}
                      onChange={(e) => handleCoPIChange("department", e.target.value, index)}
                      placeholder="Enter department"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`copi-${index}-instituteAddress`}>Institute Address</Label>
                  <Textarea
                    id={`copi-${index}-instituteAddress`}
                    value={coPI.instituteAddress}
                    onChange={(e) => handleCoPIChange("instituteAddress", e.target.value, index)}
                    placeholder="Enter institute address"
                    rows={2}
                  />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Equipment Sanctioned */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wrench className="h-5 w-5 mr-2" />
            Equipment Sanctioned
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.equipmentSanctioned.map((equipment, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Equipment {index + 1}</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleArrayRemove("equipmentSanctioned", index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Generic Name</Label>
                  <Input
                    value={equipment.genericName}
                    onChange={(e) => {
                      const newEquipment = [...formData.equipmentSanctioned]
                      newEquipment[index] = { ...equipment, genericName: e.target.value }
                      setFormData(prev => ({ ...prev, equipmentSanctioned: newEquipment }))
                    }}
                    placeholder="Enter generic name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Make</Label>
                  <Input
                    value={equipment.make}
                    onChange={(e) => {
                      const newEquipment = [...formData.equipmentSanctioned]
                      newEquipment[index] = { ...equipment, make: e.target.value }
                      setFormData(prev => ({ ...prev, equipmentSanctioned: newEquipment }))
                    }}
                    placeholder="Enter make"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Model</Label>
                  <Input
                    value={equipment.model}
                    onChange={(e) => {
                      const newEquipment = [...formData.equipmentSanctioned]
                      newEquipment[index] = { ...equipment, model: e.target.value }
                      setFormData(prev => ({ ...prev, equipmentSanctioned: newEquipment }))
                    }}
                    placeholder="Enter model"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Price (INR)</Label>
                  <Input
                    type="number"
                    value={equipment.priceInr}
                    onChange={(e) => {
                      const newEquipment = [...formData.equipmentSanctioned]
                      newEquipment[index] = { ...equipment, priceInr: e.target.value }
                      setFormData(prev => ({ ...prev, equipmentSanctioned: newEquipment }))
                    }}
                    placeholder="Enter price in INR"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Invoice Upload</Label>
                <Input
                  type="file"
                  onChange={(e) => {
                    const newEquipment = [...formData.equipmentSanctioned]
                    newEquipment[index] = { ...equipment, invoiceUpload: e.target.files[0]?.name || "" }
                    setFormData(prev => ({ ...prev, equipmentSanctioned: newEquipment }))
                  }}
                />
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => handleArrayAdd("equipmentSanctioned", { ...newEquipment })}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Equipment
          </Button>
        </CardContent>
      </Card>

      {/* Manpower Sanctioned */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Manpower Sanctioned
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.manpowerSanctioned.map((manpower, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Manpower {index + 1}</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleArrayRemove("manpowerSanctioned", index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Manpower Type</Label>
                  <Select
                    value={manpower.manpowerType}
                    onValueChange={(value) => handleManpowerTypeChange(value, index)}
                  >
                    <SelectTrigger>
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
                  
                  {/* Custom manpower type input */}
                  {manpower.manpowerType === "Other" && (
                    <div className="mt-2 space-y-2">
                      <Label>Custom Manpower Type</Label>
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Enter custom manpower type"
                          value={customManpowerType}
                          onChange={(e) => setCustomManpowerType(e.target.value)}
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
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Number</Label>
                  <Input
                    type="number"
                    value={manpower.number}
                    onChange={(e) => {
                      const newManpower = [...formData.manpowerSanctioned]
                      newManpower[index] = { ...manpower, number: e.target.value }
                      setFormData(prev => ({ ...prev, manpowerSanctioned: newManpower }))
                    }}
                    placeholder="Enter number"
                  />
                </div>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => handleArrayAdd("manpowerSanctioned", { ...newManpower })}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Manpower
          </Button>
        </CardContent>
      </Card>

      {/* Publications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Publications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.publications.map((publication, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Publication {index + 1}</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleArrayRemove("publications", index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={publication.name}
                    onChange={(e) => {
                      const newPublications = [...formData.publications]
                      newPublications[index] = { ...publication, name: e.target.value }
                      setFormData(prev => ({ ...prev, publications: newPublications }))
                    }}
                    placeholder="Enter publication name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Publication Detail</Label>
                  <Textarea
                    value={publication.publicationDetail}
                    onChange={(e) => {
                      const newPublications = [...formData.publications]
                      newPublications[index] = { ...publication, publicationDetail: e.target.value }
                      setFormData(prev => ({ ...prev, publications: newPublications }))
                    }}
                    placeholder="Enter publication details"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={publication.status}
                    onValueChange={(value) => {
                      const newPublications = [...formData.publications]
                      newPublications[index] = { ...publication, status: value }
                      setFormData(prev => ({ ...prev, publications: newPublications }))
                    }}
                  >
                    <SelectTrigger>
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
                </div>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => handleArrayAdd("publications", { ...newPublication })}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Publication
          </Button>
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
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget.sanctionYear">Sanction Year *</Label>
              <Input
                id="budget.sanctionYear"
                type="number"
                value={formData.budget.sanctionYear}
                onChange={(e) => handleInputChange("budget.sanctionYear", e.target.value)}
                placeholder="Enter sanction year"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget.date">Date *</Label>
              <Input
                id="budget.date"
                type="date"
                value={formData.budget.date}
                onChange={(e) => handleInputChange("budget.date", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget.totalAmount">Total Amount *</Label>
              <Input
                id="budget.totalAmount"
                type="number"
                value={formData.budget.totalAmount}
                onChange={(e) => handleInputChange("budget.totalAmount", e.target.value)}
                placeholder="Enter total amount"
                required
              />
            </div>
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