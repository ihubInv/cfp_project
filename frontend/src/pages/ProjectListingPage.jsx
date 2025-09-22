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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar,
  Building,
  User,
  DollarSign,
  Loader2,
  FileText,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Mail,
  Tag,
  RefreshCw,
  FileSearch
} from "lucide-react"
import { useGetPublicProjectsQuery } from "../store/api/publicApi"
import { useGetDisciplinesQuery } from "../store/api/categoryApi"

const ProjectListingPage = () => {
  const [searchFilters, setSearchFilters] = useState({
    year: "all",
    program: "all",
    discipline: "all",
    search: ""
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [showResults, setShowResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  // Generate years from 2010 to current year
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 2009 }, (_, i) => currentYear - i)

  // Sample programs/schemes
  const programs = [
    "Core Research Grant (CRG)",
    "Seminar/Symposia (SSY)",
    "Prime Minister Early Career Research Grant",
    "Empowerment and Equity Opportunities for Excellence in Science (EMEQ)",
    "Start-up Research Grant (SRG)",
    "State University Research Excellence (SERB SURE)",
    "Mathematical Research Impact Centric Support (MATRICS)",
    "International Travel Support (ITS)",
    "High Impact Proposal in Interdisciplinary Sciences (HIPIS)",
    "Ramanujan Fellowship",
    "JC Bose Fellowship",
    "SwarnaJayanti Fellowships",
    "National Post Doctoral Fellowship (N-PDF)",
    "Women Excellence Award",
    "Distinguished Investigator Award (DIA)"
  ]

  // Fetch projects with filters
  const { data: projectsData, isLoading, error, refetch } = useGetPublicProjectsQuery({
    page: currentPage,
    limit: pageSize,
    search: searchFilters.search || undefined,
    category: searchFilters.discipline !== "all" ? searchFilters.discipline : undefined,
    status: "All Status", // Show all statuses in listing
    year: searchFilters.year !== "all" ? searchFilters.year : undefined,
    program: searchFilters.program !== "all" ? searchFilters.program : undefined,
  })

  // Fetch disciplines
  const { data: disciplines } = useGetDisciplinesQuery()

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

  const handleSearch = async (e) => {
    e.preventDefault()
    setIsSearching(true)
    setCurrentPage(1)
    setShowResults(true)
    
    try {
      await refetch()
    } finally {
      setIsSearching(false)
    }
  }

  const clearFilters = () => {
    setSearchFilters({
      year: "",
      program: "",
      discipline: "",
      search: ""
    })
    setCurrentPage(1)
    setShowResults(false)
  }

  const getStatusBadge = (status) => {
    const variants = {
      "Ongoing": { variant: "default", className: "bg-green-100 text-green-800" },
      "Completed": { variant: "default", className: "bg-blue-100 text-blue-800" },
      "Pending": { variant: "default", className: "bg-yellow-100 text-yellow-800" },
      "Cancelled": { variant: "default", className: "bg-red-100 text-red-800" },
    }
    const config = variants[status] || { variant: "secondary", className: "bg-gray-100 text-gray-800" }
    return <Badge variant={config.variant} className={config.className}>{status}</Badge>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Fixed Sidebar */}
      <section className="fixed left-0 top-1/2 transform -translate-y-1/2 z-40">
        <div className="bg-[#0d559e] rounded-r-lg shadow-lg">
          <ul className="py-4">
            <li className="px-4 py-3">
              <Link to="/projects" className="flex items-center text-white hover:text-blue-200 transition-colors">
                <FileText className="h-5 w-5 mr-3" />
                <span>Project Listing</span>
              </Link>
            </li>
            <li className="px-4 py-3">
              <Link to="/projects" className="flex items-center text-white hover:text-blue-200 transition-colors">
                <FileSearch className="h-5 w-5 mr-3" />
                <span>Search</span>
              </Link>
            </li>
            <li className="px-4 py-3">
              <Link to="/equipment" className="flex items-center text-white hover:text-blue-200 transition-colors">
                <Filter className="h-5 w-5 mr-3" />
                <span>Equipment</span>
              </Link>
            </li>
            <li className="px-4 py-3">
              <Link to="/publications" className="flex items-center text-white hover:text-blue-200 transition-colors">
                <FileText className="h-5 w-5 mr-3" />
                <span>Research Outcome</span>
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* Main Content */}
      <div className="ml-16 pt-20">
        {/* Header Section */}
        <section className="bg-gradient-to-r from-[#0d559e] to-[#004d8c] py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                IIT Mandi iHub & HCi Foundation Funding Details
              </h1>
              <p className="text-xl text-blue-100">
                Browse comprehensive project information from IIT Mandi iHub & HCi Foundation
              </p>
            </div>
          </div>
        </section>

        {/* Search Form Section */}
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Search Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-6">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search projects by title, PI name, institution, keywords..."
                      value={searchFilters.search}
                      onChange={(e) => handleFilterChange("search", e.target.value)}
                      className="pl-10 h-12 text-lg"
                    />
                  </div>

                  {/* Filter Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <strong>Year</strong>
                      </label>
                      <Select value={searchFilters.year} onValueChange={(value) => handleFilterChange("year", value)}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Select Year</SelectItem>
                          {years.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Program/Scheme
                      </label>
                      <Select value={searchFilters.program} onValueChange={(value) => handleFilterChange("program", value)}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select Program" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Select Program</SelectItem>
                          {programs.map((program) => (
                            <SelectItem key={program} value={program}>
                              {program}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discipline
                      </label>
                      <Select value={searchFilters.discipline} onValueChange={(value) => handleFilterChange("discipline", value)}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select Discipline" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Select Discipline</SelectItem>
                          {disciplines?.map((discipline) => (
                            <SelectItem key={discipline._id} value={discipline.name}>
                              {discipline.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center">
                    <Button 
                      type="submit" 
                      className="bg-[#0d559e] hover:bg-[#0d559e]/90 h-12 px-8 text-lg"
                      disabled={isSearching}
                    >
                      {isSearching ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="h-5 w-5 mr-2" />
                          Search
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Results Section */}
        {showResults && (
          <section className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {isLoading ? (
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
                  <Card className="mb-6">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            Search Results
                          </h3>
                          <p className="text-gray-600">
                            Found {projectsData?.total || 0} projects
                            {searchFilters.year !== "all" && ` for year ${searchFilters.year}`}
                            {searchFilters.program !== "all" && ` under ${searchFilters.program}`}
                            {searchFilters.discipline !== "all" && ` in ${searchFilters.discipline}`}
                          </p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" onClick={clearFilters}>
                            Clear Filters
                          </Button>
                          <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Results Table */}
                  {projectsData?.projects && projectsData.projects.length > 0 ? (
                    <>
                      <Card>
                        <CardContent className="p-0">
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-gray-50">
                                  <TableHead className="font-semibold">Program</TableHead>
                                  <TableHead className="font-semibold">Discipline</TableHead>
                                  <TableHead className="font-semibold">File Number</TableHead>
                                  <TableHead className="font-semibold">PI Name</TableHead>
                                  <TableHead className="font-semibold">Project Title</TableHead>
                                  <TableHead className="font-semibold">Institute</TableHead>
                                  <TableHead className="font-semibold">Sanction Year</TableHead>
                                  <TableHead className="font-semibold">Budget (in ₹)</TableHead>
                                  <TableHead className="font-semibold">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {projectsData.projects.map((project) => (
                                  <TableRow key={project._id} className="hover:bg-gray-50">
                                    <TableCell className="font-medium">
                                      {project.projectType || project.program || "N/A"}
                                    </TableCell>
                                    <TableCell>
                                      <Badge variant="outline">
                                        {project.projectCategory || project.discipline || "N/A"}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="font-mono text-sm">
                                      {project.projectId || project._id.slice(-8)}
                                    </TableCell>
                                    <TableCell>
                                      <div>
                                        <p className="font-medium">{project.principalInvestigator?.name || "N/A"}</p>
                                        {project.principalInvestigator?.email && (
                                          <p className="text-xs text-gray-500">{project.principalInvestigator.email}</p>
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell className="max-w-xs">
                                      <p className="font-medium line-clamp-2">{project.title}</p>
                                    </TableCell>
                                    <TableCell>
                                      <p className="text-sm">{project.principalInvestigator?.institute || project.organization?.name || "N/A"}</p>
                                      <p className="text-xs text-gray-500">{project.organization?.state || project.state || ""}</p>
                                    </TableCell>
                                    <TableCell>
                                      {project.startDate ? new Date(project.startDate).getFullYear() : "N/A"}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                      {formatCurrency(project.funding?.approvedBudget || 0)}
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex space-x-2">
                                        <Button variant="outline" size="sm" asChild>
                                          <Link to={`/projects/${project._id}`}>
                                            <Eye className="h-4 w-4 mr-1" />
                                            View
                                          </Link>
                                        </Button>
                                        {project.principalInvestigator?.email && (
                                          <Button variant="ghost" size="sm" asChild>
                                            <a href={`mailto:${project.principalInvestigator.email}`}>
                                              <Mail className="h-4 w-4" />
                                            </a>
                                          </Button>
                                        )}
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </CardContent>
                      </Card>

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
                    <Card>
                      <CardContent className="text-center py-12">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                        <p className="text-gray-600 mb-4">
                          Try adjusting your search criteria or filters to find more projects.
                        </p>
                        <Button variant="outline" onClick={clearFilters}>
                          Clear All Filters
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default ProjectListingPage
