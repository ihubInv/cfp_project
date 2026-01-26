"use client"

import { useState } from "react"
import { 
  useGetEquipmentQuery,
  useCreateEquipmentMutation,
  useUpdateEquipmentMutation,
  useDeleteEquipmentMutation
} from "../../store/api/equipmentApi"
import { useSyncProjectEquipmentMutation } from "../../store/api/adminApi"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Textarea } from "../../components/ui/textarea"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Search, Plus, Edit, Trash2, Database, Cpu, Monitor, Wrench } from "lucide-react"

const EquipmentManagement = () => {
  const [filters, setFilters] = useState({
    search: "",
    category: undefined,
    status: undefined,
    page: 1,
  })
  const [equipmentFormDialog, setEquipmentFormDialog] = useState(false)
  const [editingEquipment, setEditingEquipment] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    category: undefined,
    manufacturer: "",
    model: "",
    serialNumber: "",
    description: "",
    location: "",
    status: "Available",
    purchaseDate: "",
    warrantyExpiry: "",
    cost: "",
    specifications: "",
  })
  const [formError, setFormError] = useState("")

  const { data, isLoading, error } = useGetEquipmentQuery(filters)
  // Fetch all equipment for stats (without pagination)
  const { data: statsData } = useGetEquipmentQuery({ limit: 10000, page: 1 })
  const [createEquipment, { isLoading: isCreating }] = useCreateEquipmentMutation()
  const [updateEquipment, { isLoading: isUpdating }] = useUpdateEquipmentMutation()
  const [deleteEquipment, { isLoading: isDeleting }] = useDeleteEquipmentMutation()
  const [syncProjectEquipment, { isLoading: isSyncing }] = useSyncProjectEquipmentMutation()

  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      const newFilters = {
      ...prev,
      [key]: value === "" ? undefined : value,
      }
      // Only reset page to 1 if changing filters other than page itself
      if (key !== "page") {
        newFilters.page = 1
      }
      return newFilters
    })
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
    if (formError) setFormError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError("")

    // Validation
    if (!formData.name || !formData.category || !formData.manufacturer) {
      setFormError("Please fill in all required fields")
      return
    }

    try {
      const submitData = {
        ...formData,
        cost: formData.cost ? parseFloat(formData.cost) : 0,
        purchaseDate: formData.purchaseDate ? new Date(formData.purchaseDate) : null,
        warrantyExpiry: formData.warrantyExpiry ? new Date(formData.warrantyExpiry) : null,
      }

      if (editingEquipment) {
        await updateEquipment({
          id: editingEquipment._id,
          ...submitData,
        }).unwrap()
      } else {
        await createEquipment(submitData).unwrap()
      }

      setEquipmentFormDialog(false)
      setEditingEquipment(null)
      setFormData({
        name: "",
        category: undefined,
        manufacturer: "",
        model: "",
        serialNumber: "",
        description: "",
        location: "",
        status: "Available",
        purchaseDate: "",
        warrantyExpiry: "",
        cost: "",
        specifications: "",
      })
    } catch (err) {
      setFormError(err.data?.message || "Operation failed. Please try again.")
    }
  }

  const handleEditEquipment = (equipment) => {
    setEditingEquipment(equipment)
    setFormData({
      name: equipment.name || "",
      category: equipment.category || undefined,
      manufacturer: equipment.manufacturer || "",
      model: equipment.model || "",
      serialNumber: equipment.serialNumber || "",
      description: equipment.description || "",
      location: equipment.location ? 
        `${equipment.location.institution || ""}${equipment.location.department ? `, ${equipment.location.department}` : ""}${equipment.location.room ? `, ${equipment.location.room}` : ""}`.trim() || "" 
        : "",
      status: equipment.status || "Available",
      purchaseDate: equipment.purchaseDate ? new Date(equipment.purchaseDate).toISOString().split('T')[0] : "",
      warrantyExpiry: equipment.warrantyExpiry ? new Date(equipment.warrantyExpiry).toISOString().split('T')[0] : "",
      cost: equipment.cost?.toString() || "",
      specifications: equipment.specifications || "",
    })
    setEquipmentFormDialog(true)
  }

  const handleDeleteEquipment = async (equipmentId) => {
    if (window.confirm("Are you sure you want to delete this equipment? This action cannot be undone.")) {
      try {
        await deleteEquipment(equipmentId).unwrap()
      } catch (error) {
        console.error("Failed to delete equipment:", error)
      }
    }
  }

  const handleNewEquipment = () => {
    setEditingEquipment(null)
    setFormData({
      name: "",
      category: undefined,
      manufacturer: "",
      model: "",
      serialNumber: "",
      description: "",
      location: "",
      status: "Available",
      purchaseDate: "",
      warrantyExpiry: "",
      cost: "",
      specifications: "",
    })
    setEquipmentFormDialog(true)
  }

  const handleSyncProjectEquipment = async () => {
    if (window.confirm("This will sync all equipment from projects to the equipment inventory. Continue?")) {
      try {
        const result = await syncProjectEquipment().unwrap()
        alert(`Successfully synced equipment from ${result.syncedProjects} projects!`)
      } catch (error) {
        console.error("Failed to sync project equipment:", error)
        alert("Failed to sync project equipment. Please try again.")
      }
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      Available: { variant: "default", className: "bg-green-100 text-green-800" },
      "In Use": { variant: "default", className: "bg-blue-100 text-blue-800" },
      Maintenance: { variant: "default", className: "bg-yellow-100 text-yellow-800" },
      "Out of Order": { variant: "destructive", className: "bg-red-100 text-red-800" },
    }

    const config = variants[status] || { variant: "secondary", className: "bg-gray-100 text-gray-800" }

    return (
      <Badge variant={config.variant} className={config.className}>
        {status}
      </Badge>
    )
  }

  const getCategoryIcon = (category) => {
    const icons = {
      "Computer": Cpu,
      "Display": Monitor,
      "Laboratory": Wrench,
      "Other": Database,
    }
    const Icon = icons[category] || Database
    return <Icon className="h-4 w-4" />
  }

  const categories = [
    "Computer",
    "Display",
    "Laboratory",
    "Audio/Video",
    "Networking",
    "Storage",
    "Other"
  ]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0)
  }

  return (
    <div className="space-y-6 bg-gradient-to-br from-gray-50 to-white min-h-screen p-6">
      {/* Page Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Equipment Management
          </h1>
          <p className="text-gray-600 text-lg">Manage research equipment and laboratory assets</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={handleSyncProjectEquipment} 
            variant="outline"
            disabled={isSyncing}
            className="border-2 border-orange-500 text-orange-600 hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <Database className="h-4 w-4 mr-2" />
            {isSyncing ? "Syncing..." : "Sync from Projects"}
          </Button>
          <Button 
            onClick={handleNewEquipment} 
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Equipment
          </Button>
        </div>
      </div>

      {/* Equipment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-blue-200 overflow-hidden relative bg-gradient-to-br from-white to-blue-50/30">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-gray-700 group-hover:text-blue-700 transition-colors">Total Equipment</CardTitle>
            <div className="bg-blue-100 group-hover:bg-blue-200 rounded-full p-2 transition-all duration-300 group-hover:scale-110">
            <Database className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 inline-block">
              {statsData?.total || statsData?.equipment?.length || 0}
            </div>
            <p className="text-xs text-gray-600 group-hover:text-gray-700 transition-colors mt-2">All items</p>
          </CardContent>
        </Card>
        
        <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-green-200 overflow-hidden relative bg-gradient-to-br from-white to-green-50/30">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-gray-700 group-hover:text-green-700 transition-colors">Available</CardTitle>
            <div className="bg-green-100 group-hover:bg-green-200 rounded-full p-2 transition-all duration-300 group-hover:scale-110">
            <Database className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 inline-block">
              {statsData?.equipment?.filter(eq => eq.status === "Available").length || 0}
            </div>
            <p className="text-xs text-gray-600 group-hover:text-gray-700 transition-colors mt-2">Ready to use</p>
          </CardContent>
        </Card>
        
        <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-indigo-200 overflow-hidden relative bg-gradient-to-br from-white to-indigo-50/30">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-gray-700 group-hover:text-indigo-700 transition-colors">In Use</CardTitle>
            <div className="bg-indigo-100 group-hover:bg-indigo-200 rounded-full p-2 transition-all duration-300 group-hover:scale-110">
              <Database className="h-4 w-4 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-700 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 inline-block">
              {statsData?.equipment?.filter(eq => eq.status === "In Use").length || 0}
            </div>
            <p className="text-xs text-gray-600 group-hover:text-gray-700 transition-colors mt-2">Currently in use</p>
          </CardContent>
        </Card>
        
        <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-yellow-200 overflow-hidden relative bg-gradient-to-br from-white to-yellow-50/30">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-semibold text-gray-700 group-hover:text-yellow-700 transition-colors">Maintenance</CardTitle>
            <div className="bg-yellow-100 group-hover:bg-yellow-200 rounded-full p-2 transition-all duration-300 group-hover:scale-110">
            <Database className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-700 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 inline-block">
              {statsData?.equipment?.filter(eq => eq.status === "Maintenance").length || 0}
            </div>
            <p className="text-xs text-gray-600 group-hover:text-gray-700 transition-colors mt-2">Under maintenance</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search equipment..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={filters.category || ""}
              onValueChange={(value) => handleFilterChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.status || ""}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="In Use">In Use</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Out of Order">Out of Order</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Equipment Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-purple-700 transition-colors">
            Equipment <span className="text-purple-600">({data?.equipment?.length || 0})</span>
          </CardTitle>
          <CardDescription className="text-gray-600">Manage laboratory equipment and assets</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading equipment...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">Error loading equipment. Please try again.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Manufacturer</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Purchase Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.equipment?.map((equipment) => (
                  <TableRow key={equipment._id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{equipment.name}</p>
                        <p className="text-sm text-gray-600">{equipment.model}</p>
                        {equipment.serialNumber && (
                          <p className="text-xs text-gray-500">SN: {equipment.serialNumber}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(equipment.category)}
                        <span>{equipment.category}</span>
                      </div>
                    </TableCell>
                    <TableCell>{equipment.manufacturer}</TableCell>
                    <TableCell>
                      {equipment.location ? 
                        `${equipment.location.institution || ""}${equipment.location.department ? `, ${equipment.location.department}` : ""}${equipment.location.room ? `, ${equipment.location.room}` : ""}`.trim() || "N/A" 
                        : "N/A"
                      }
                    </TableCell>
                    <TableCell>{getStatusBadge(equipment.status)}</TableCell>
                    <TableCell>
                      {equipment.purchaseDate ? new Date(equipment.purchaseDate).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditEquipment(equipment)}
                          title="Edit Equipment"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEquipment(equipment._id)}
                          disabled={isDeleting}
                          title="Delete Equipment"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          {data?.totalPages > 1 && (
            <div className="flex justify-center space-x-2 mt-4">
              <Button
                variant="outline"
                disabled={filters.page <= 1}
                onClick={() => handleFilterChange("page", filters.page - 1)}
              >
                Previous
              </Button>
              <span className="flex items-center px-4 text-sm text-gray-600">
                Page {filters.page} of {data.totalPages}
              </span>
              <Button
                variant="outline"
                disabled={filters.page >= data.totalPages}
                onClick={() => handleFilterChange("page", filters.page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Equipment Form Dialog */}
      <Dialog open={equipmentFormDialog} onOpenChange={setEquipmentFormDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingEquipment ? "Edit Equipment" : "Add New Equipment"}
            </DialogTitle>
            <DialogDescription>
              {editingEquipment 
                ? "Update the equipment information below" 
                : "Fill in the details to add new equipment"
              }
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <Alert variant="destructive">
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Equipment Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Equipment name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category || ""} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="manufacturer">Manufacturer *</Label>
                <Input
                  id="manufacturer"
                  value={formData.manufacturer}
                  onChange={(e) => handleInputChange("manufacturer", e.target.value)}
                  placeholder="Manufacturer name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => handleInputChange("model", e.target.value)}
                  placeholder="Model number"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serialNumber">Serial Number</Label>
                <Input
                  id="serialNumber"
                  value={formData.serialNumber}
                  onChange={(e) => handleInputChange("serialNumber", e.target.value)}
                  placeholder="Serial number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="Equipment location"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status || ""} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="In Use">In Use</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Out of Order">Out of Order</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Cost</Label>
                <Input
                  id="cost"
                  type="number"
                  value={formData.cost}
                  onChange={(e) => handleInputChange("cost", e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="purchaseDate">Purchase Date</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => handleInputChange("purchaseDate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="warrantyExpiry">Warranty Expiry</Label>
                <Input
                  id="warrantyExpiry"
                  type="date"
                  value={formData.warrantyExpiry}
                  onChange={(e) => handleInputChange("warrantyExpiry", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Equipment description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specifications">Specifications</Label>
              <Textarea
                id="specifications"
                value={formData.specifications}
                onChange={(e) => handleInputChange("specifications", e.target.value)}
                placeholder="Technical specifications"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEquipmentFormDialog(false)
                  setEditingEquipment(null)
                  setFormError("")
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
                className="bg-[#0d559e] hover:bg-[#0d559e]/90"
              >
                {isCreating || isUpdating ? "Saving..." : editingEquipment ? "Update Equipment" : "Add Equipment"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default EquipmentManagement
