const express = require("express")
const router = express.Router()
const { 
  getPublications, 
  getPublicationById, 
  createPublication, 
  updatePublication, 
  deletePublication,
  getPublicationStats
} = require("../controllers/publicationController")
const { authenticateToken, authorizeRoles } = require("../middleware/auth")

// Get all publications
router.get("/", authenticateToken, authorizeRoles("Admin"), getPublications)

// Get publication statistics
router.get("/stats", authenticateToken, authorizeRoles("Admin"), getPublicationStats)

// Get publication by ID
router.get("/:id", authenticateToken, authorizeRoles("Admin"), getPublicationById)

// Create new publication
router.post("/", authenticateToken, authorizeRoles("Admin"), createPublication)

// Update publication
router.put("/:id", authenticateToken, authorizeRoles("Admin"), updatePublication)

// Delete publication
router.delete("/:id", authenticateToken, authorizeRoles("Admin"), deletePublication)

module.exports = router
