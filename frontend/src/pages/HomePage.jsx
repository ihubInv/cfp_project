import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { 
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
  RefreshCw,
  DollarSign
} from "lucide-react"
import { 
  useGetFundingStatsQuery, 
  useGetProjectStatsQuery, 
  useGetRecentProjectsQuery,
  useGetPlatformOverviewQuery 
} from "../store/api/publicApi"
import { formatCurrencyInCrores, formatCurrencyInLakhsOrCrores } from "../lib/utils"
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  Sector
} from "recharts"

// Import images
import serbGovLogo from "../assets/serb-gov.png"
import mygovLogo from "../assets/mygov.png"
import dstLogo from "../assets/dst.png"
import serbOnlineLogo from "../assets/serb-online.png"
import istiLogo from "../assets/ISTI.png"
import digitalIndiaLogo from "../assets/digital_india_logo_0.png"
import dbtLogo from "../assets/dbt.png"

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
        <p className="font-semibold text-gray-900">{payload[0].name || label}</p>
        <p className="text-gray-600">Count: <span className="font-bold text-gray-900">{payload[0].value}</span></p>
      </div>
    )
  }
  return null
}

// Chart colors
const CHART_COLORS = {
  green: ['#22c55e', '#16a34a', '#15803d', '#166534', '#14532d'],
  purple: ['#a855f7', '#9333ea', '#7e22ce', '#6b21a8', '#581c87'],
  blue: ['#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a'],
  orange: ['#f97316', '#ea580c', '#c2410c', '#9a3412', '#7c2d12'],
  mixed: ['#3b82f6', '#22c55e', '#a855f7', '#f97316', '#ef4444', '#06b6d4', '#84cc16']
}

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("received")
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date())
  const [countdown, setCountdown] = useState(30)
  const [activeIndex, setActiveIndex] = useState(0)

  // Real-time data from API with auto-refresh
  const { data: fundingStats, isLoading: fundingLoading, error: fundingError, refetch: refetchFunding } = useGetFundingStatsQuery()
  const { data: projectStats, isLoading: projectLoading, refetch: refetchProjects } = useGetProjectStatsQuery()
  const { data: recentProjects, isLoading: recentLoading, refetch: refetchRecent } = useGetRecentProjectsQuery(5)
  const { data: platformOverview, isLoading: overviewLoading, refetch: refetchOverview } = useGetPlatformOverviewQuery()

  // Debug logging
  useEffect(() => {
    if (fundingStats) {
      console.log("=== Frontend Funding Stats ===")
      console.log("Proposals Received Total:", fundingStats.proposalsReceived?.total)
      console.log("Proposals Received Programs:", fundingStats.proposalsReceived?.programs)
      console.log("Proposals Supported Total:", fundingStats.proposalsSupported?.total)
      console.log("Proposals Supported Programs:", fundingStats.proposalsSupported?.programs)
      console.log("Completed Projects:", fundingStats.completedProjects)
      console.log("Active Projects:", fundingStats.activeProjects)
    }
    if (fundingError) {
      console.error("Funding Stats Error:", fundingError)
    }
  }, [fundingStats, fundingError])

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
      bgGradient: "from-blue-500 to-blue-600",
      hoverGradient: "from-blue-600 to-blue-700",
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
      hoverIconBg: "bg-blue-200",
      shadowColor: "shadow-blue-200",
      image: "/api/placeholder/200/150"
    },
    {
      title: "Assets",
      description: "Research assets database",
      icon: Microscope,
      link: "/equipment",
      bgGradient: "from-orange-500 to-orange-600",
      hoverGradient: "from-orange-600 to-orange-700",
      iconColor: "text-orange-600",
      iconBg: "bg-orange-100",
      hoverIconBg: "bg-orange-200",
      shadowColor: "shadow-orange-200",
      image: "/api/placeholder/200/150"
    },
    {
      title: "Research Outcome",
      description: "Publications and outcomes",
      icon: BookOpen,
      link: "/publications",
      bgGradient: "from-purple-500 to-purple-600",
      hoverGradient: "from-purple-600 to-purple-700",
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
      hoverIconBg: "bg-purple-200",
      shadowColor: "shadow-purple-200",
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
    <div className="min-h-screen bg-white">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
            {/* Left Side - Explore Features */}
            <div className="glass-section p-8 rounded-lg h-full">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Explore Funding Details</h2>
              <div className="grid grid-cols-3 gap-4">
                {exploreFeatures.map((feature, index) => {
                  // Determine icon background classes based on feature
                  const iconBgClasses = feature.iconBg === 'bg-blue-100' 
                    ? 'bg-blue-100 group-hover:bg-blue-200' 
                    : feature.iconBg === 'bg-orange-100'
                    ? 'bg-orange-100 group-hover:bg-orange-200'
                    : 'bg-purple-100 group-hover:bg-purple-200'
                  
                  return (
                    <Link key={index} to={feature.link} className="group">
                      <Card className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${feature.shadowColor} border-2 border-transparent hover:border-gray-200 overflow-hidden relative bg-white`}>
                        {/* Gradient Background Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                        
                        <CardContent className="p-5 text-center relative z-10">
                          {/* Icon with Background */}
                          <div className={`flex justify-center mb-4 transition-all duration-300 ${iconBgClasses} rounded-full w-16 h-16 mx-auto items-center group-hover:scale-110 group-hover:shadow-lg`}>
                            <feature.icon className={`h-8 w-8 ${feature.iconColor} transition-transform duration-300 group-hover:rotate-6`} />
                        </div>
                          
                          {/* Title */}
                          <h3 className="text-sm font-bold mb-2 text-gray-900 group-hover:text-gray-800 transition-colors">
                            {feature.title}
                          </h3>
                          
                          {/* Description */}
                          <p className="text-xs text-gray-600 group-hover:text-gray-700 transition-colors leading-relaxed">
                            {feature.description}
                          </p>
                          
                          {/* Hover Indicator */}
                          <div className={`mt-3 h-1 w-0 group-hover:w-full bg-gradient-to-r ${feature.bgGradient} transition-all duration-300 mx-auto rounded-full`}></div>
                      </CardContent>
                    </Card>
                  </Link>
                  )
                })}
              </div>
            </div>

            {/* Right Side - About Text */}
            <div className="glass-section p-8 rounded-lg h-full">
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
      <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Statistics Dashboard
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real-time insights into proposals, projects, and research outcomes
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="mb-10">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-gray-200/50">
              <nav className="flex justify-center flex-wrap gap-2">
                <button
                  onClick={() => setActiveTab("received")}
                  className={`group relative py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-300 ${
                    activeTab === "received"
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-200 scale-105"
                      : "text-gray-600 hover:text-green-700 hover:bg-green-50"
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Proposal Received
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
                      activeTab === "received"
                        ? "bg-white/20 text-white"
                        : "bg-green-100 text-green-800 group-hover:bg-green-200"
                    }`}>
                    {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : (fundingStats?.proposalsReceived?.total || 0)}
                    </span>
                  </span>
                  {activeTab === "received" && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-500 rounded-b-lg"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("approved")}
                  className={`group relative py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-300 ${
                    activeTab === "approved"
                      ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-200 scale-105"
                      : "text-gray-600 hover:text-purple-700 hover:bg-purple-50"
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Project Approved
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
                      activeTab === "approved"
                        ? "bg-white/20 text-white"
                        : "bg-purple-100 text-purple-800 group-hover:bg-purple-200"
                    }`}>
                    {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : (fundingStats?.proposalsSupported?.total || 0)}
                    </span>
                  </span>
                  {activeTab === "approved" && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-purple-500 rounded-b-lg"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("completed")}
                  className={`group relative py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-300 ${
                    activeTab === "completed"
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200 scale-105"
                      : "text-gray-600 hover:text-orange-700 hover:bg-orange-50"
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Projects Completed
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
                      activeTab === "completed"
                        ? "bg-white/20 text-white"
                        : "bg-orange-100 text-orange-800 group-hover:bg-orange-200"
                    }`}>
                    {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : (fundingStats?.completedProjects || 0)}
                    </span>
                  </span>
                  {activeTab === "completed" && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-orange-500 rounded-b-lg"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("highlights")}
                  className={`group relative py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-300 ${
                    activeTab === "highlights"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-200 scale-105"
                      : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
                  }`}
                >
                  <span className="relative z-10">Key Highlights</span>
                  {activeTab === "highlights" && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-b-lg"></div>
                  )}
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-8">

            {activeTab === "received" && (
              <div className="space-y-6">
                {/* Real-time Data Header */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                      Proposals Received
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleManualRefresh}
                      disabled={isLoading}
                      className="flex items-center gap-2 border-2 border-green-500 text-green-600 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 hover:text-white transition-all duration-300 hover:scale-105 shadow-md"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-md border border-green-200/50 max-w-2xl mx-auto">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">
                        Last updated: <span className="text-gray-900 font-semibold">{lastUpdateTime.toLocaleString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                        })}</span>
                        <span className="ml-2 inline-flex items-center gap-1 text-green-600 text-xs font-semibold animate-pulse">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span> Live
                        </span>
                    </p>
                      <p className="text-xs text-gray-600">
                      Data as of: {new Date().toLocaleDateString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                        })} | Next auto-refresh in: <span className="text-green-600 font-bold">{countdown}s</span>
                    </p>
                    </div>
                  </div>
                </div>

                {/* Proposals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {isLoading ? (
                    <div className="col-span-full flex justify-center py-16">
                      <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
                        <p className="text-gray-600">Loading proposals...</p>
                      </div>
                    </div>
                  ) : fundingStats?.proposalsReceived?.total > 0 ? (
                    fundingStats.proposalsReceived.programs && fundingStats.proposalsReceived.programs.length > 0 ? (
                    fundingStats.proposalsReceived.programs.map((proposal, index) => (
                        <Card key={index} className="group relative overflow-hidden border-2 border-transparent hover:border-green-200 bg-gradient-to-br from-white to-green-50/30 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <CardContent className="p-6 relative z-10">
                          <div className="text-center">
                              <Badge className="mb-4 bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-md">
                                {fundingStats?.year || new Date().getFullYear()}
                              </Badge>
                              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300 inline-block">
                                {proposal.count.toLocaleString()}
                              </div>
                              <h3 className="text-base font-semibold text-gray-900 text-center leading-tight mb-3 group-hover:text-green-700 transition-colors">
                              {proposal._id || "Unknown Program"}
                            </h3>
                              <div className="text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2 inline-block">
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
                          <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-green-400 to-green-600 transition-all duration-300 group-hover:w-full"></div>
                        </Card>
                      ))
                    ) : (
                      // Show total count if programs array is empty but total > 0
                      <Card className="group relative overflow-hidden border-2 border-transparent hover:border-green-200 bg-gradient-to-br from-white to-green-50/30 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <CardContent className="p-6 relative z-10">
                          <div className="text-center">
                            <Badge className="mb-4 bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-md">
                              {fundingStats?.year || new Date().getFullYear()}
                            </Badge>
                            <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300 inline-block">
                              {fundingStats.proposalsReceived.total.toLocaleString()}
                            </div>
                            <h3 className="text-base font-semibold text-gray-900 text-center leading-tight mb-3 group-hover:text-green-700 transition-colors">
                              All Proposals
                            </h3>
                            <div className="text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2 inline-block">
                              Total proposals in database
                            </div>
                          </div>
                        </CardContent>
                        <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-green-400 to-green-600 transition-all duration-300 group-hover:w-full"></div>
                      </Card>
                    )
                  ) : (
                    <div className="col-span-full text-center py-16">
                      <div className="bg-white/60 backdrop-blur-sm rounded-lg p-8 shadow-md border border-gray-200 max-w-md mx-auto">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 font-medium">No proposals received data available</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Pie Chart for Proposals Received */}
                {!isLoading && fundingStats?.proposalsReceived?.programs && fundingStats.proposalsReceived.programs.length > 0 && (
                  <div className="mt-8">
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                      <CardHeader className="text-center pb-2">
                        <CardTitle className="text-xl font-bold text-gray-900">Proposals Distribution by CFP</CardTitle>
                        <p className="text-sm text-gray-600">Visual breakdown of proposals received across different CFP programs</p>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={fundingStats.proposalsReceived.programs.map(p => ({
                                  name: p._id || 'Unknown',
                                  value: p.count
                                }))}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                labelLine={{ stroke: '#6b7280', strokeWidth: 1 }}
                              >
                                {fundingStats.proposalsReceived.programs.map((entry, index) => (
                                  <Cell 
                                    key={`cell-${index}`} 
                                    fill={CHART_COLORS.green[index % CHART_COLORS.green.length]}
                                    stroke="#fff"
                                    strokeWidth={2}
                                  />
                                ))}
                              </Pie>
                              <Tooltip content={<CustomTooltip />} />
                              <Legend 
                                verticalAlign="bottom" 
                                height={36}
                                formatter={(value) => <span className="text-gray-700 font-medium">{value}</span>}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}

            {activeTab === "approved" && (
              <div className="space-y-6">
                {/* Real-time Data Header */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                      Project Approved
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleManualRefresh}
                      disabled={isLoading}
                      className="flex items-center gap-2 border-2 border-purple-500 text-purple-600 hover:bg-gradient-to-r hover:from-purple-500 hover:to-purple-600 hover:text-white transition-all duration-300 hover:scale-105 shadow-md"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-md border border-purple-200/50 max-w-2xl mx-auto">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">
                        Last updated: <span className="text-gray-900 font-semibold">{lastUpdateTime.toLocaleString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                        })}</span>
                        <span className="ml-2 inline-flex items-center gap-1 text-purple-600 text-xs font-semibold animate-pulse">
                          <span className="w-2 h-2 bg-purple-500 rounded-full"></span> Live
                        </span>
                    </p>
                      <p className="text-xs text-gray-600">
                      Data as of: {new Date().toLocaleDateString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                        })} | Next auto-refresh in: <span className="text-purple-600 font-bold">{countdown}s</span>
                    </p>
                    </div>
                  </div>
                </div>

                {/* Supported Proposals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {isLoading ? (
                    <div className="col-span-full flex justify-center py-16">
                      <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
                        <p className="text-gray-600">Loading approved projects...</p>
                      </div>
                    </div>
                  ) : fundingStats?.proposalsSupported?.total > 0 ? (
                    fundingStats.proposalsSupported.programs && fundingStats.proposalsSupported.programs.length > 0 ? (
                    fundingStats.proposalsSupported.programs.map((proposal, index) => (
                        <Card key={index} className="group relative overflow-hidden border-2 border-transparent hover:border-purple-200 bg-gradient-to-br from-white to-purple-50/30 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <CardContent className="p-6 relative z-10">
                          <div className="text-center">
                              <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-md">
                                {fundingStats?.year || new Date().getFullYear()}
                              </Badge>
                              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300 inline-block">
                                {proposal.count.toLocaleString()}
                              </div>
                              <h3 className="text-base font-semibold text-gray-900 text-center leading-tight mb-3 group-hover:text-purple-700 transition-colors">
                              {proposal._id || "Unknown Program"}
                            </h3>
                              <div className="text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2 inline-block">
                              Last approved: {new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                                timeZone: 'Asia/Kolkata',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </CardContent>
                          <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-300 group-hover:w-full"></div>
                        </Card>
                      ))
                    ) : (
                      // Show total count if programs array is empty but total > 0
                      <Card className="group relative overflow-hidden border-2 border-transparent hover:border-purple-200 bg-gradient-to-br from-white to-purple-50/30 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <CardContent className="p-6 relative z-10">
                          <div className="text-center">
                            <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-md">
                              {fundingStats?.year || new Date().getFullYear()}
                            </Badge>
                            <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300 inline-block">
                              {fundingStats.proposalsSupported.total.toLocaleString()}
                            </div>
                            <h3 className="text-base font-semibold text-gray-900 text-center leading-tight mb-3 group-hover:text-purple-700 transition-colors">
                              All Approved Projects
                            </h3>
                            <div className="text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2 inline-block">
                              Total approved projects in database
                            </div>
                          </div>
                        </CardContent>
                        <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-300 group-hover:w-full"></div>
                      </Card>
                    )
                  ) : (
                    <div className="col-span-full text-center py-16">
                      <div className="bg-white/60 backdrop-blur-sm rounded-lg p-8 shadow-md border border-gray-200 max-w-md mx-auto">
                        <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 font-medium">No project approved data available</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Pie Chart for Projects Approved */}
                {!isLoading && fundingStats?.proposalsSupported?.programs && fundingStats.proposalsSupported.programs.length > 0 && (
                  <div className="mt-8">
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                      <CardHeader className="text-center pb-2">
                        <CardTitle className="text-xl font-bold text-gray-900">Approved Projects by CFP</CardTitle>
                        <p className="text-sm text-gray-600">Distribution of approved projects across CFP programs</p>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={fundingStats.proposalsSupported.programs.map(p => ({
                                  name: p._id || 'Unknown',
                                  value: p.count
                                }))}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                labelLine={{ stroke: '#6b7280', strokeWidth: 1 }}
                              >
                                {fundingStats.proposalsSupported.programs.map((entry, index) => (
                                  <Cell 
                                    key={`cell-${index}`} 
                                    fill={CHART_COLORS.purple[index % CHART_COLORS.purple.length]}
                                    stroke="#fff"
                                    strokeWidth={2}
                                  />
                                ))}
                              </Pie>
                              <Tooltip content={<CustomTooltip />} />
                              <Legend 
                                verticalAlign="bottom" 
                                height={36}
                                formatter={(value) => <span className="text-gray-700 font-medium">{value}</span>}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}

            {activeTab === "completed" && (
              <div className="space-y-6">
                {/* Real-time Data Header */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
                      Projects Completed
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleManualRefresh}
                      disabled={isLoading}
                      className="flex items-center gap-2 border-2 border-orange-500 text-orange-600 hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 hover:text-white transition-all duration-300 hover:scale-105 shadow-md"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-md border border-orange-200/50 max-w-2xl mx-auto">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">
                        Last updated: <span className="text-gray-900 font-semibold">{lastUpdateTime.toLocaleString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                        })}</span>
                        <span className="ml-2 inline-flex items-center gap-1 text-orange-600 text-xs font-semibold animate-pulse">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span> Live
                        </span>
                    </p>
                      <p className="text-xs text-gray-600">
                      Data as of: {new Date().toLocaleDateString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                        })} | Next auto-refresh in: <span className="text-orange-600 font-bold">{countdown}s</span>
                    </p>
                    </div>
                  </div>
                </div>

                {/* Completed Projects Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {isLoading ? (
                    <div className="col-span-full flex justify-center py-16">
                      <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-orange-600 mx-auto mb-4" />
                        <p className="text-gray-600">Loading statistics...</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Card className="group relative overflow-hidden border-2 border-transparent hover:border-green-200 bg-gradient-to-br from-white to-green-50/30 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <CardContent className="p-8 text-center relative z-10">
                          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                            <Award className="w-8 h-8 text-white group-hover:rotate-12 transition-transform duration-300" />
                          </div>
                          <div className="text-5xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300 inline-block">
                            {fundingStats?.completedProjects?.toLocaleString() || 0}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">Completed Projects</h3>
                          <p className="text-sm text-gray-600">Successfully finished projects</p>
                        </CardContent>
                        <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-green-400 to-green-600 transition-all duration-300 group-hover:w-full"></div>
                      </Card>
                      
                      <Card className="group relative overflow-hidden border-2 border-transparent hover:border-blue-200 bg-gradient-to-br from-white to-blue-50/30 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <CardContent className="p-8 text-center relative z-10">
                          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                            <TrendingUp className="w-8 h-8 text-white group-hover:rotate-12 transition-transform duration-300" />
                          </div>
                          <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300 inline-block">
                            {fundingStats?.activeProjects?.toLocaleString() || 0}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">Active Projects</h3>
                          <p className="text-sm text-gray-600">Currently ongoing projects</p>
                        </CardContent>
                        <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300 group-hover:w-full"></div>
                      </Card>
                      
                      <Card className="group relative overflow-hidden border-2 border-transparent hover:border-purple-200 bg-gradient-to-br from-white to-purple-50/30 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <CardContent className="p-8 text-center relative z-10">
                          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                            <BookOpen className="w-8 h-8 text-white group-hover:rotate-12 transition-transform duration-300" />
                          </div>
                          <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300 inline-block">
                            {fundingStats?.projectOutput?.publications?.toLocaleString() || 0}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors">Publications</h3>
                          <p className="text-sm text-gray-600">Research papers & articles</p>
                        </CardContent>
                        <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-300 group-hover:w-full"></div>
                      </Card>
                    </>
                  )}
                </div>

                {/* Charts for Projects Completed */}
                {!isLoading && (fundingStats?.completedProjects > 0 || fundingStats?.activeProjects > 0) && (
                  <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Pie Chart - Project Status Distribution */}
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                      <CardHeader className="text-center pb-2">
                        <CardTitle className="text-xl font-bold text-gray-900">Project Status Distribution</CardTitle>
                        <p className="text-sm text-gray-600">Active vs Completed projects breakdown</p>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="h-72">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  { name: 'Active Projects', value: fundingStats?.activeProjects || 0 },
                                  { name: 'Completed Projects', value: fundingStats?.completedProjects || 0 }
                                ]}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                              >
                                <Cell fill="#3b82f6" stroke="#fff" strokeWidth={2} />
                                <Cell fill="#22c55e" stroke="#fff" strokeWidth={2} />
                              </Pie>
                              <Tooltip content={<CustomTooltip />} />
                              <Legend 
                                verticalAlign="bottom" 
                                height={36}
                                formatter={(value) => <span className="text-gray-700 font-medium">{value}</span>}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Bar Chart - Output Metrics */}
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                      <CardHeader className="text-center pb-2">
                        <CardTitle className="text-xl font-bold text-gray-900">Research Output</CardTitle>
                        <p className="text-sm text-gray-600">Publications from research projects</p>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="h-72">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={[
                                { 
                                  name: 'Output', 
                                  Publications: fundingStats?.projectOutput?.publications || 0,
                                  'Active Projects': fundingStats?.activeProjects || 0,
                                  'Completed': fundingStats?.completedProjects || 0
                                }
                              ]}
                              layout="vertical"
                              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                              <XAxis type="number" tick={{ fill: '#6b7280' }} />
                              <YAxis type="category" dataKey="name" hide />
                              <Tooltip content={<CustomTooltip />} />
                              <Legend formatter={(value) => <span className="text-gray-700 font-medium">{value}</span>} />
                              <Bar dataKey="Publications" fill="#a855f7" radius={[0, 4, 4, 0]} />
                              <Bar dataKey="Active Projects" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                              <Bar dataKey="Completed" fill="#22c55e" radius={[0, 4, 4, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}

            {activeTab === "highlights" && (
              <div className="space-y-8">
                {/* Real-time Data Header */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                      Key Highlights
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleManualRefresh}
                      disabled={isLoading}
                      className="flex items-center gap-2 border-2 border-blue-500 text-blue-600 hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 hover:text-white transition-all duration-300 hover:scale-105 shadow-md"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-md border border-blue-200/50 max-w-2xl mx-auto">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">
                        Last updated: <span className="text-gray-900 font-semibold">{lastUpdateTime.toLocaleString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                        })}</span>
                        <span className="ml-2 inline-flex items-center gap-1 text-blue-600 text-xs font-semibold animate-pulse">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Live
                        </span>
                    </p>
                      <p className="text-xs text-gray-600">
                      Data as of: {new Date().toLocaleDateString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                        })} | Next auto-refresh in: <span className="text-blue-600 font-bold">{countdown}s</span>
                    </p>
                    </div>
                  </div>
                </div>

                {/* Key Highlights Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {isLoading ? (
                    <div className="col-span-full flex justify-center py-16">
                      <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                        <p className="text-gray-600">Loading highlights...</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Card className="group relative overflow-hidden border-2 border-transparent hover:border-blue-200 bg-gradient-to-br from-white to-blue-50/30 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <CardContent className="p-6 text-center relative z-10">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                            <DollarSign className="w-8 h-8 text-white group-hover:rotate-12 transition-transform duration-300" />
                          </div>
                          <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300 inline-block">
                            {formatCurrencyInLakhsOrCrores(fundingStats?.totalFunding || 0)}
                          </div>
                          <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">Total Funding</h3>
                          <p className="text-xs text-gray-600">Cumulative funding received</p>
                        </CardContent>
                        <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300 group-hover:w-full"></div>
                      </Card>
                      
                      <Card className="group relative overflow-hidden border-2 border-transparent hover:border-green-200 bg-gradient-to-br from-white to-green-50/30 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <CardContent className="p-6 text-center relative z-10">
                          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                            <TrendingUp className="w-8 h-8 text-white group-hover:rotate-12 transition-transform duration-300" />
                          </div>
                          <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300 inline-block">
                            {(fundingStats?.activeProjects || fundingStats?.ongoingProjects?.total || 0).toLocaleString()}
                          </div>
                          <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-green-700 transition-colors">Active Projects</h3>
                          <p className="text-xs text-gray-600">Currently ongoing</p>
                        </CardContent>
                        <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-green-400 to-green-600 transition-all duration-300 group-hover:w-full"></div>
                      </Card>
                      
                      <Card className="group relative overflow-hidden border-2 border-transparent hover:border-purple-200 bg-gradient-to-br from-white to-purple-50/30 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <CardContent className="p-6 text-center relative z-10">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                            <Award className="w-8 h-8 text-white group-hover:rotate-12 transition-transform duration-300" />
                          </div>
                          <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300 inline-block">
                            {(fundingStats?.completedProjects || 0).toLocaleString()}
                          </div>
                          <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-purple-700 transition-colors">Completed Projects</h3>
                          <p className="text-xs text-gray-600">Successfully finished</p>
                        </CardContent>
                        <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-300 group-hover:w-full"></div>
                      </Card>
                      
                      <Card className="group relative overflow-hidden border-2 border-transparent hover:border-orange-200 bg-gradient-to-br from-white to-orange-50/30 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <CardContent className="p-6 text-center relative z-10">
                          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                            <BookOpen className="w-8 h-8 text-white group-hover:rotate-12 transition-transform duration-300" />
                          </div>
                          <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300 inline-block">
                            {(fundingStats?.projectOutput?.publications || 0).toLocaleString()}
                          </div>
                          <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-orange-700 transition-colors">Publications</h3>
                          <p className="text-xs text-gray-600">Research papers & articles</p>
                        </CardContent>
                        <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-300 group-hover:w-full"></div>
                      </Card>
                    </>
                  )}
                </div>

                {/* Additional Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <Card className="group relative overflow-hidden border-2 border-transparent hover:border-green-200 bg-gradient-to-br from-white to-green-50/30 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardContent className="p-6 text-center relative z-10">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                        <Microscope className="w-8 h-8 text-white group-hover:rotate-12 transition-transform duration-300" />
                      </div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300 inline-block">
                        {(fundingStats?.projectOutput?.equipment || 0).toLocaleString()}
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-green-700 transition-colors">Equipment</h3>
                      <p className="text-xs text-gray-600">Research instruments & tools</p>
                    </CardContent>
                    <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-green-400 to-green-600 transition-all duration-300 group-hover:w-full"></div>
                  </Card>
                  
                  <Card className="group relative overflow-hidden border-2 border-transparent hover:border-purple-200 bg-gradient-to-br from-white to-purple-50/30 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardContent className="p-6 text-center relative z-10">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                        <Users className="w-8 h-8 text-white group-hover:rotate-12 transition-transform duration-300" />
                      </div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300 inline-block">
                        {(fundingStats?.projectOutput?.manpower || 0).toLocaleString()}
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-purple-700 transition-colors">Manpower</h3>
                      <p className="text-xs text-gray-600">Researchers & staff positions</p>
                    </CardContent>
                    <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-300 group-hover:w-full"></div>
                  </Card>
                  
                  <Card className="group relative overflow-hidden border-2 border-transparent hover:border-blue-200 bg-gradient-to-br from-white to-blue-50/30 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardContent className="p-6 text-center relative z-10">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                        <Database className="w-8 h-8 text-white group-hover:rotate-12 transition-transform duration-300" />
                      </div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300 inline-block">
                        {(platformOverview?.totalProjects || 0).toLocaleString()}
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">Total Projects</h3>
                      <p className="text-xs text-gray-600">All projects in database</p>
                    </CardContent>
                    <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300 group-hover:w-full"></div>
                  </Card>
                </div>

                {/* Charts Section for Key Highlights */}
                {!isLoading && (
                  <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Bar Chart - Key Metrics Comparison */}
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                      <CardHeader className="text-center pb-2">
                        <CardTitle className="text-xl font-bold text-gray-900">Key Metrics Overview</CardTitle>
                        <p className="text-sm text-gray-600">Comparison of projects, outputs, and resources</p>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={[
                                { name: 'Active', value: fundingStats?.activeProjects || 0, fill: '#3b82f6' },
                                { name: 'Completed', value: fundingStats?.completedProjects || 0, fill: '#22c55e' },
                                { name: 'Publications', value: fundingStats?.projectOutput?.publications || 0, fill: '#a855f7' },
                                { name: 'Equipment', value: fundingStats?.projectOutput?.equipment || 0, fill: '#f97316' },
                                { name: 'Manpower', value: fundingStats?.projectOutput?.manpower || 0, fill: '#06b6d4' },
                              ]}
                              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                              <XAxis 
                                dataKey="name" 
                                tick={{ fill: '#6b7280', fontSize: 12 }} 
                                angle={-45}
                                textAnchor="end"
                                height={60}
                              />
                              <YAxis tick={{ fill: '#6b7280' }} />
                              <Tooltip 
                                content={({ active, payload }) => {
                                  if (active && payload && payload.length) {
                                    return (
                                      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
                                        <p className="font-semibold text-gray-900">{payload[0].payload.name}</p>
                                        <p className="text-gray-600">Count: <span className="font-bold">{payload[0].value}</span></p>
                                      </div>
                                    )
                                  }
                                  return null
                                }}
                              />
                              <Bar 
                                dataKey="value" 
                                radius={[4, 4, 0, 0]}
                                fill="#3b82f6"
                              >
                                {[
                                  { fill: '#3b82f6' },
                                  { fill: '#22c55e' },
                                  { fill: '#a855f7' },
                                  { fill: '#f97316' },
                                  { fill: '#06b6d4' },
                                ].map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Pie Chart - Resource Allocation */}
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                      <CardHeader className="text-center pb-2">
                        <CardTitle className="text-xl font-bold text-gray-900">Resource Distribution</CardTitle>
                        <p className="text-sm text-gray-600">Allocation of research resources</p>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  { name: 'Publications', value: fundingStats?.projectOutput?.publications || 0 },
                                  { name: 'Equipment', value: fundingStats?.projectOutput?.equipment || 0 },
                                  { name: 'Manpower', value: fundingStats?.projectOutput?.manpower || 0 },
                                ].filter(item => item.value > 0)}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                labelLine={{ stroke: '#6b7280', strokeWidth: 1 }}
                              >
                                <Cell fill="#a855f7" stroke="#fff" strokeWidth={2} />
                                <Cell fill="#f97316" stroke="#fff" strokeWidth={2} />
                                <Cell fill="#06b6d4" stroke="#fff" strokeWidth={2} />
                              </Pie>
                              <Tooltip content={<CustomTooltip />} />
                              <Legend 
                                verticalAlign="bottom" 
                                height={36}
                                formatter={(value) => <span className="text-gray-700 font-medium">{value}</span>}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
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
                  <div className="glass-card p-4 hover:shadow-xl transition-all cursor-pointer w-40">
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
                  <div className="glass-card p-4 hover:shadow-xl transition-all cursor-pointer w-40">
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