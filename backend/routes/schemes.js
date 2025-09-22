const express = require("express")
const {
    getAllSchemes,
    getSchemeById,
    createScheme,
    updateScheme,
    deleteScheme,
    permanentDeleteScheme,
    initializeDefaultSchemes,
} = require("../controllers/schemeController")
const { authenticateToken, authorizeRoles } = require("../middleware/auth")

const router = express.Router()

// Get all schemes (public endpoint for dropdowns)
router.get("/", getAllSchemes)

// Get scheme by ID
router.get("/:id", getSchemeById)

// Admin routes
router.post("/", authenticateToken, authorizeRoles("Admin"), createScheme)
router.put("/:id", authenticateToken, authorizeRoles("Admin"), updateScheme)
router.delete("/:id", authenticateToken, authorizeRoles("Admin"), deleteScheme)
router.delete("/:id/permanent", authenticateToken, authorizeRoles("Admin"), permanentDeleteScheme)
router.post("/initialize", authenticateToken, authorizeRoles("Admin"), initializeDefaultSchemes)

module.exports = router
