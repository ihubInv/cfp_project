const express = require("express")
const { 
  getActivityLogs, 
  getActivityStats, 
  exportActivityLogs 
} = require("../controllers/activityLogController")
const { authenticateToken, authorizeRoles } = require("../middleware/auth")

const router = express.Router()

// Get activity logs with filtering and pagination (Admin only)
router.get("/", authenticateToken, authorizeRoles("Admin"), getActivityLogs)

// Get activity statistics (Admin only)
router.get("/stats", authenticateToken, authorizeRoles("Admin"), getActivityStats)

// Export activity logs as CSV (Admin only)
router.get("/export", authenticateToken, authorizeRoles("Admin"), exportActivityLogs)

module.exports = router
