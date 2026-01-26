"use client"

import { useState } from "react"
import { 
  useGetDisciplinesQuery, 
  useCreateDisciplineMutation,
  useUpdateDisciplineMutation,
  useDeleteDisciplineMutation,
  useInitializeDefaultDisciplinesMutation
} from "../../store/api/categoryApi"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Plus, Edit, Trash2, RefreshCw, Tag } from "lucide-react"

const DisciplineManagement = () => {
  const [editingDiscipline, setEditingDiscipline] = useState(null)
  const [disciplineDialog, setDisciplineDialog] = useState(false)
  const [disciplineData, setDisciplineData] = useState({
    name: "",
    description: "",
    isActive: true,
  })

  const { data: disciplines, isLoading, error, refetch } = useGetDisciplinesQuery({ isActive: false })
  const [createDiscipline, { isLoading: isCreating }] = useCreateDisciplineMutation()
  const [updateDiscipline, { isLoading: isUpdating }] = useUpdateDisciplineMutation()
  const [deleteDiscipline, { isLoading: isDeleting }] = useDeleteDisciplineMutation()
  const [initializeDefaultDisciplines, { isLoading: isInitializing }] = useInitializeDefaultDisciplinesMutation()

  const handleCreateDiscipline = async () => {
    try {
      await createDiscipline(disciplineData).unwrap()
      setDisciplineDialog(false)
      setDisciplineData({ name: "", description: "", isActive: true })
    } catch (error) {
      console.error("Failed to create discipline:", error)
      alert(`Failed to create discipline: ${error?.data?.message || error?.message || 'Unknown error'}`)
    }
  }

  const handleUpdateDiscipline = async () => {
    try {
      await updateDiscipline({
        id: editingDiscipline._id,
        ...disciplineData,
      }).unwrap()
      setDisciplineDialog(false)
      setEditingDiscipline(null)
      setDisciplineData({ name: "", description: "", isActive: true })
    } catch (error) {
      console.error("Failed to update discipline:", error)
      alert(`Failed to update discipline: ${error?.data?.message || error?.message || 'Unknown error'}`)
    }
  }

  const handleDeleteDiscipline = async (disciplineId) => {
    if (window.confirm("Are you sure you want to delete this discipline? This action cannot be undone.")) {
      try {
        await deleteDiscipline(disciplineId).unwrap()
      } catch (error) {
        console.error("Failed to delete discipline:", error)
        alert(`Failed to delete discipline: ${error?.data?.message || error?.message || 'Unknown error'}`)
      }
    }
  }

  const handleInitializeDefault = async () => {
    try {
      await initializeDefaultDisciplines().unwrap()
      alert("Default disciplines initialized successfully!")
      refetch()
    } catch (error) {
      console.error("Failed to initialize default disciplines:", error)
      alert(`Failed to initialize default disciplines: ${error?.data?.message || error?.message || 'Unknown error'}`)
    }
  }

  const handleEditDiscipline = (discipline) => {
    setEditingDiscipline(discipline)
    setDisciplineData({
      name: discipline.name,
      description: discipline.description || "",
      isActive: discipline.isActive !== undefined ? discipline.isActive : true,
    })
    setDisciplineDialog(true)
  }

  const handleNewDiscipline = () => {
    setEditingDiscipline(null)
    setDisciplineData({ name: "", description: "", isActive: true })
    setDisciplineDialog(true)
  }

  const getStatusBadge = (isActive) => {
    return (
      <Badge variant={isActive ? "default" : "secondary"}>
        {isActive ? "Active" : "Inactive"}
      </Badge>
    )
  }

  return (
    <div className="space-y-6 bg-gradient-to-br from-gray-50 to-white min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Discipline Management
          </h1>
          <p className="text-gray-600 text-lg">Manage project disciplines and research domains</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => refetch()} 
            variant="outline"
            className="border-2 border-blue-600 text-blue-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 hover:text-white transition-all duration-300 hover:scale-105"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          {(!disciplines || disciplines.length === 0) && (
            <Button
              onClick={handleInitializeDefault}
              disabled={isInitializing}
              variant="outline"
              className="border-2 border-green-600 text-green-600 hover:bg-gradient-to-r hover:from-green-600 hover:to-green-700 hover:text-white transition-all duration-300 hover:scale-105"
            >
              {isInitializing ? "Initializing..." : "Initialize Default"}
            </Button>
          )}
          <Button 
            onClick={handleNewDiscipline} 
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Discipline
          </Button>
        </div>
      </div>

      {/* Categories Table */}
      <Card className="group hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-200 overflow-hidden relative bg-gradient-to-br from-white to-purple-50/20">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-400/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center text-lg font-bold text-gray-800 group-hover:text-purple-700 transition-colors">
            <Tag className="h-5 w-5 mr-2" />
            Project Disciplines <span className="text-purple-600">({disciplines?.length || 0})</span>
          </CardTitle>
          <CardDescription className="text-gray-600">Manage all project disciplines and research domains</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading disciplines...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">Error loading disciplines. Please try again.</p>
              <p className="text-sm text-gray-500 mt-2">
                {error?.data?.message || error?.message || 'Unknown error occurred'}
              </p>
            </div>
          ) : disciplines && disciplines.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {disciplines.map((discipline) => (
                  <TableRow key={discipline._id}>
                    <TableCell className="font-medium">{discipline.name}</TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">
                        {discipline.description || "No description"}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(discipline.isActive)}</TableCell>
                    <TableCell>
                      {discipline.createdBy ? 
                        `${discipline.createdBy.firstName} ${discipline.createdBy.lastName}` : 
                        'System'
                      }
                    </TableCell>
                    <TableCell>{new Date(discipline.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditDiscipline(discipline)}
                          title="Edit Discipline"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDiscipline(discipline._id)}
                          disabled={isDeleting}
                          title="Delete Discipline"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No disciplines found</h3>
              <p className="text-gray-600 mb-4">
                Get started by creating your first discipline or initializing default disciplines.
              </p>
              <div className="flex justify-center gap-2">
                <Button onClick={handleNewDiscipline} className="bg-[#0d559e] hover:bg-[#0d559e]/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Discipline
                </Button>
                <Button
                  onClick={handleInitializeDefault}
                  disabled={isInitializing}
                  variant="outline"
                >
                  {isInitializing ? "Initializing..." : "Initialize Default"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Discipline Dialog */}
      <Dialog open={disciplineDialog} onOpenChange={setDisciplineDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingDiscipline ? "Edit Discipline" : "Create New Discipline"}
            </DialogTitle>
            <DialogDescription>
              {editingDiscipline ? "Update the discipline information" : "Add a new project discipline"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="disciplineName">Discipline Name *</Label>
              <Input
                id="disciplineName"
                value={disciplineData.name}
                onChange={(e) => setDisciplineData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter discipline name"
                required
              />
            </div>

            <div>
              <Label htmlFor="disciplineDescription">Description</Label>
              <Textarea
                id="disciplineDescription"
                value={disciplineData.description}
                onChange={(e) => setDisciplineData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter discipline description"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="disciplineStatus">Status *</Label>
              <Select
                value={disciplineData.isActive ? "active" : "inactive"}
                onValueChange={(value) => {
                  setDisciplineData(prev => ({ ...prev, isActive: value === "active" }))
                }}
              >
                <SelectTrigger id="disciplineStatus" className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                Active disciplines are available for selection in projects. Inactive disciplines are hidden but not deleted.
              </p>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setDisciplineDialog(false)
                  setEditingDiscipline(null)
                  setDisciplineData({ name: "", description: "", isActive: true })
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={editingDiscipline ? handleUpdateDiscipline : handleCreateDiscipline}
                disabled={!disciplineData.name.trim() || (editingDiscipline ? isUpdating : isCreating)}
                className="bg-[#0d559e] hover:bg-[#0d559e]/90"
              >
                {editingDiscipline ? 
                  (isUpdating ? "Updating..." : "Update Discipline") :
                  (isCreating ? "Creating..." : "Create Discipline")
                }
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DisciplineManagement
