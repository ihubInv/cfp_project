const express = require("express")
const { 
    getAllPIProjects, 
    getPIProjectsByPI, 
    getPIProjectById, 
    createPIProject, 
    updatePIProject,
    uploadProjectDocuments,
    submitProgressReport,
    reviewProject,
    getPIProjectStats
} = require("../controllers/piProjectController")
const { authenticateToken, authorizeRoles } = require("../middleware/auth")
const upload = require("../middleware/upload").upload

const router = express.Router()

// Get all PI projects (Admin only)
router.get("/", authenticateToken, authorizeRoles("Admin"), getAllPIProjects)

// Get PI projects by PI (PI only)
router.get("/my-projects", authenticateToken, authorizeRoles("PI"), getPIProjectsByPI)

// Get PI project statistics
router.get("/stats", authenticateToken, authorizeRoles("Admin", "PI"), getPIProjectStats)

// Get single PI project
router.get("/:id", authenticateToken, authorizeRoles("Admin", "PI"), getPIProjectById)

// Create new PI project (PI only)
router.post("/", authenticateToken, authorizeRoles("PI"), createPIProject)

// Update PI project
router.put("/:id", authenticateToken, authorizeRoles("Admin", "PI"), updatePIProject)

// Upload project documents (PI only)
router.post("/:id/documents", 
    authenticateToken, 
    authorizeRoles("PI"), 
    upload.array("documents", 10), 
    uploadProjectDocuments
)

// Submit progress report (PI only)
router.post("/:id/progress-report", 
    authenticateToken, 
    authorizeRoles("PI"), 
    upload.array("attachments", 5), 
    submitProgressReport
)

// Admin review project (Admin only)
router.post("/:id/review", authenticateToken, authorizeRoles("Admin"), reviewProject)

module.exports = router
