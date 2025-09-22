const express = require("express")
const { 
  getSettings, 
  updateSettings, 
  testEmailConfig, 
  resetSettings, 
  exportSettings 
} = require("../controllers/settingsController")
const { authenticateToken, authorizeRoles } = require("../middleware/auth")

const router = express.Router()

// Get system settings (Admin only)
router.get("/", authenticateToken, authorizeRoles("Admin"), getSettings)

// Update system settings (Admin only)
router.put("/", authenticateToken, authorizeRoles("Admin"), updateSettings)

// Test email configuration (Admin only)
router.post("/test-email", authenticateToken, authorizeRoles("Admin"), testEmailConfig)

// Reset settings to defaults (Admin only)
router.post("/reset", authenticateToken, authorizeRoles("Admin"), resetSettings)

// Export settings (Admin only)
router.get("/export", authenticateToken, authorizeRoles("Admin"), exportSettings)

module.exports = router
