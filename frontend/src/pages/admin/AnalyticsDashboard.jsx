"use client"

import { useState } from "react"
import { useGetDashboardStatsQuery } from "../../store/api/adminApi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
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
  ComposedChart,
  Area,
  AreaChart,
  Legend,
} from "recharts"
import { Download, TrendingUp, Users, FolderOpen, DollarSign } from "lucide-react"

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState("all")
  const [chartType, setChartType] = useState("bar")
  const { data: stats, isLoading, error } = useGetDashboardStatsQuery()

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

  const exportData = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Program,Total Funding,Project Count,Average Funding\n" +
      (stats?.charts?.projectsByDiscipline || [])
        .map((item) => `${item._id},${item.totalFunding || 0},${item.count},${(item.totalFunding || 0) / item.count}`)
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "analytics_data.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading analytics data. Please try again.</p>
      </div>
    )
  }

  // Enhanced metrics calculations
  const totalFunding = stats?.overview?.totalFunding || 0
  const totalProjects = stats?.overview?.totalProjects || 0
  const avgProjectValue = totalProjects > 0 ? totalFunding / totalProjects : 0
  const completionRate = totalProjects > 0 ? (stats?.overview?.completedProjects / totalProjects) * 100 : 0

  // Prepare enhanced chart data
  const enhancedFundingData =
    stats?.charts?.fundingByYear?.map((item) => ({
      year: item._id,
      funding: item.totalFunding,
      projects: item.projectCount,
      avgFunding: item.projectCount > 0 ? item.totalFunding / item.projectCount : 0,
      efficiency: item.totalFunding / 1000000 / item.projectCount, // Funding efficiency metric
    })) || []

  const disciplinePerformance =
    stats?.charts?.projectsByDiscipline?.map((item, index) => ({
      name: item._id,
      projects: item.count,
      funding: (totalFunding / totalProjects) * item.count, // Estimated funding
      color: COLORS[index % COLORS.length],
    })) || []

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
          <p className="text-gray-600">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportData} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatFullCurrency(totalFunding)}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span>+12.5% from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Project Portfolio</CardTitle>
            <FolderOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="text-xs">
                {stats?.overview?.ongoingProjects} Active
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {stats?.overview?.completedProjects} Complete
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Project Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatFullCurrency(avgProjectValue)}</div>
            <div className="text-xs text-muted-foreground">
              Range: {formatCurrency(50000)} - {formatCurrency(5000000)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">Project completion rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Multi-metric Funding Analysis */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Funding Performance Over Time</CardTitle>
                <CardDescription>Multi-dimensional analysis of funding trends</CardDescription>
              </div>
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="area">Area Chart</SelectItem>
                  <SelectItem value="composed">Combined</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              {chartType === "area" ? (
                <AreaChart data={enhancedFundingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis yAxisId="funding" orientation="left" tickFormatter={formatCurrency} />
                  <YAxis yAxisId="projects" orientation="right" />
                  <Tooltip
                    formatter={(value, name) => [
                      name.includes("funding") ? formatFullCurrency(value) : value,
                      name === "funding"
                        ? "Total Funding"
                        : name === "projects"
                          ? "Project Count"
                          : name === "avgFunding"
                            ? "Avg Funding"
                            : name,
                    ]}
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
                  />
                  <Area
                    yAxisId="funding"
                    type="monotone"
                    dataKey="avgFunding"
                    stackId="2"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.4}
                  />
                </AreaChart>
              ) : chartType === "composed" ? (
                <ComposedChart data={enhancedFundingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis yAxisId="funding" orientation="left" tickFormatter={formatCurrency} />
                  <YAxis yAxisId="projects" orientation="right" />
                  <Tooltip
                    formatter={(value, name) => [
                      name.includes("funding") ? formatFullCurrency(value) : value,
                      name === "funding"
                        ? "Total Funding"
                        : name === "projects"
                          ? "Project Count"
                          : name === "efficiency"
                            ? "Efficiency Score"
                            : name,
                    ]}
                  />
                  <Legend />
                  <Bar yAxisId="funding" dataKey="funding" fill="#3B82F6" />
                  <Line yAxisId="projects" type="monotone" dataKey="projects" stroke="#10B981" strokeWidth={3} />
                  <Line
                    yAxisId="projects"
                    type="monotone"
                    dataKey="efficiency"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </ComposedChart>
              ) : (
                <BarChart data={enhancedFundingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={formatCurrency} />
                  <Tooltip
                    formatter={(value, name) => [
                      formatFullCurrency(value),
                      name === "funding" ? "Total Funding" : "Average Funding",
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="funding" fill="#3B82F6" />
                  <Bar dataKey="avgFunding" fill="#10B981" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Discipline Performance Matrix */}
        <Card>
          <CardHeader>
            <CardTitle>Discipline Performance Matrix</CardTitle>
            <CardDescription>Project count vs estimated funding by discipline</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={disciplinePerformance.slice(0, 8)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, projects }) => `${name}: ${projects}`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="projects"
                >
                  {disciplinePerformance.slice(0, 8).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [value, name === "projects" ? "Project Count" : "Estimated Funding"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Geographic Impact Analysis</CardTitle>
          <CardDescription>Project distribution and funding across states</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={stats?.charts?.projectsByState?.slice(0, 15) || []}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" angle={-45} textAnchor="end" height={80} interval={0} />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [value, "Project Count"]}
                labelFormatter={(label) => `State: ${label}`}
              />
              <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]}>
                {(stats?.charts?.projectsByState || []).slice(0, 15).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Metrics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Performance Metrics</CardTitle>
          <CardDescription>Comprehensive breakdown of key performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Metric</th>
                  <th className="text-right py-3 px-4 font-medium">Current Value</th>
                  <th className="text-right py-3 px-4 font-medium">Target</th>
                  <th className="text-right py-3 px-4 font-medium">Performance</th>
                  <th className="text-center py-3 px-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">Total Projects</td>
                  <td className="py-3 px-4 text-right">{totalProjects}</td>
                  <td className="py-3 px-4 text-right">1,500</td>
                  <td className="py-3 px-4 text-right">{((totalProjects / 1500) * 100).toFixed(1)}%</td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant={totalProjects >= 1200 ? "default" : "secondary"}>
                      {totalProjects >= 1200 ? "On Track" : "Below Target"}
                    </Badge>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">Completion Rate</td>
                  <td className="py-3 px-4 text-right">{completionRate.toFixed(1)}%</td>
                  <td className="py-3 px-4 text-right">85%</td>
                  <td className="py-3 px-4 text-right">{((completionRate / 85) * 100).toFixed(1)}%</td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant={completionRate >= 75 ? "default" : "destructive"}>
                      {completionRate >= 75 ? "Good" : "Needs Improvement"}
                    </Badge>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">Average Project Value</td>
                  <td className="py-3 px-4 text-right">{formatFullCurrency(avgProjectValue)}</td>
                  <td className="py-3 px-4 text-right">$750,000</td>
                  <td className="py-3 px-4 text-right">{((avgProjectValue / 750000) * 100).toFixed(1)}%</td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant="default">Optimal</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AnalyticsDashboard
