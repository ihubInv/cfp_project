const express = require("express")
const {
    getPublicProjects,
    getPublicProjectById,
    getProjectsByScheme,
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    syncProjectEquipmentToInventory,
} = require("../controllers/projectController")
const { authenticateToken, authorizeRoles } = require("../middleware/auth")

const router = express.Router()

// Public routes
router.get("/public", getPublicProjects)
router.get("/public/:id", getPublicProjectById)
router.get("/public/scheme/:scheme", getProjectsByScheme)

// Admin and PI routes
router.get("/", authenticateToken, authorizeRoles("Admin", "Validator", "PI"), getAllProjects)
router.get("/:id", authenticateToken, authorizeRoles("Admin", "Validator", "PI"), getProjectById)
router.post("/", authenticateToken, authorizeRoles("Admin", "PI"), createProject)
router.put("/:id", authenticateToken, authorizeRoles("Admin", "PI"), updateProject)
router.delete("/:id", authenticateToken, authorizeRoles("Admin", "PI"), deleteProject)

// Equipment sync route (Admin only)
router.post("/sync-equipment", authenticateToken, authorizeRoles("Admin"), async (req, res) => {
    try {
        const Project = require("../models/Project")
        const projects = await Project.find({ equipmentSanctioned: { $exists: true, $not: { $size: 0 } } })
        
        let syncedCount = 0
        for (const project of projects) {
            try {
                await syncProjectEquipmentToInventory(project, req.user._id)
                syncedCount++
            } catch (error) {
                console.error(`Failed to sync equipment for project ${project.title}:`, error)
            }
        }
        
        res.json({
            message: `Successfully synced equipment from ${syncedCount} projects`,
            syncedProjects: syncedCount,
            totalProjects: projects.length
        })
    } catch (error) {
        console.error("Error syncing project equipment:", error)
        res.status(500).json({ message: "Error syncing project equipment", error: error.message })
    }
})

module.exports = router
