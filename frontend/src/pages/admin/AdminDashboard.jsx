"use client"

import { useNavigate } from "react-router-dom"
import { useGetDashboardStatsQuery } from "../../store/api/adminApi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Users, FolderOpen, FileText, Database, DollarSign, TrendingUp, Clock, CheckCircle } from "lucide-react"

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { data: stats, isLoading, error } = useGetDashboardStatsQuery()

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
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
      bgGradient: "from-blue-500 to-blue-600",
      hoverGradient: "from-blue-600 to-blue-700",
      iconBg: "bg-blue-100",
      hoverIconBg: "bg-blue-200",
      shadowColor: "shadow-blue-200",
    },
    {
      title: "Active Users",
      value: stats?.overview?.totalUsers || 0,
      icon: Users,
      description: "Registered users",
      color: "text-green-600",
      bgGradient: "from-green-500 to-green-600",
      hoverGradient: "from-green-600 to-green-700",
      iconBg: "bg-green-100",
      hoverIconBg: "bg-green-200",
      shadowColor: "shadow-green-200",
    },
    {
      title: "Total Funding (INR)",
      value: `${stats?.overview?.totalFunding || 0} Cr`,
      icon: DollarSign,
      description: "Across all projects",
      color: "text-purple-600",
      bgGradient: "from-purple-500 to-purple-600",
      hoverGradient: "from-purple-600 to-purple-700",
      iconBg: "bg-purple-100",
      hoverIconBg: "bg-purple-200",
      shadowColor: "shadow-purple-200",
    },
  ]

  const statusCards = [
    {
      title: "Ongoing Projects",
      value: stats?.overview?.ongoingProjects || 0,
      icon: TrendingUp,
      color: "text-blue-600",
      bgGradient: "from-blue-500 to-blue-600",
      hoverGradient: "from-blue-600 to-blue-700",
      iconBg: "bg-blue-100",
      hoverIconBg: "bg-blue-200",
      shadowColor: "shadow-blue-200",
      clickable: true,
      onClick: () => navigate("/admin/projects?validationStatus=Ongoing"),
    },
    {
      title: "Completed Projects",
      value: stats?.overview?.completedProjects || 0,
      icon: CheckCircle,
      color: "text-green-600",
      bgGradient: "from-green-500 to-green-600",
      hoverGradient: "from-green-600 to-green-700",
      iconBg: "bg-green-100",
      hoverIconBg: "bg-green-200",
      shadowColor: "shadow-green-200",
      clickable: true,
      onClick: () => navigate("/admin/projects?validationStatus=Completed"),
    },
    {
      title: "Publications",
      value: stats?.overview?.totalPublications || 0,
      icon: FileText,
      color: "text-indigo-600",
      bgGradient: "from-indigo-500 to-indigo-600",
      hoverGradient: "from-indigo-600 to-indigo-700",
      iconBg: "bg-indigo-100",
      hoverIconBg: "bg-indigo-200",
      shadowColor: "shadow-indigo-200",
    },
    {
      title: "Equipment Items",
      value: stats?.overview?.totalEquipment || 0,
      icon: Database,
      color: "text-cyan-600",
      bgGradient: "from-cyan-500 to-cyan-600",
      hoverGradient: "from-cyan-600 to-cyan-700",
      iconBg: "bg-cyan-100",
      hoverIconBg: "bg-cyan-200",
      shadowColor: "shadow-cyan-200",
    },
  ]

  return (
    <div className="space-y-6 bg-gradient-to-br from-gray-50 to-white min-h-screen p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 text-lg">Overview of system metrics and recent activity</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {overviewCards.map((card, index) => {
          const iconBgClasses = card.iconBg === 'bg-blue-100' 
            ? 'bg-blue-100 group-hover:bg-blue-200' 
            : card.iconBg === 'bg-green-100'
            ? 'bg-green-100 group-hover:bg-green-200'
            : 'bg-purple-100 group-hover:bg-purple-200'
          
          return (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-gray-200 overflow-hidden relative bg-gradient-to-br from-white to-gray-50/50">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.bgGradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-bl-full`}></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">{card.title}</CardTitle>
                <div className={`${iconBgClasses} rounded-full p-2 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                  <card.icon className={`h-5 w-5 ${card.color} group-hover:rotate-12 transition-transform duration-300`} />
                </div>
            </CardHeader>
              <CardContent className="relative z-10">
                <div className={`text-3xl font-bold bg-gradient-to-r ${card.bgGradient} bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform duration-300 inline-block`}>
                  {card.value}
                </div>
                <p className="text-xs text-gray-600 group-hover:text-gray-700 transition-colors mt-2">{card.description}</p>
                <div className={`mt-3 h-1 w-0 group-hover:w-full bg-gradient-to-r ${card.bgGradient} transition-all duration-300 rounded-full`}></div>
            </CardContent>
          </Card>
          )
        })}
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statusCards.map((card, index) => {
          const iconBgClasses = card.iconBg === 'bg-blue-100' 
            ? 'bg-blue-100 group-hover:bg-blue-200' 
            : card.iconBg === 'bg-green-100'
            ? 'bg-green-100 group-hover:bg-green-200'
            : card.iconBg === 'bg-indigo-100'
            ? 'bg-indigo-100 group-hover:bg-indigo-200'
            : 'bg-cyan-100 group-hover:bg-cyan-200'
          
          return (
            <Card 
              key={index} 
              className={`group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-gray-200 overflow-hidden relative bg-gradient-to-br from-white to-gray-50/50 ${card.clickable ? 'cursor-pointer' : ''}`}
              onClick={card.onClick}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.bgGradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-bl-full`}></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">{card.title}</CardTitle>
                <div className={`${iconBgClasses} rounded-full p-2 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                  <card.icon className={`h-5 w-5 ${card.color} group-hover:rotate-12 transition-transform duration-300`} />
                </div>
            </CardHeader>
              <CardContent className="relative z-10">
                <div className={`text-3xl font-bold bg-gradient-to-r ${card.bgGradient} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 inline-block`}>
                  {card.value}
                </div>
                {card.clickable && (
                  <p className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors mt-2">
                    Click to view projects
                  </p>
                )}
                <div className={`mt-3 h-1 w-0 group-hover:w-full bg-gradient-to-r ${card.bgGradient} transition-all duration-300 rounded-full`}></div>
            </CardContent>
          </Card>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects by Discipline */}
        <Card className="group hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-200 overflow-hidden relative bg-gradient-to-br from-white to-blue-50/20">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-blue-700 transition-colors">Projects by Discipline</CardTitle>
            <CardDescription className="text-gray-600">Distribution of validated projects across disciplines</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats?.charts?.projectsByDiscipline || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="_id" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Bar dataKey="count" fill="url(#colorGradient)" radius={[8, 8, 0, 0]}>
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#1D4ED8" />
                    </linearGradient>
                  </defs>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Projects by State */}
        <Card className="group hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-purple-200 overflow-hidden relative bg-gradient-to-br from-white to-purple-50/20">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-400/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-purple-700 transition-colors">Top States by Projects</CardTitle>
            <CardDescription className="text-gray-600">States with the most research projects</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats?.charts?.projectsByState || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ _id, count }) => `${_id}: ${count}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {(stats?.charts?.projectsByState || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Funding Trends */}
      <Card className="group hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-green-200 overflow-hidden relative bg-gradient-to-br from-white to-green-50/20">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-400/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardHeader className="relative z-10">
          <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-green-700 transition-colors">Funding Trends by Year</CardTitle>
          <CardDescription className="text-gray-600">Total funding and project count over time</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats?.charts?.fundingByYear || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="_id" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                formatter={(value, name) => [
                  name === "totalFunding" ? formatCurrency(value) : value,
                  name === "totalFunding" ? "Total Funding" : "Project Count",
                ]}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="totalFunding" fill="url(#fundingGradient)" name="totalFunding" radius={[8, 8, 0, 0]}>
                <defs>
                  <linearGradient id="fundingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </Bar>
              <Bar dataKey="projectCount" fill="url(#projectGradient)" name="projectCount" radius={[8, 8, 0, 0]}>
                <defs>
                  <linearGradient id="projectGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#1D4ED8" />
                  </linearGradient>
                </defs>
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="group hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-indigo-200 overflow-hidden relative bg-gradient-to-br from-white to-indigo-50/20">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-400/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardHeader className="relative z-10">
          <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-indigo-700 transition-colors">Recent Projects</CardTitle>
          <CardDescription className="text-gray-600">Latest validated projects in the system</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="space-y-4">
            {stats?.recentActivity?.recentProjects?.map((project, index) => (
              <div 
                key={project._id} 
                className="group/item flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-white hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-transparent cursor-pointer"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 group-hover/item:text-indigo-700 transition-colors mb-1">
                    {project.title || "Untitled Project"}
                  </h4>
                  <p className="text-sm text-gray-600 group-hover/item:text-gray-700 transition-colors">
                    PI: {project.principalInvestigators?.[0]?.name || project.principalInvestigator?.name || "Unknown"}
                  </p>
                  <p className="text-xs text-gray-500 group-hover/item:text-gray-600 transition-colors mt-1">
                    Created by: {project.createdBy?.firstName || ""} {project.createdBy?.lastName || ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent group-hover/item:scale-110 transition-transform duration-300 inline-block">
                    {formatCurrency(project.budget?.totalAmount || 0)}
                  </p>
                  <p className="text-xs text-gray-500 group-hover/item:text-gray-600 transition-colors mt-1">
                    {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : "Unknown date"}
                  </p>
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
