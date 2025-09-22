const ActivityLog = require("../models/Activitylog")
const User = require("../models/User")

// Get all activity logs with filtering and pagination
const getActivityLogs = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      action, 
      targetType, 
      dateRange,
      userId 
    } = req.query

    const query = {}

    // Search filter
    if (search) {
      query.$or = [
        { "details.description": { $regex: search, $options: "i" } },
        { "details.metadata": { $regex: search, $options: "i" } }
      ]
    }

    // Action filter
    if (action && action !== "All Actions") {
      query.action = action
    }

    // Target type filter
    if (targetType && targetType !== "All Types") {
      query.targetType = targetType
    }

    // User filter
    if (userId) {
      query.user = userId
    }

    // Date range filter
    if (dateRange && dateRange !== "All Time") {
      const now = new Date()
      let startDate

      switch (dateRange) {
        case "Today":
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          break
        case "This Week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case "This Month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        case "Last 3 Months":
          startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
          break
        default:
          startDate = null
      }

      if (startDate) {
        query.createdAt = { $gte: startDate }
      }
    }

    const activityLogs = await ActivityLog.find(query)
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await ActivityLog.countDocuments(query)

    res.json({
      activityLogs,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    })
  } catch (error) {
    console.error("Error fetching activity logs:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get activity log statistics
const getActivityStats = async (req, res) => {
  try {
    const now = new Date()
    
    // Today's activities
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const todayCount = await ActivityLog.countDocuments({
      createdAt: { $gte: todayStart }
    })

    // This week's activities
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const weekCount = await ActivityLog.countDocuments({
      createdAt: { $gte: weekStart }
    })

    // This month's activities
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthCount = await ActivityLog.countDocuments({
      createdAt: { $gte: monthStart }
    })

    // Total activities
    const totalCount = await ActivityLog.countDocuments()

    // Most active users
    const mostActiveUsers = await ActivityLog.aggregate([
      {
        $group: {
          _id: "$user",
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      {
        $unwind: "$userInfo"
      },
      {
        $project: {
          user: {
            _id: "$userInfo._id",
            firstName: "$userInfo.firstName",
            lastName: "$userInfo.lastName",
            email: "$userInfo.email"
          },
          activityCount: "$count"
        }
      },
      {
        $sort: { activityCount: -1 }
      },
      {
        $limit: 5
      }
    ])

    // Most common actions
    const commonActions = await ActivityLog.aggregate([
      {
        $group: {
          _id: "$action",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ])

    res.json({
      stats: {
        total: totalCount,
        today: todayCount,
        thisWeek: weekCount,
        thisMonth: monthCount
      },
      mostActiveUsers,
      commonActions
    })
  } catch (error) {
    console.error("Error fetching activity stats:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Create activity log (utility function)
const createActivityLog = async (userId, action, targetType, targetId, details, req) => {
  try {
    const activityLog = new ActivityLog({
      user: userId,
      action,
      targetType,
      targetId,
      details,
      ipAddress: req?.ip || req?.connection?.remoteAddress,
      userAgent: req?.get('User-Agent')
    })

    await activityLog.save()
    return activityLog
  } catch (error) {
    console.error("Error creating activity log:", error)
    // Don't throw error to avoid breaking the main operation
  }
}

// Export activity logs as CSV
const exportActivityLogs = async (req, res) => {
  try {
    const { search, action, targetType, dateRange } = req.query

    const query = {}

    if (search) {
      query.$or = [
        { "details.description": { $regex: search, $options: "i" } },
        { "details.metadata": { $regex: search, $options: "i" } }
      ]
    }

    if (action && action !== "All Actions") {
      query.action = action
    }

    if (targetType && targetType !== "All Types") {
      query.targetType = targetType
    }

    if (dateRange && dateRange !== "All Time") {
      const now = new Date()
      let startDate

      switch (dateRange) {
        case "Today":
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          break
        case "This Week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case "This Month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        case "Last 3 Months":
          startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
          break
      }

      if (startDate) {
        query.createdAt = { $gte: startDate }
      }
    }

    const activityLogs = await ActivityLog.find(query)
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 })

    // Convert to CSV format
    const csvHeader = "Timestamp,User,Email,Action,Target Type,Description,IP Address,User Agent\n"
    const csvRows = activityLogs.map(log => {
      const timestamp = new Date(log.createdAt).toISOString()
      const user = `${log.user.firstName} ${log.user.lastName}`
      const email = log.user.email
      const action = log.action
      const targetType = log.targetType || ""
      const description = (log.details?.description || "").replace(/"/g, '""')
      const ipAddress = log.ipAddress || ""
      const userAgent = (log.userAgent || "").replace(/"/g, '""')

      return `"${timestamp}","${user}","${email}","${action}","${targetType}","${description}","${ipAddress}","${userAgent}"`
    }).join("\n")

    const csvContent = csvHeader + csvRows

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename="activity_logs_${new Date().toISOString().split('T')[0]}.csv"`)
    res.send(csvContent)
  } catch (error) {
    console.error("Error exporting activity logs:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

module.exports = {
  getActivityLogs,
  getActivityStats,
  createActivityLog,
  exportActivityLogs
}
