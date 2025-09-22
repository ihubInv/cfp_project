import React, { useState } from "react"
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
  Award
} from "lucide-react"

const PublicationsPage = () => {
  const [searchFilters, setSearchFilters] = useState({
    search: "",
    type: "all",
    year: "all",
    discipline: "all"
  })

  // Sample publications data
  const samplePublications = [
    {
      id: 1,
      title: "Advanced Materials for Renewable Energy Applications: A Comprehensive Review",
      authors: "Dr. Rajesh Kumar, Dr. Priya Sharma, Dr. Amit Singh",
      journal: "Nature Materials",
      year: 2024,
      type: "Journal Article",
      discipline: "Engineering Sciences",
      doi: "10.1038/nmat.2024.001",
      impactFactor: 41.2,
      citations: 45,
      abstract: "This comprehensive review explores the latest developments in advanced materials for renewable energy applications, focusing on solar cells, batteries, and fuel cells."
    },
    {
      id: 2,
      title: "Quantum Computing Algorithms for Optimization Problems in Machine Learning",
      authors: "Dr. Sunita Verma, Dr. Neha Gupta",
      journal: "Physical Review Letters",
      year: 2024,
      type: "Journal Article",
      discipline: "Physical Sciences",
      doi: "10.1103/PhysRevLett.2024.001",
      impactFactor: 9.1,
      citations: 23,
      abstract: "We present novel quantum algorithms for solving optimization problems commonly encountered in machine learning applications."
    },
    {
      id: 3,
      title: "Green Chemistry Approaches for Sustainable Pharmaceutical Synthesis",
      authors: "Dr. Amit Singh, Dr. Rajesh Kumar",
      journal: "Chemical Reviews",
      year: 2024,
      type: "Journal Article",
      discipline: "Chemical Sciences",
      doi: "10.1021/acs.chemrev.2024.001",
      impactFactor: 72.1,
      citations: 67,
      abstract: "This review highlights recent advances in green chemistry methodologies for sustainable pharmaceutical synthesis."
    },
    {
      id: 4,
      title: "Machine Learning Applications in Financial Risk Assessment",
      authors: "Dr. Priya Sharma, Dr. Sunita Verma",
      journal: "Journal of Financial Economics",
      year: 2024,
      type: "Journal Article",
      discipline: "Mathematical Sciences",
      doi: "10.1016/j.jfineco.2024.001",
      impactFactor: 8.5,
      citations: 34,
      abstract: "We develop machine learning models for improved financial risk assessment and portfolio optimization."
    },
    {
      id: 5,
      title: "Biomarker Discovery for Early Cancer Detection: A Multi-omics Approach",
      authors: "Dr. Neha Gupta, Dr. Amit Singh",
      journal: "Nature Biotechnology",
      year: 2024,
      type: "Journal Article",
      discipline: "Life Sciences",
      doi: "10.1038/nbt.2024.001",
      impactFactor: 54.9,
      citations: 89,
      abstract: "This study presents a comprehensive multi-omics approach for biomarker discovery in early cancer detection."
    },
    {
      id: 6,
      title: "Proceedings of the International Conference on Advanced Materials",
      authors: "Dr. Rajesh Kumar (Editor)",
      journal: "Materials Today Proceedings",
      year: 2024,
      type: "Conference Proceedings",
      discipline: "Engineering Sciences",
      doi: "10.1016/j.matpr.2024.001",
      impactFactor: 1.8,
      citations: 12,
      abstract: "Conference proceedings covering recent advances in materials science and engineering."
    }
  ]

  const publicationTypes = [
    "Journal Article",
    "Conference Paper",
    "Conference Proceedings",
    "Book Chapter",
    "Book",
    "Patent",
    "Technical Report",
    "Thesis"
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

  const [filteredPublications, setFilteredPublications] = useState(samplePublications)

  const filterPublications = () => {
    let filtered = samplePublications

    if (searchFilters.search) {
      const searchTerm = searchFilters.search.toLowerCase()
      filtered = filtered.filter(publication => 
        publication.title.toLowerCase().includes(searchTerm) ||
        publication.authors.toLowerCase().includes(searchTerm) ||
        publication.journal.toLowerCase().includes(searchTerm) ||
        publication.abstract.toLowerCase().includes(searchTerm)
      )
    }

    if (searchFilters.type && searchFilters.type !== "all") {
      filtered = filtered.filter(publication => publication.type === searchFilters.type)
    }

    if (searchFilters.year && searchFilters.year !== "all") {
      filtered = filtered.filter(publication => publication.year === parseInt(searchFilters.year))
    }

    if (searchFilters.discipline && searchFilters.discipline !== "all") {
      filtered = filtered.filter(publication => publication.discipline === searchFilters.discipline)
    }

    setFilteredPublications(filtered)
  }

  const handleFilterChange = (key, value) => {
    setSearchFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSearch = () => {
    filterPublications()
  }

  const getTypeColor = (type) => {
    switch (type) {
      case "Journal Article":
        return "bg-blue-100 text-blue-800"
      case "Conference Paper":
        return "bg-green-100 text-green-800"
      case "Conference Proceedings":
        return "bg-purple-100 text-purple-800"
      case "Book Chapter":
        return "bg-orange-100 text-orange-800"
      case "Book":
        return "bg-red-100 text-red-800"
      case "Patent":
        return "bg-yellow-100 text-yellow-800"
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Research Publications</h2>
            <p className="text-gray-600">Explore research publications and outcomes from IIT Mandi iHub projects</p>
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
              Found {filteredPublications.length} publication(s)
            </p>
          </div>

          {/* Publications List */}
          <div className="space-y-6">
            {filteredPublications.map((publication) => (
              <Card key={publication.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{publication.title}</CardTitle>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <User className="w-4 h-4 mr-2" />
                        {publication.authors}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <BookOpen className="w-4 h-4 mr-2" />
                        {publication.journal}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {publication.year}
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Badge className={getTypeColor(publication.type)}>
                        {publication.type}
                      </Badge>
                      <Badge variant="outline">
                        {publication.discipline}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-700">{publication.abstract}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Award className="w-4 h-4 mr-1" />
                          IF: {publication.impactFactor}
                        </div>
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-1" />
                          Citations: {publication.citations}
                        </div>
                        <div className="flex items-center">
                          <Globe className="w-4 h-4 mr-1" />
                          DOI: {publication.doi}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default PublicationsPage