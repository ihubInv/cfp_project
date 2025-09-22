"use client"

import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Badge } from "../components/ui/badge"
import { Separator } from "../components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  FileText,
  ChevronLeft,
  ChevronRight,
  RefreshCw
} from "lucide-react"
import { useGetPublicProjectsQuery } from "../store/api/publicApi"
import { useGetDisciplinesQuery } from "../store/api/categoryApi"
import { useGetSchemesQuery } from "../store/api/schemeApi"

const ProjectsPage = () => {
  const [searchFilters, setSearchFilters] = useState({
    discipline: "All Disciplines",
    scheme: "All Schemes",
    year: "All Years"
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(12)
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState("desc")
  const [hasSearched, setHasSearched] = useState(false)

  // Generate years from 2010 to current year
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 2009 }, (_, i) => currentYear - i)



  // Fetch projects with filters - only when hasSearched is true
  const queryParams = {
    page: currentPage,
    limit: pageSize,
    discipline: searchFilters.discipline !== "All Disciplines" ? searchFilters.discipline : undefined,
    scheme: searchFilters.scheme !== "All Schemes" ? searchFilters.scheme : undefined,
    year: searchFilters.year !== "All Years" ? searchFilters.year : undefined,
    sortBy,
    sortOrder
  }
  
  console.log("Frontend query params:", queryParams) // Debug log
  
  const { data: projectsData, isLoading, error, refetch } = useGetPublicProjectsQuery(
    hasSearched ? queryParams : null
  )

  // Fetch disciplines
  const { data: disciplines } = useGetDisciplinesQuery()

  // Fetch schemes
  const { data: schemes } = useGetSchemesQuery()

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleFilterChange = (key, value) => {
    setSearchFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setHasSearched(true)
    setCurrentPage(1)
    refetch()
  }

  const clearFilters = () => {
    setSearchFilters({
      discipline: "All Disciplines",
      scheme: "All Schemes",
      year: "All Years"
    })
    setCurrentPage(1)
    setHasSearched(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Content */}
      <div className="ml-16 pt-20">
        {/* Search Form Section */}
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Project Listing</h2>
              <p className="text-gray-600">Browse comprehensive project information from IIT Mandi iHub & HCi Foundation</p>
            </div>

            <Card className="shadow-lg mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Search & Filter Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-6">
                  {/* Filter Grid - Year, Discipline, and Scheme */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                      <Select value={searchFilters.year} onValueChange={(value) => handleFilterChange("year", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All Years">All Years</SelectItem>
                          {years.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Discipline</label>
                      <Select value={searchFilters.discipline} onValueChange={(value) => handleFilterChange("discipline", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All Disciplines">All Disciplines</SelectItem>
                          {disciplines?.map((discipline) => (
                            <SelectItem key={discipline._id} value={discipline.name}>
                              {discipline.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Scheme</label>
                      <Select value={searchFilters.scheme} onValueChange={(value) => handleFilterChange("scheme", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All Schemes">All Schemes</SelectItem>
                          {schemes?.map((scheme) => (
                            <SelectItem key={scheme._id} value={scheme.name}>
                              {scheme.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Button type="submit" className="bg-[#0d559e] hover:bg-[#0d559e]/90">
                        <Search className="h-4 w-4 mr-2" />
                        Search Projects
                      </Button>
                      <Button type="button" variant="outline" onClick={clearFilters}>
                        Clear Filters
                      </Button>
                      <Button type="button" variant="outline" onClick={() => refetch()}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                    </div>
                    
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {!hasSearched ? (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Search for Projects</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Use the filters above to search for projects. Select discipline, scheme, or year to find relevant research projects.
                </p>
                <div className="flex justify-center space-x-4">
                  <Button 
                    onClick={() => {
                      setHasSearched(true)
                      refetch()
                    }}
                    className="bg-[#0d559e] hover:bg-[#0d559e]/90"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Show All Projects
                  </Button>
                </div>
              </div>
            ) : isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading projects...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600">Error loading projects. Please try again.</p>
                <Button variant="outline" onClick={() => refetch()} className="mt-4">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </div>
            ) : (
              <>
                {/* Results Header */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {projectsData?.total || 0} Projects Found
                    </h3>
                    <p className="text-gray-600">
                      Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, projectsData?.total || 0)} of {projectsData?.total || 0} projects
                    </p>
                  </div>
                  
                  <Button variant="outline" className="bg-white">
                    <Download className="h-4 w-4 mr-2" />
                    Export Results
                  </Button>
                </div>

                {/* Projects Table */}
                {projectsData?.projects && projectsData.projects.length > 0 ? (
                  <>
                    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gradient-to-r from-[#0d559e] to-[#004d8c] hover:bg-gradient-to-r hover:from-[#0d559e] hover:to-[#004d8c]">
                            <TableHead className="w-[200px] text-white font-semibold text-sm">Project Title</TableHead>
                            <TableHead className="w-[150px] text-white font-semibold text-sm">Principal Investigator</TableHead>
                            <TableHead className="w-[150px] text-white font-semibold text-sm">Institution</TableHead>
                            <TableHead className="w-[120px] text-white font-semibold text-sm">Category</TableHead>
                            <TableHead className="w-[120px] text-white font-semibold text-sm">Scheme</TableHead>
                            <TableHead className="w-[100px] text-white font-semibold text-sm">Budget</TableHead>
                            <TableHead className="w-[80px] text-white font-semibold text-sm">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {projectsData.projects.map((project) => (
                            <TableRow key={project._id} className="hover:bg-gray-50">
                              <TableCell className="font-medium">
                                <div className="max-w-[200px]">
                                  <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                                    {project.title || "Untitled Project"}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    File No: {project.fileNumber || project.projectId || project._id?.slice(-8)}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="max-w-[150px]">
                                  <p className="text-sm font-medium text-gray-900">
                                    {project.principalInvestigators?.[0]?.name || 
                                     project.principalInvestigator?.name || 
                                     "N/A"}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {project.principalInvestigators?.[0]?.email || 
                                     project.principalInvestigator?.email || 
                                     ""}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="max-w-[150px]">
                                  <p className="text-sm text-gray-900 line-clamp-2">
                                    {project.principalInvestigators?.[0]?.instituteName || 
                                     project.principalInvestigator?.institute || 
                                     project.organization?.name || 
                                     "N/A"}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {project.organization?.state || ""}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-xs">
                                  {project.projectCategory || project.discipline || "N/A"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="text-xs">
                                  {project.scheme || "N/A"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <p className="font-medium text-gray-900">
                                    {formatCurrency(project.budget?.totalAmount || project.funding?.approvedBudget || project.totalCost || 0)}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {project.funding?.fundingStatus || ""}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  asChild
                                  className="h-8 w-8 p-0"
                                >
                                  <Link to={`/projects/${project._id}`}>
                                    <Eye className="h-4 w-4" />
                                  </Link>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination */}
                    {projectsData.totalPages > 1 && (
                      <div className="flex justify-center items-center space-x-2 mt-8">
                        <Button
                          variant="outline"
                          disabled={currentPage <= 1}
                          onClick={() => setCurrentPage(currentPage - 1)}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        
                        <span className="flex items-center px-4 text-sm text-gray-600">
                          Page {currentPage} of {projectsData.totalPages}
                        </span>
                        
                        <Button
                          variant="outline"
                          disabled={currentPage >= projectsData.totalPages}
                          onClick={() => setCurrentPage(currentPage + 1)}
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your search criteria or filters to find more projects.
                    </p>
                    <Button variant="outline" onClick={clearFilters}>
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}

export default ProjectsPage