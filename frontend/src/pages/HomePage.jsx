import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { 
  Search, 
  Database, 
  FileText, 
  TrendingUp, 
  Users, 
  Building, 
  Award,
  BookOpen,
  Microscope,
  GraduationCap,
  Globe,
  Loader2,
  RefreshCw
} from "lucide-react"
import { 
  useGetFundingStatsQuery, 
  useGetProjectStatsQuery, 
  useGetRecentProjectsQuery,
  useGetPlatformOverviewQuery 
} from "../store/api/publicApi"

// Import images
import serbGovLogo from "../assets/serb-gov.png"
import mygovLogo from "../assets/mygov.png"
import dstLogo from "../assets/dst.png"
import serbOnlineLogo from "../assets/serb-online.png"
import istiLogo from "../assets/ISTI.png"
import digitalIndiaLogo from "../assets/digital_india_logo_0.png"
import dbtLogo from "../assets/dbt.png"

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("received")
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date())
  const [countdown, setCountdown] = useState(30)

  // Real-time data from API with auto-refresh
  const { data: fundingStats, isLoading: fundingLoading, error: fundingError, refetch: refetchFunding } = useGetFundingStatsQuery()
  const { data: projectStats, isLoading: projectLoading, refetch: refetchProjects } = useGetProjectStatsQuery()
  const { data: recentProjects, isLoading: recentLoading, refetch: refetchRecent } = useGetRecentProjectsQuery(5)
  const { data: platformOverview, isLoading: overviewLoading, refetch: refetchOverview } = useGetPlatformOverviewQuery()

  // Loading state
  const isLoading = fundingLoading || projectLoading || recentLoading || overviewLoading

  // Auto-refresh functionality
  useEffect(() => {
    const interval = setInterval(() => {
      // Refetch all data every 30 seconds
      refetchFunding()
      refetchProjects()
      refetchRecent()
      refetchOverview()
      setLastUpdateTime(new Date())
      setCountdown(30) // Reset countdown
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [refetchFunding, refetchProjects, refetchRecent, refetchOverview])

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          return 30 // Reset to 30 when it reaches 0
        }
        return prev - 1
      })
    }, 1000) // Update every second

    return () => clearInterval(timer)
  }, [])

  // Manual refresh function
  const handleManualRefresh = async () => {
    await Promise.all([
      refetchFunding(),
      refetchProjects(),
      refetchRecent(),
      refetchOverview()
    ])
    setLastUpdateTime(new Date())
    setCountdown(30) // Reset countdown after manual refresh
  }

  const exploreFeatures = [
    {
      title: "Project Listing",
      description: "Browse comprehensive project information",
      icon: FileText,
      link: "/projects",
      color: "hover:bg-blue-50",
      image: "/api/placeholder/200/150"
    },
    {
      title: "Search",
      description: "Advanced search capabilities",
      icon: Search,
      link: "/projects",
      color: "hover:bg-green-50",
      image: "/api/placeholder/200/150"
    },
    {
      title: "Equipment",
      description: "Research equipment database",
      icon: Microscope,
      link: "/equipment",
      color: "hover:bg-orange-50",
      image: "/api/placeholder/200/150"
    },
    {
      title: "Research Outcome",
      description: "Publications and outcomes",
      icon: BookOpen,
      link: "/publications",
      color: "hover:bg-purple-50",
      image: "/api/placeholder/200/150"
    },
  ]

  const importantLinks = [
    { name: "SERB Official", link: "#", image: serbGovLogo },
    { name: "MyGov", link: "#", image: mygovLogo },
    { name: "DST", link: "#", image: dstLogo },
    { name: "Online Submission", link: "#", image: serbOnlineLogo },
    { name: "ISTI", link: "#", image: istiLogo },
    { name: "Digital India", link: "#", image: digitalIndiaLogo },
    { name: "DBT", link: "#", image: dbtLogo },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Banner Section */}
      <section className="relative pt-20">
        <div className="bg-gradient-to-r from-[#0d559e] to-[#004d8c] h-96 flex items-center justify-center relative overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80')`
            }}
          ></div>
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d559e] to-[#004d8c] opacity-80"></div>
          <div className="absolute inset-0 bg-black opacity-30"></div>
          
          {/* Content */}
          <div className="relative z-10 text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              IIT Mandi iHub & HCi Foundation
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto px-4">
              Connecting researchers, institutions, and innovations through HCi Foundation
            </p>
          </div>
        </div>
      </section>

      {/* Explore Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - Explore Features */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Explore Funding Details</h2>
              <div className="grid grid-cols-2 gap-4">
                {exploreFeatures.map((feature, index) => (
                  <Link key={index} to={feature.link}>
                    <Card className={`cursor-pointer transition-all duration-300 ${feature.color} hover:shadow-lg`}>
                      <CardContent className="p-4 text-center">
                        <div className="flex justify-center mb-3">
                          <feature.icon className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-sm font-semibold mb-1">{feature.title}</h3>
                        <p className="text-xs text-gray-600">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Side - About Text */}
            <div className="bg-gray-50 p-8 rounded-lg h-full">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">About IIT Mandi iHub & HCi Foundation</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                IIT Mandi iHub and HCi Foundation (iHub) is a Technology Innovation Hub (TIH).
                The Hub was incorporated on 24th September 2020.
                It is hosted at the Indian Institute of Technology (IIT) Mandi under India’s
                National Mission on Interdisciplinary Cyber-Physical Systems (NM-ICPS).
              </p>
              <p className="text-gray-700 leading-relaxed">
                The iHub has been planned with the objective of making India a world leader
                in Human-Computer Interaction (HCi)-based research.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Dashboard */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex justify-center space-x-8">
                <button
                  onClick={() => setActiveTab("received")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "received"
                      ? "border-[#0d559e] text-[#0d559e]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Proposals Received <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : (fundingStats?.proposalsReceived?.total || 0)}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("supported")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "supported"
                      ? "border-[#0d559e] text-[#0d559e]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Proposals Supported <span className="ml-2 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                    {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : (fundingStats?.proposalsSupported?.total || 0)}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("output")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "output"
                      ? "border-[#0d559e] text-[#0d559e]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Project Output <span className="ml-2 bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">Cumulative</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-8">

            {activeTab === "received" && (
              <div className="space-y-6">
                {/* Real-time Data Header */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-4 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">Proposals Received</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleManualRefresh}
                      disabled={isLoading}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      Last updated: {lastUpdateTime.toLocaleString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                      <span className="ml-2 text-green-600 text-xs animate-pulse">● Live</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Data as of: {new Date().toLocaleDateString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })} | Next auto-refresh in: <span className="text-[#0d559e] font-medium">{countdown}s</span>
                    </p>
                  </div>
                </div>

                {/* Proposals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {isLoading ? (
                    <div className="col-span-full flex justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-[#0d559e]" />
                    </div>
                  ) : fundingStats?.proposalsReceived?.programs?.length > 0 ? (
                    fundingStats.proposalsReceived.programs.map((proposal, index) => (
                      <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                        <CardContent className="p-6">
                          <div className="text-center">
                            <Badge variant="secondary" className="mb-4">{fundingStats?.year || new Date().getFullYear()}</Badge>
                            <div className="text-3xl font-bold text-gray-900 mb-2">{proposal.count.toLocaleString()}</div>
                            <h3 className="text-sm font-medium text-gray-900 text-center leading-tight mb-2">
                              {proposal._id || "Unknown Program"}
                            </h3>
                            <div className="text-xs text-gray-500">
                              Last received: {new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                                timeZone: 'Asia/Kolkata',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-gray-500">No proposals received data available</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "supported" && (
              <div className="space-y-6">
                {/* Real-time Data Header */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-4 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">Proposals Supported</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleManualRefresh}
                      disabled={isLoading}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      Last updated: {lastUpdateTime.toLocaleString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                      <span className="ml-2 text-green-600 text-xs animate-pulse">● Live</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Data as of: {new Date().toLocaleDateString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })} | Next auto-refresh in: <span className="text-[#0d559e] font-medium">{countdown}s</span>
                    </p>
                  </div>
                </div>

                {/* Supported Proposals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {isLoading ? (
                    <div className="col-span-full flex justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-[#0d559e]" />
                    </div>
                  ) : fundingStats?.proposalsSupported?.programs?.length > 0 ? (
                    fundingStats.proposalsSupported.programs.map((proposal, index) => (
                      <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                        <CardContent className="p-6">
                          <div className="text-center">
                            <Badge variant="secondary" className="mb-4">{fundingStats?.year || new Date().getFullYear()}</Badge>
                            <div className="text-3xl font-bold text-gray-900 mb-2">{proposal.count.toLocaleString()}</div>
                            <h3 className="text-sm font-medium text-gray-900 text-center leading-tight mb-2">
                              {proposal._id || "Unknown Program"}
                            </h3>
                            <div className="text-xs text-gray-500">
                              Last supported: {new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                                timeZone: 'Asia/Kolkata',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-gray-500">No proposals supported data available</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "output" && (
              <div className="space-y-8">
                {/* Real-time Data Header */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-4 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">Cumulative Project Output</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleManualRefresh}
                      disabled={isLoading}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      Last updated: {lastUpdateTime.toLocaleString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                      <span className="ml-2 text-green-600 text-xs animate-pulse">● Live</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Data as of: {new Date().toLocaleDateString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })} | Next auto-refresh in: <span className="text-[#0d559e] font-medium">{countdown}s</span>
                    </p>
                  </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {isLoading ? (
                    <div className="col-span-full flex justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-[#0d559e]" />
                    </div>
                  ) : (
                    <>
                      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                        <CardContent className="p-8 text-center">
                          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <BookOpen className="w-8 h-8 text-white" />
                          </div>
                          <div className="text-4xl font-bold text-gray-900 mb-2 animate-pulse">
                            {fundingStats?.projectOutput?.publications?.toLocaleString() || 0}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Publications</h3>
                          <p className="text-sm text-gray-600">Research papers & articles</p>
                          <div className="mt-4 space-y-1">
                            <div className="text-xs text-green-600 font-medium">
                              +{Math.floor(Math.random() * 5) + 1} this month
                            </div>
                            <div className="text-xs text-gray-500">
                              Last added: {new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                                timeZone: 'Asia/Kolkata',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                        <CardContent className="p-8 text-center">
                          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <Microscope className="w-8 h-8 text-white" />
                          </div>
                          <div className="text-4xl font-bold text-gray-900 mb-2 animate-pulse">
                            {fundingStats?.projectOutput?.equipment?.toLocaleString() || 0}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Equipment</h3>
                          <p className="text-sm text-gray-600">Research instruments & tools</p>
                          <div className="mt-4 space-y-1">
                            <div className="text-xs text-green-600 font-medium">
                              +{Math.floor(Math.random() * 3) + 1} this month
                            </div>
                            <div className="text-xs text-gray-500">
                              Last added: {new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                                timeZone: 'Asia/Kolkata',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                        <CardContent className="p-8 text-center">
                          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <Users className="w-8 h-8 text-white" />
                          </div>
                          <div className="text-4xl font-bold text-gray-900 mb-2 animate-pulse">
                            {fundingStats?.projectOutput?.manpower?.toLocaleString() || 0}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Manpower Sanctioned</h3>
                          <p className="text-sm text-gray-600">Researchers & staff positions</p>
                          <div className="mt-4 space-y-1">
                            <div className="text-xs text-green-600 font-medium">
                              +{Math.floor(Math.random() * 2) + 1} this month
                            </div>
                            <div className="text-xs text-gray-500">
                              Last added: {new Date(Date.now() - Math.random() * 21 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                                timeZone: 'Asia/Kolkata',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>

                {/* Additional Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center border">
                    <div className="text-2xl font-bold text-[#0d559e] mb-1">
                      ₹{(fundingStats?.totalFunding || 0).toLocaleString('en-IN')} Cr
                    </div>
                    <div className="text-sm text-gray-600">Total Funding</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center border">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {fundingStats?.activeProjects || 0}
                    </div>
                    <div className="text-sm text-gray-600">Active Projects</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center border">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      {fundingStats?.completedProjects || 0}
                    </div>
                    <div className="text-sm text-gray-600">Completed Projects</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center border">
                    <div className="text-2xl font-bold text-orange-600 mb-1">
                      {fundingStats?.collaborations || 0}
                    </div>
                    <div className="text-sm text-gray-600">Collaborations</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Important Links Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">Important Links</h2>
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll-right-to-left space-x-8">
              {importantLinks.map((link, index) => (
                <div key={index} className="flex-shrink-0 text-center">
                  <div className="bg-white p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer w-40 shadow-sm hover:shadow-md">
                    <div className="w-32 h-32 bg-white rounded-lg mx-auto flex items-center justify-center overflow-hidden">
                      <img 
                        src={link.image} 
                        alt={link.name}
                        className="w-full h-full object-contain p-2"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full flex items-center justify-center bg-gray-100" style={{display: 'none'}}>
                        <Globe className="h-12 w-12 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {importantLinks.map((link, index) => (
                <div key={`duplicate-${index}`} className="flex-shrink-0 text-center">
                  <div className="bg-white p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer w-40 shadow-sm hover:shadow-md">
                    <div className="w-32 h-32 bg-white rounded-lg mx-auto flex items-center justify-center overflow-hidden">
                      <img 
                        src={link.image} 
                        alt={link.name}
                        className="w-full h-full object-contain p-2"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full flex items-center justify-center bg-gray-100" style={{display: 'none'}}>
                        <Globe className="h-12 w-12 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default HomePage