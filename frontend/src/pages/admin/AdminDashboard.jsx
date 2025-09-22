"use client"

import { useGetDashboardStatsQuery } from "../../store/api/adminApi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Users, FolderOpen, FileText, Database, DollarSign, TrendingUp, Clock, CheckCircle } from "lucide-react"

const AdminDashboard = () => {
  const { data: stats, isLoading, error } = useGetDashboardStatsQuery()

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"]

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
        <p className="text-red-600">Error loading dashboard data. Please try again.</p>
      </div>
    )
  }

  const overviewCards = [
    {
      title: "Total Projects",
      value: stats?.overview?.totalProjects || 0,
      icon: FolderOpen,
      description: "Total projects",
      color: "text-blue-600",
    },
    {
      title: "Active Users",
      value: stats?.overview?.totalUsers || 0,
      icon: Users,
      description: "Registered users",
      color: "text-green-600",
    },
    {
      title: "Total Funding",
      value: formatCurrency(stats?.overview?.totalFunding || 0),
      icon: DollarSign,
      description: "Across all projects",
      color: "text-purple-600",
    },
  ]

  const statusCards = [
    {
      title: "Ongoing Projects",
      value: stats?.overview?.ongoingProjects || 0,
      icon: TrendingUp,
      color: "text-blue-600",
    },
    {
      title: "Completed Projects",
      value: stats?.overview?.completedProjects || 0,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Publications",
      value: stats?.overview?.totalPublications || 0,
      icon: FileText,
      color: "text-indigo-600",
    },
    {
      title: "Equipment Items",
      value: stats?.overview?.totalEquipment || 0,
      icon: Database,
      color: "text-cyan-600",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of system metrics and recent activity</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statusCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects by Discipline */}
        <Card>
          <CardHeader>
            <CardTitle>Projects by Discipline</CardTitle>
            <CardDescription>Distribution of validated projects across disciplines</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats?.charts?.projectsByDiscipline || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Projects by State */}
        <Card>
          <CardHeader>
            <CardTitle>Top States by Projects</CardTitle>
            <CardDescription>States with the most research projects</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats?.charts?.projectsByState || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ _id, count }) => `${_id}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {(stats?.charts?.projectsByState || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Funding Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Funding Trends by Year</CardTitle>
          <CardDescription>Total funding and project count over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats?.charts?.fundingByYear || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [
                  name === "totalFunding" ? formatCurrency(value) : value,
                  name === "totalFunding" ? "Total Funding" : "Project Count",
                ]}
              />
              <Bar dataKey="totalFunding" fill="#10B981" name="totalFunding" />
              <Bar dataKey="projectCount" fill="#3B82F6" name="projectCount" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Projects</CardTitle>
          <CardDescription>Latest validated projects in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats?.recentActivity?.recentProjects?.map((project) => (
              <div key={project._id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{project.title || "Untitled Project"}</h4>
                  <p className="text-sm text-gray-600">PI: {project.principalInvestigators?.[0]?.name || project.principalInvestigator?.name || "Unknown"}</p>
                  <p className="text-xs text-gray-500">
                    Created by: {project.createdBy?.firstName || ""} {project.createdBy?.lastName || ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(project.budget?.totalAmount || 0)}</p>
                  <p className="text-xs text-gray-500">{project.createdAt ? new Date(project.createdAt).toLocaleDateString() : "Unknown date"}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminDashboard
