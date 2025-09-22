import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Badge } from "../components/ui/badge"
import { 
  Search, 
  Filter, 
  Calendar,
  User,
  BookOpen,
  FileText,
  ExternalLink,
  Loader2,
  Globe,
  Award,
  RefreshCw
} from "lucide-react"
import { useGetPublicPublicationsQuery } from "../store/api/publicPublicationApi"

const PublicationsPage = () => {
  const [searchFilters, setSearchFilters] = useState({
    search: "",
    type: "all",
    year: "all",
    discipline: "all"
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Fetch publications from API with real-time updates
  const { 
    data: publicationsData, 
    error, 
    isLoading, 
    refetch,
    isFetching 
  } = useGetPublicPublicationsQuery({
    page: currentPage,
    limit: 10,
    search: searchFilters.search || undefined,
    type: searchFilters.type !== "all" ? searchFilters.type : undefined,
    year: searchFilters.year !== "all" ? searchFilters.year : undefined,
    discipline: searchFilters.discipline !== "all" ? searchFilters.discipline : undefined,
  })

  const publications = publicationsData?.publications || []
  const totalPages = publicationsData?.totalPages || 0
  const total = publicationsData?.total || 0

  const publicationTypes = [
    "Published",
    "Under Review", 
    "Submitted",
    "Draft",
    "Accepted"
  ]

  const disciplines = [
    "Engineering Sciences",
    "Physical Sciences",
    "Chemical Sciences",
    "Mathematical Sciences",
    "Life Sciences",
    "Earth Sciences",
    "Computer Sciences",
    "Materials Sciences",
    "Agricultural Sciences",
    "Medical Sciences",
    "Social Sciences",
    "Humanities"
  ]

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i)

  // Handle filter changes and reset pagination
  const handleFilterChange = (key, value) => {
    setSearchFilters(prev => ({
      ...prev,
      [key]: value
    }))
    setCurrentPage(1) // Reset to first page when filters change
  }

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1) // Reset to first page when searching
  }

  // Handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await refetch()
    } finally {
      setIsRefreshing(false)
    }
  }

  // Auto-refresh effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isFetching) {
        refetch()
      }
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [refetch, isFetching])

  const getTypeColor = (status) => {
    switch (status) {
      case "Published":
        return "bg-green-100 text-green-800"
      case "Under Review":
        return "bg-yellow-100 text-yellow-800"
      case "Submitted":
        return "bg-blue-100 text-blue-800"
      case "Accepted":
        return "bg-purple-100 text-purple-800"
      case "Draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Search Form Section */}
      <section className="py-8 bg-white pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-2">
              <h2 className="text-3xl font-bold text-gray-900">Research Publications</h2>
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing || isFetching}
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${(isRefreshing || isFetching) ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            <p className="text-gray-600">Explore research publications and outcomes from IIT Mandi iHub projects</p>
            {isFetching && (
              <p className="text-sm text-blue-600 mt-2 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating publications...
              </p>
            )}
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="w-5 h-5 mr-2 text-[#0d559e]" />
                Search Publications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Search Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search publications..."
                      value={searchFilters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Type Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Publication Type</label>
                  <Select value={searchFilters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {publicationTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Year Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Year</label>
                  <Select value={searchFilters.year} onValueChange={(value) => handleFilterChange('year', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      {years.map(year => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Discipline Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Discipline</label>
                  <Select value={searchFilters.discipline} onValueChange={(value) => handleFilterChange('discipline', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Discipline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Disciplines</SelectItem>
                      {disciplines.map(discipline => (
                        <SelectItem key={discipline} value={discipline}>
                          {discipline}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Button 
                  onClick={handleSearch}
                  className="bg-[#0d559e] hover:bg-[#004d8c] text-white px-8 py-2"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search Publications
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Summary */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Research Publications
            </h3>
            <p className="text-sm text-gray-600">
              Found {total} publication(s)
              {isLoading && <span className="ml-2 text-blue-600">Loading...</span>}
            </p>
          </div>

          {/* Error State */}
          {error && (
            <Card className="mb-6 border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <p className="text-red-600">
                  Error loading publications: {error.message || "Something went wrong"}
                </p>
                <Button 
                  onClick={handleRefresh} 
                  className="mt-2"
                  variant="outline"
                  size="sm"
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading publications...</span>
            </div>
          )}

          {/* Publications List */}
          {!isLoading && !error && (
            <div className="space-y-6">
              {publications.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-gray-500">No publications found matching your criteria.</p>
                  </CardContent>
                </Card>
              ) : (
                publications.map((publication) => (
                  <Card key={publication._id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{publication.name}</CardTitle>
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <BookOpen className="w-4 h-4 mr-2" />
                            {publication.publicationDetail}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <User className="w-4 h-4 mr-2" />
                            Project: {publication.projectTitle}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            File Number: {publication.projectFileNumber}
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Badge className={getTypeColor(publication.status)}>
                            {publication.status}
                          </Badge>
                          <Badge variant="outline">
                            {publication.projectDiscipline}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-sm text-gray-700">
                          <p><strong>Project:</strong> {publication.projectTitle}</p>
                          <p><strong>Scheme:</strong> {publication.projectScheme}</p>
                          <p><strong>Discipline:</strong> {publication.projectDiscipline}</p>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center space-x-6 text-sm text-gray-600">
                            <div className="flex items-center">
                              <FileText className="w-4 h-4 mr-1" />
                              Status: {publication.status}
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" asChild>
                              <Link to={`/projects/${publication.projectId}`}>
                                <ExternalLink className="w-4 h-4 mr-1" />
                                View Project
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !error && totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center space-x-2">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
              >
                Previous
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1
                  return (
                    <Button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      className="w-8 h-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>
              
              <Button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default PublicationsPage