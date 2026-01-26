import React, { useState } from "react"
import { Link } from "react-router-dom"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Badge } from "../components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import {
  Search,
  Filter,
  Building,
  Calendar,
  Loader2,
  Microscope,
  Wrench,
  Cpu,
  TestTube,
  List,
  Settings
} from "lucide-react"
import { useGetEquipmentQuery } from "../store/api/equipmentApi"

const EquipmentPage = () => {
  const [activeTab, setActiveTab] = useState("search")
  const [searchFilters, setSearchFilters] = useState({
    search: "",
    category: undefined,
    institution: "",
    year: undefined
  })

  // Fetch equipment data from backend - use search filters
  const { data: equipmentData, isLoading, error, refetch } = useGetEquipmentQuery(searchFilters)

  // Debug logging
  console.log("EquipmentPage - equipmentData:", equipmentData)
  console.log("EquipmentPage - isLoading:", isLoading)
  console.log("EquipmentPage - error:", error)
  console.log("EquipmentPage - searchFilters:", searchFilters)

  const handleFilterChange = (key, value) => {
    setSearchFilters(prev => ({
      ...prev,
      [key]: value === "" ? undefined : value
    }))
  }

  const handleSearch = () => {
    console.log("Searching with filters:", searchFilters)
    // The query will automatically refetch when searchFilters change
  }

  const getAvailabilityColor = (status) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800"
      case "In Use":
        return "bg-yellow-100 text-yellow-800"
      case "Under Maintenance":
        return "bg-red-100 text-red-800"
      case "Decommissioned":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case "microscopy":
        return <Microscope className="w-5 h-5" />
      case "analytical":
        return <TestTube className="w-5 h-5" />
      case "computing":
        return <Cpu className="w-5 h-5" />
      case "mechanical":
        return <Wrench className="w-5 h-5" />
      default:
        return <Settings className="w-5 h-5" />
    }
  }

  const years = [
    "2025-26", "2024-25", "2023-24", "2022-23", "2021-22", 
    "2020-21", "2019-20", "2018-19", "2017-18", "2016-17"
  ]

  const categories = [
    "Microscopy", "Analytical Instruments", "Spectroscopy",
    "Computing", "Mechanical", "Electrical", "Chemical", "Biological"
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0d559e] to-[#004d8c] py-12 pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Equipment Details
            </h1>
            <p className="text-xl text-blue-100">
              Search and explore research equipment at IIT Mandi iHub & HCi Foundation
            </p>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("search")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "search"
                    ? "border-[#0d559e] text-[#0d559e]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Search className="w-4 h-4 inline mr-2" />
                Search Equipment
              </button>
              <button
                onClick={() => setActiveTab("list")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "list"
                    ? "border-[#0d559e] text-[#0d559e]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <List className="w-4 h-4 inline mr-2" />
                List of Equipment Sanctioned
              </button>
            </nav>
          </div>
        </div>
      </section>

      {/* Search Tab Content */}
      {activeTab === "search" && (
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="w-5 h-5 mr-2 text-[#0d559e]" />
                  Search Equipment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Equipment Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Equipment Name *</label>
                    <div className="relative">
                      <Settings className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Enter equipment name"
                        value={searchFilters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Sanction Year */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Sanction Year</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Select value={searchFilters.year || ""} onValueChange={(value) => handleFilterChange('year', value)}>
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map(year => (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Institution */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Institution Name</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Enter institution name"
                        value={searchFilters.institution}
                        onChange={(e) => handleFilterChange('institution', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm text-gray-600 mb-4">
                    * Equipment name is mandatory, rest are optional for search.
                  </p>
                  <Button 
                    onClick={handleSearch}
                    className="bg-[#0d559e] hover:bg-[#004d8c] text-white px-8 py-2"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* List Tab Content */}
      {activeTab === "list" && (
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <List className="w-5 h-5 mr-2 text-[#0d559e]" />
                  List of Equipment Sanctioned
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <Select value={searchFilters.year || ""} onValueChange={(value) => handleFilterChange('year', value)}>
                      <SelectTrigger className="w-64">
                        <SelectValue placeholder="Project Sanctioned Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map(year => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={handleSearch}
                    className="bg-[#0d559e] hover:bg-[#004d8c] text-white px-8 py-2"
                  >
                    SUBMIT
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Results Section */}
      <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#0d559e]" />
                <p className="mt-2 text-gray-600">Loading equipment...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600">Error loading equipment. Please try again.</p>
              </div>
            ) : (
              <>
                {/* Results Summary */}
                <div className="mb-6">
                  <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {searchFilters.search || searchFilters.year || searchFilters.institution
                            ? `Search Results`
                            : `Equipment Database`}
                        </h3>
                    <p className="text-sm text-gray-600">
                      Found {equipmentData?.total || 0} equipment item(s) 
                      {searchFilters.search && ` for "${searchFilters.search}"`}
                    </p>
                  </div>
                </div>

                {/* Equipment Table */}
                {equipmentData?.equipment && equipmentData.equipment.length > 0 ? (
                  <Card className="shadow-lg">
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Equipment Details</TableHead>
                              <TableHead>State</TableHead>
                              <TableHead>Institution</TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Contact</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {equipmentData.equipment.map((equipment) => (
                              <TableRow key={equipment._id}>
                                <TableCell>
                                  <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-[#0d559e] rounded-lg">
                                      {getCategoryIcon(equipment.category)}
                                    </div>
                                    <div>
                                      <p className="font-medium">{equipment.name}</p>
                                      <p className="text-sm text-gray-600">
                                        {equipment.specifications?.manufacturer} {equipment.specifications?.model}
                                      </p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>{equipment.location?.state || "N/A"}</TableCell>
                                <TableCell>{equipment.location?.institution || "N/A"}</TableCell>
                                <TableCell>{equipment.category}</TableCell>
                                <TableCell>
                                  <Badge className={getAvailabilityColor(equipment.availability?.status)}>
                                    {equipment.availability?.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {equipment.contactPerson?.email && (
                                    <a 
                                      href={`mailto:${equipment.contactPerson.email}`}
                                      className="text-[#0d559e] hover:underline text-sm"
                                    >
                                      {equipment.contactPerson.name || equipment.contactPerson.email}
                                    </a>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="shadow-lg">
                    <CardContent className="text-center py-8">
                      <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium text-gray-500">No equipment found</p>
                      <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </section>

      <Footer />
    </div>
  )
}

export default EquipmentPage