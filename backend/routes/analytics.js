const express = require("express")
const { getDashboardStats, getFundingStats } = require("../controllers/analyticsController")
const { authenticateToken, authorizeRoles } = require("../middleware/auth")

const router = express.Router()

// Public funding stats endpoint
router.get("/funding-stats", getFundingStats)

// Admin and PI analytics endpoints
router.get("/dashboard", authenticateToken, authorizeRoles("Admin", "Validator", "PI"), getDashboardStats)

module.exports = router
