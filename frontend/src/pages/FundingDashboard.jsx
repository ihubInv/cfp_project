"use client"

import { useGetFundingStatsQuery } from "../store/api/publicApi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Badge } from "../components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Line,
  Area,
  AreaChart,
  Legend,
} from "recharts"
import { TrendingUp, DollarSign, Building, Award } from "lucide-react"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import { useState } from "react"

const FundingDashboard = () => {
  const [selectedYear, setSelectedYear] = useState("all")
  const { data: fundingData, isLoading, error } = useGetFundingStatsQuery()

  const formatCurrency = (amount) => {
    if (amount >= 1e9) {
      return `$${(amount / 1e9).toFixed(1)}B`
    } else if (amount >= 1e6) {
      return `$${(amount / 1e6).toFixed(1)}M`
    } else if (amount >= 1e3) {
      return `$${(amount / 1e3).toFixed(1)}K`
    }
    return `$${amount}`
  }

  const formatFullCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4", "#84CC16", "#F97316"]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading funding analytics...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-red-600">Error loading funding data. Please try again.</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Calculate summary statistics
  const totalFunding = fundingData?.fundingByProgram?.reduce((sum, item) => sum + item.totalFunding, 0) || 0
  const totalProjects = fundingData?.fundingByProgram?.reduce((sum, item) => sum + item.projectCount, 0) || 0
  const avgFunding = totalProjects > 0 ? totalFunding / totalProjects : 0
  const topProgram = fundingData?.fundingByProgram?.[0]

  // Prepare trend data for line chart
  const trendData =
    fundingData?.fundingTrends?.map((item) => ({
      period: `${item._id.year}-${String(item._id.month).padStart(2, "0")}`,
      year: item._id.year,
      month: item._id.month,
      funding: item.totalFunding,
      projects: item.projectCount,
    })) || []

  // Group trend data by year for better visualization
  const yearlyTrends = trendData.reduce((acc, item) => {
    const existing = acc.find((y) => y.year === item.year)
    if (existing) {
      existing.funding += item.funding
      existing.projects += item.projects
    } else {
      acc.push({
        year: item.year,
        funding: item.funding,
        projects: item.projects,
      })
    }
    return acc
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Funding Dashboard</h1>
          <p className="text-gray-600">Comprehensive analysis of research funding across programs and disciplines</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Funding</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatFullCurrency(totalFunding)}</div>
              <p className="text-xs text-muted-foreground">Across all programs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <Award className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProjects.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Funded projects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Funding</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatFullCurrency(avgFunding)}</div>
              <p className="text-xs text-muted-foreground">Per project</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Program</CardTitle>
              <Building className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold truncate">{topProgram?._id || "N/A"}</div>
              <p className="text-xs text-muted-foreground">
                {topProgram ? formatCurrency(topProgram.totalFunding) : "No data"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Funding Trends */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Funding Trends Over Time</CardTitle>
                <CardDescription>Annual funding distribution and project count</CardDescription>
              </div>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {yearlyTrends.map((item) => (
                    <SelectItem key={item.year} value={item.year.toString()}>
                      {item.year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={yearlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis yAxisId="funding" orientation="left" tickFormatter={formatCurrency} />
                <YAxis yAxisId="projects" orientation="right" />
                <Tooltip
                  formatter={(value, name) => [
                    name === "funding" ? formatFullCurrency(value) : value,
                    name === "funding" ? "Total Funding" : "Project Count",
                  ]}
                  labelFormatter={(year) => `Year: ${year}`}
                />
                <Legend />
                <Area
                  yAxisId="funding"
                  type="monotone"
                  dataKey="funding"
                  stackId="1"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.6}
                  name="funding"
                />
                <Line
                  yAxisId="projects"
                  type="monotone"
                  dataKey="projects"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                  name="projects"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Funding by Program */}
          <Card>
            <CardHeader>
              <CardTitle>Funding by Program</CardTitle>
              <CardDescription>Distribution of funding across different research programs</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={fundingData?.fundingByProgram?.slice(0, 8) || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" angle={-45} textAnchor="end" height={100} interval={0} fontSize={12} />
                  <YAxis tickFormatter={formatCurrency} />
                  <Tooltip
                    formatter={(value, name) => [
                      formatFullCurrency(value),
                      name === "totalFunding" ? "Total Funding" : name,
                    ]}
                    labelFormatter={(label) => `Program: ${label}`}
                  />
                  <Bar dataKey="totalFunding" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Funding by Discipline */}
          <Card>
            <CardHeader>
              <CardTitle>Funding by Discipline</CardTitle>
              <CardDescription>Research funding distribution across academic disciplines</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={fundingData?.fundingByDiscipline?.slice(0, 8) || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ _id, percent }) => `${_id}: ${(percent * 100).toFixed(1)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="totalFunding"
                  >
                    {(fundingData?.fundingByDiscipline || []).slice(0, 8).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [formatFullCurrency(value), "Total Funding"]} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Program Details Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Program Performance</CardTitle>
            <CardDescription>Detailed breakdown of funding and projects by program</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Program</th>
                    <th className="text-right py-3 px-4 font-medium">Total Funding</th>
                    <th className="text-right py-3 px-4 font-medium">Projects</th>
                    <th className="text-right py-3 px-4 font-medium">Avg. Funding</th>
                    <th className="text-center py-3 px-4 font-medium">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {fundingData?.fundingByProgram?.slice(0, 10).map((program, index) => (
                    <tr key={program._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{program._id}</td>
                      <td className="py-3 px-4 text-right">{formatFullCurrency(program.totalFunding)}</td>
                      <td className="py-3 px-4 text-right">{program.projectCount}</td>
                      <td className="py-3 px-4 text-right">{formatFullCurrency(program.avgFunding)}</td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={index < 3 ? "default" : index < 6 ? "secondary" : "outline"}>
                          {index < 3 ? "High" : index < 6 ? "Medium" : "Standard"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Discipline Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Discipline Analysis</CardTitle>
            <CardDescription>Research funding and project distribution by academic discipline</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={fundingData?.fundingByDiscipline?.slice(0, 10) || []}
                layout="horizontal"
                margin={{ left: 100 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={formatCurrency} />
                <YAxis type="category" dataKey="_id" width={100} />
                <Tooltip
                  formatter={(value, name) => [
                    name === "totalFunding" ? formatFullCurrency(value) : value,
                    name === "totalFunding" ? "Total Funding" : "Project Count",
                  ]}
                />
                <Bar dataKey="totalFunding" fill="#10B981" radius={[0, 4, 4, 0]} />
                <Bar dataKey="projectCount" fill="#F59E0B" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}

export default FundingDashboard
