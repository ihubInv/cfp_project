"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Input } from "../../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Button } from "../../components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { 
  Search, 
  Activity, 
  User, 
  Calendar, 
  Clock, 
  Eye,
  Download,
  Filter,
  Loader2
} from "lucide-react"
import { useGetActivityLogsQuery, useGetActivityStatsQuery, useExportActivityLogsQuery } from "../../store/api/activityLogApi"

const ActivityLogs = () => {
  const [filters, setFilters] = useState({
    search: "",
    action: undefined,
    targetType: undefined,
    dateRange: undefined,
    page: 1,
  })
  const [selectedLog, setSelectedLog] = useState(null)

  // Fetch activity logs from API
  const { data: activityLogsData, isLoading, error } = useGetActivityLogsQuery(filters)
  const { data: statsData, isLoading: statsLoading } = useGetActivityStatsQuery()

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "" ? undefined : value,
      page: key === "page" ? value : 1,
    }))
  }

  const handleViewDetails = (log) => {
    setSelectedLog(log)
  }

  const getActionBadge = (action) => {
    const actionColors = {
      CREATE_PROJECT: "bg-green-100 text-green-800",
      UPDATE_PROJECT: "bg-blue-100 text-blue-800",
      DELETE_PROJECT: "bg-red-100 text-red-800",
      VALIDATE_PROJECT: "bg-purple-100 text-purple-800",
      CREATE_USER: "bg-indigo-100 text-indigo-800",
      UPDATE_USER: "bg-cyan-100 text-cyan-800",
      DELETE_USER: "bg-pink-100 text-pink-800",
      LOGIN: "bg-emerald-100 text-emerald-800",
      LOGOUT: "bg-gray-100 text-gray-800",
      UPLOAD_FILE: "bg-orange-100 text-orange-800",
      DELETE_FILE: "bg-rose-100 text-rose-800",
    }

    const colorClass = actionColors[action] || "bg-gray-100 text-gray-800"
    
    return (
      <Badge className={colorClass}>
        {action.replace(/_/g, " ")}
      </Badge>
    )
  }

  const getTargetTypeBadge = (targetType) => {
    const typeColors = {
      Project: "bg-blue-100 text-blue-800",
      User: "bg-green-100 text-green-800",
      Equipment: "bg-purple-100 text-purple-800",
      Publication: "bg-orange-100 text-orange-800",
      File: "bg-gray-100 text-gray-800",
      System: "bg-red-100 text-red-800",
    }

    const colorClass = typeColors[targetType] || "bg-gray-100 text-gray-800"
    
    return (
      <Badge variant="secondary" className={colorClass}>
        {targetType}
      </Badge>
    )
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleString()
  }

  const getRelativeTime = (date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000)
    
    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
    
    return formatDate(date)
  }

  const exportLogs = async () => {
    try {
      const response = await fetch(`/api/activity-logs/export?${new URLSearchParams(filters)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `activity_logs_${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error("Error exporting logs:", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Activity Logs</h1>
          <p className="text-gray-600">Monitor system activity and user actions</p>
        </div>
        <Button onClick={exportLogs} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Activity Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : statsData?.stats?.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">All activities</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : statsData?.stats?.today || 0}
            </div>
            <p className="text-xs text-muted-foreground">Activities today</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : statsData?.stats?.thisWeek || 0}
            </div>
            <p className="text-xs text-muted-foreground">Activities this week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : statsData?.stats?.thisMonth || 0}
            </div>
            <p className="text-xs text-muted-foreground">Activities this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search activities..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={filters.action || ""}
              onValueChange={(value) => handleFilterChange("action", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CREATE_PROJECT">Create Project</SelectItem>
                <SelectItem value="UPDATE_PROJECT">Update Project</SelectItem>
                <SelectItem value="DELETE_PROJECT">Delete Project</SelectItem>
                <SelectItem value="VALIDATE_PROJECT">Validate Project</SelectItem>
                <SelectItem value="CREATE_USER">Create User</SelectItem>
                <SelectItem value="UPDATE_USER">Update User</SelectItem>
                <SelectItem value="DELETE_USER">Delete User</SelectItem>
                <SelectItem value="LOGIN">Login</SelectItem>
                <SelectItem value="LOGOUT">Logout</SelectItem>
                <SelectItem value="UPLOAD_FILE">Upload File</SelectItem>
                <SelectItem value="DELETE_FILE">Delete File</SelectItem>
                <SelectItem value="CREATE_EQUIPMENT">Create Equipment</SelectItem>
                <SelectItem value="UPDATE_EQUIPMENT">Update Equipment</SelectItem>
                <SelectItem value="DELETE_EQUIPMENT">Delete Equipment</SelectItem>
                <SelectItem value="CREATE_PUBLICATION">Create Publication</SelectItem>
                <SelectItem value="UPDATE_PUBLICATION">Update Publication</SelectItem>
                <SelectItem value="DELETE_PUBLICATION">Delete Publication</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.targetType || ""}
              onValueChange={(value) => handleFilterChange("targetType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by target type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Project">Project</SelectItem>
                <SelectItem value="User">User</SelectItem>
                <SelectItem value="Equipment">Equipment</SelectItem>
                <SelectItem value="Publication">Publication</SelectItem>
                <SelectItem value="File">File</SelectItem>
                <SelectItem value="System">System</SelectItem>
                <SelectItem value="Category">Category</SelectItem>
                <SelectItem value="Scheme">Scheme</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.dateRange || ""}
              onValueChange={(value) => handleFilterChange("dateRange", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Today">Today</SelectItem>
                <SelectItem value="This Week">This Week</SelectItem>
                <SelectItem value="This Month">This Month</SelectItem>
                <SelectItem value="Last 3 Months">Last 3 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Activity Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Logs ({activityLogsData?.total || 0})</CardTitle>
          <CardDescription>System activity and user actions audit trail</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#0d559e]" />
              <p className="mt-2 text-gray-600">Loading activity logs...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">Error loading activity logs. Please try again.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activityLogsData?.activityLogs?.map((log) => (
                  <TableRow key={log._id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{formatDate(log.createdAt)}</p>
                        <p className="text-sm text-gray-500">{getRelativeTime(log.createdAt)}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{log.user?.firstName} {log.user?.lastName}</p>
                        <p className="text-sm text-gray-500">{log.user?.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getActionBadge(log.action)}</TableCell>
                    <TableCell>{getTargetTypeBadge(log.targetType)}</TableCell>
                    <TableCell className="max-w-xs">
                      <p className="truncate">{log.details?.description}</p>
                      {log.details?.comments && (
                        <p className="text-sm text-gray-500 truncate mt-1">
                          Comments: {log.details.comments}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {log.ipAddress}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        title="View Details"
                        onClick={() => handleViewDetails(log)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {activityLogsData?.activityLogs?.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No activity logs found matching your filters</p>
            </div>
          )}

          {/* Pagination */}
          {activityLogsData?.totalPages > 1 && (
            <div className="flex justify-center space-x-2 mt-4">
              <Button
                variant="outline"
                disabled={filters.page <= 1}
                onClick={() => handleFilterChange("page", filters.page - 1)}
              >
                Previous
              </Button>
              <span className="flex items-center px-4 text-sm text-gray-600">
                Page {filters.page} of {activityLogsData.totalPages}
              </span>
              <Button
                variant="outline"
                disabled={filters.page >= activityLogsData.totalPages}
                onClick={() => handleFilterChange("page", filters.page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Details Modal */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Activity Log Details</DialogTitle>
            <DialogDescription>
              Detailed information about this activity log entry
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Timestamp</label>
                  <p className="text-sm">{formatDate(selectedLog.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">User</label>
                  <p className="text-sm">{selectedLog.user?.firstName} {selectedLog.user?.lastName}</p>
                  <p className="text-xs text-gray-500">{selectedLog.user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Action</label>
                  <div className="mt-1">{getActionBadge(selectedLog.action)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Target Type</label>
                  <div className="mt-1">{getTargetTypeBadge(selectedLog.targetType)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">IP Address</label>
                  <p className="text-sm font-mono">{selectedLog.ipAddress}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">User Agent</label>
                  <p className="text-xs text-gray-600 break-all">{selectedLog.userAgent}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md">
                  {selectedLog.details?.description || "No description available"}
                </p>
              </div>

              {selectedLog.details?.comments && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Comments</label>
                  <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md">
                    {selectedLog.details.comments}
                  </p>
                </div>
              )}

              {selectedLog.details?.metadata && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Metadata</label>
                  <pre className="text-xs mt-1 p-3 bg-gray-50 rounded-md overflow-auto">
                    {JSON.stringify(selectedLog.details.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ActivityLogs
