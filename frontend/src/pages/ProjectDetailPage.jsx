"use client"

import React from "react"
import { useParams, Link } from "react-router-dom"
import { useGetPublicProjectByIdQuery } from "../store/api/publicApi"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Separator } from "../components/ui/separator"
import { Calendar, MapPin, DollarSign, User, Building, ArrowLeft, Mail, Clock, Award, Target, BookOpen, Users, FileText, Briefcase, TrendingUp } from "lucide-react"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import { formatCurrencyInLakhsOrCrores } from "../lib/utils"

const ProjectDetailPage = () => {
  const { id } = useParams()
  const { data: project, isLoading, error } = useGetPublicProjectByIdQuery(id)
  
  // Debug: Log project data when it loads
  React.useEffect(() => {
    if (project) {
      console.log("Project loaded in detail page:", {
        id: project._id,
        hasPatents: !!project.patents,
        patentsLength: project.patents ? project.patents.length : 0,
        patents: project.patents,
        hasPatentDetail: !!project.patentDetail,
        patentDetail: project.patentDetail,
        hasPatentDocuments: !!project.patentDocuments,
        patentDocumentsLength: project.patentDocuments ? project.patentDocuments.length : 0
      })
    }
  }, [project])


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading project details...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-red-600">Project not found or error loading project details.</p>
            <Button asChild className="mt-4">
              <Link to="/projects">Back to Projects</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6 bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white hover:shadow-md transition-all duration-200">
          <Link to="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>

        {/* Project Title Header */}
        <div className="bg-white border-b-2 border-[#0d559e] mb-6">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              <span className="text-gray-600">Project Title: &nbsp;</span>
              {project.title}
            </h1>
            <Button variant="outline" asChild className="border-red-500 text-red-600 hover:bg-red-50">
              <Link to="/projects">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Close
              </Link>
            </Button>
          </div>
        </div>

        {/* Project Information Boxes */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-[#0d559e]" />
              Project Information
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* File Number */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">File Number</p>
                <h4 className="text-lg font-semibold text-gray-900">
                  {project.fileNumber || project.projectId || project._id?.slice(-8)}
                </h4>
              </div>

              {/* Project Cost */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Project Cost (INR)</p>
                <h4 className="text-lg font-semibold text-gray-900">
                  {formatCurrencyInLakhsOrCrores(
                    project.budget?.totalAmount || 
                    project.funding?.approvedBudget || 
                    0
                  )}
                </h4>
              </div>

              {/* Start Date */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Start Date</p>
                <h4 className="text-lg font-semibold text-gray-900">
                  {project.budget?.date ? formatDate(project.budget.date) : (project.startDate ? formatDate(project.startDate) : "-")}
                </h4>
              </div>

              {/* Status */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Status</p>
                <h4 className="text-lg font-semibold text-gray-900">
                  {project.validationStatus || project.status || "-"}
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* Project Summary */}
        <Card className="border-0 shadow-sm bg-white mb-6">
          <CardHeader className="bg-gradient-to-r from-[#0d559e] to-[#004d8c] text-white rounded-t-lg">
            <CardTitle className="flex items-center text-xl">
              <FileText className="h-6 w-6 mr-3" />
              Project Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed text-base">
                {project.projectSummary || project.abstract || "No project summary available"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Project Output Boxes */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Target className="h-5 w-5 mr-2 text-[#0d559e]" />
              Project Output
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Publications */}
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <BookOpen className="h-6 w-6 text-[#0d559e]" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">Publications</p>
                <h4 className="text-lg font-semibold text-gray-900">
                  {project.publications?.length || 0}
                </h4>
              </div>

              {/* Patents */}
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Award className="h-6 w-6 text-[#0d559e]" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">Patents</p>
                <h4 className="text-lg font-semibold text-gray-900">
                  {project.patentDetail ? "1" : "Nil"}
                </h4>
              </div>

              {/* Manpower */}
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="h-6 w-6 text-[#0d559e]" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">Manpower</p>
                <h4 className="text-lg font-semibold text-gray-900">
                  {project.manpowerSanctioned?.reduce((total, item) => total + (item.number || 0), 0) || 0}
                </h4>
              </div>

              {/* Equipment Sanctioned */}
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Briefcase className="h-6 w-6 text-[#0d559e]" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">Equipment Sanctioned</p>
                <h4 className="text-lg font-semibold text-gray-900">
                  {project.equipmentSanctioned?.length || 0}
                </h4>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">

            {/* PI Details */}
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader className="bg-gradient-to-r from-[#0d559e] to-[#004d8c] text-white rounded-t-lg">
                <CardTitle className="flex items-center text-xl">
                  <User className="h-6 w-6 mr-3" />
                  PI Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-600 mb-1">Name</h5>
                      <p className="text-gray-900">
                        {project.principalInvestigators?.[0]?.name || 
                         project.principalInvestigator?.name || 
                         "-"}
                      </p>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-600 mb-1">Institute Name</h5>
                      <p className="text-gray-900">
                        {project.principalInvestigators?.[0]?.instituteName || 
                         project.principalInvestigator?.institute || 
                         project.organization?.name || 
                         "-"}
                      </p>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-600 mb-1">Institute Address</h5>
                      <p className="text-gray-900">
                        {project.principalInvestigators?.[0]?.instituteAddress || 
                         project.principalInvestigator?.instituteAddress || 
                         "-"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-600 mb-1">Email</h5>
                      <p className="text-gray-900">
                        {project.principalInvestigators?.[0]?.email || 
                         project.principalInvestigator?.email || 
                         "-"}
                      </p>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-600 mb-1">Designation</h5>
                      <p className="text-gray-900">
                        {project.principalInvestigators?.[0]?.designation || 
                         project.principalInvestigator?.designation || 
                         "-"}
                      </p>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-600 mb-1">Department</h5>
                      <p className="text-gray-900">
                        {project.principalInvestigators?.[0]?.department || 
                         project.principalInvestigator?.department || 
                         "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Co-Principal Investigators - Institute */}
            {project.coPrincipalInvestigators && project.coPrincipalInvestigators.filter(coPI => (coPI.affiliationType || "Institute") === "Institute").length > 0 && (
              <Card className="border-0 shadow-sm bg-white">
                <CardHeader className="bg-gradient-to-r from-[#0d559e] to-[#004d8c] text-white rounded-t-lg">
                  <CardTitle className="flex items-center text-xl">
                    <Users className="h-6 w-6 mr-3" />
                    CO-PI Details (Institute)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-900">Name</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-900">Designation</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-900">Email</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-900">Department</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-900">Institute</th>
                          </tr>
                        </thead>
                      <tbody>
                        {project.coPrincipalInvestigators
                          .filter(coPI => (coPI.affiliationType || "Institute") === "Institute")
                          .map((coPI, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 text-gray-900">
                              {coPI.name || '-'}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-900">
                              {coPI.designation || '-'}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-900">
                              {coPI.email || '-'}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-900">
                              {coPI.department || '-'}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-900">
                              {coPI.instituteName || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Co-Principal Investigators - Industry */}
            {project.coPrincipalInvestigators && project.coPrincipalInvestigators.filter(coPI => coPI.affiliationType === "Industry").length > 0 && (
              <Card className="border-0 shadow-sm bg-white">
                <CardHeader className="bg-gradient-to-r from-[#0d559e] to-[#004d8c] text-white rounded-t-lg">
                  <CardTitle className="flex items-center text-xl">
                    <Users className="h-6 w-6 mr-3" />
                    CO-PI Details (Industry)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-900">Name</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-900">Designation</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-900">Email</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-900">Department</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-900">Industry</th>
                          </tr>
                        </thead>
                      <tbody>
                        {project.coPrincipalInvestigators
                          .filter(coPI => coPI.affiliationType === "Industry")
                          .map((coPI, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 text-gray-900">
                              {coPI.name || '-'}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-900">
                              {coPI.designation || '-'}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-900">
                              {coPI.email || '-'}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-900">
                              {coPI.department || '-'}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-900">
                              {coPI.instituteName || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}


            {/* Manpower and Equipment Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Manpower Sanctioned */}
              {project.manpowerSanctioned && project.manpowerSanctioned.length > 0 && (
                <Card className="border-0 shadow-sm bg-white">
                  <CardHeader className="bg-gradient-to-r from-[#0d559e] to-[#004d8c] text-white rounded-t-lg">
                    <CardTitle className="flex items-center text-xl">
                      <Users className="h-6 w-6 mr-3" />
                      Manpower sanctioned
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-900">Manpower Type</th>
                            <th className="border border-gray-300 px-4 py-2 text-center font-medium text-gray-900">Number</th>
                          </tr>
                        </thead>
                        <tbody>
                          {project.manpowerSanctioned.map((manpower, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="border border-gray-300 px-4 py-2 text-gray-900">
                                {manpower.manpowerType || '-'}
                              </td>
                              <td className="border border-gray-300 px-4 py-2 text-center text-gray-900">
                                {manpower.number || '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Equipment Sanctioned */}
              {project.equipmentSanctioned && project.equipmentSanctioned.length > 0 && (
                <Card className="border-0 shadow-sm bg-white">
                  <CardHeader className="bg-gradient-to-r from-[#0d559e] to-[#004d8c] text-white rounded-t-lg">
                    <CardTitle className="flex items-center text-xl">
                      <Briefcase className="h-6 w-6 mr-3" />
                      Equipment Sanctioned
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-900">Generic Name</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-900">Make</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-900">Model</th>
                          </tr>
                        </thead>
                        <tbody>
                          {project.equipmentSanctioned.map((equipment, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="border border-gray-300 px-4 py-2 text-gray-900">
                                {equipment.genericName || '-'}
                              </td>
                              <td className="border border-gray-300 px-4 py-2 text-gray-900">
                                {equipment.make || '-'}
                              </td>
                              <td className="border border-gray-300 px-4 py-2 text-gray-900">
                                {equipment.model || '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>


            {/* Publications */}
            {project.publications && project.publications.length > 0 && (
              <Card className="border-0 shadow-sm bg-white">
                <CardHeader className="bg-gradient-to-r from-[#0d559e] to-[#004d8c] text-white rounded-t-lg">
                  <CardTitle className="flex items-center text-xl">
                    <BookOpen className="h-6 w-6 mr-3" />
                    Publications <span className="ml-2 text-lg font-normal">({project.publications.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {project.publications.map((publication, index) => (
                      <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                        <div className="flex items-start space-x-3">
                          <span className="text-sm font-bold text-[#0d559e] mt-1">[{index + 1}]</span>
                          <div className="flex-1">
                            {publication.link ? (
                              <a 
                                href={publication.link.startsWith('http') ? publication.link : `https://${publication.link}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#0d559e] hover:text-[#004d8c] hover:underline font-medium text-base"
                              >
                                {publication.name || publication.link || 'Publication Link'}
                              </a>
                            ) : (
                              <span className="text-[#0d559e] font-medium text-base">
                              {publication.name || '-'}
                              </span>
                            )}
                            {publication.publicationDetail && (
                            <div className="mt-2 text-sm text-gray-700 leading-relaxed">
                                {publication.publicationDetail}
                            </div>
                            )}
                            {publication.status && (
                              <div className="mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {publication.status}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Patents - Multiple Patent Entries */}
            {project.patents && project.patents.length > 0 && (
              <Card className="border-0 shadow-sm bg-white">
                <CardHeader className="bg-gradient-to-r from-[#0d559e] to-[#004d8c] text-white rounded-t-lg">
                  <CardTitle className="flex items-center text-xl">
                    <Award className="h-6 w-6 mr-3" />
                    Patents <span className="ml-2 text-lg font-normal">({project.patents.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {project.patents.map((patent, index) => (
                      <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                        <div className="flex items-start space-x-3">
                          <span className="text-sm font-bold text-[#0d559e] mt-1">[{index + 1}]</span>
                          <div className="flex-1">
                            {patent.patentDetail && (
                              <p className="text-gray-700 leading-relaxed mb-3">{patent.patentDetail}</p>
                            )}
                            {patent.patentDocument && patent.patentDocument.filename && (
                              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                <FileText className="h-5 w-5 text-blue-600" />
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">{patent.patentDocument.originalName}</p>
                                  <p className="text-xs text-gray-500">
                                    {(patent.patentDocument.size / 1024).toFixed(2)} KB • {new Date(patent.patentDocument.uploadedAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <a
                                  href={`/api/files/projects/${project._id}/patent/${patent.patentDocument.filename}/download`}
                                  download={patent.patentDocument.originalName}
                                  className="text-[#0d559e] hover:text-[#004d8c] hover:underline text-sm font-medium"
                                >
                                  Download
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Legacy Patent Details (for backward compatibility) */}
            {project.patentDetail && (!project.patents || project.patents.length === 0) && (
              <Card className="border-0 shadow-sm bg-white">
                <CardHeader className="bg-gradient-to-r from-[#0d559e] to-[#004d8c] text-white rounded-t-lg">
                  <CardTitle className="flex items-center text-xl">
                    <Award className="h-6 w-6 mr-3" />
                    Patent Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-700 leading-relaxed">{project.patentDetail}</p>
                </CardContent>
              </Card>
            )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ProjectDetailPage
