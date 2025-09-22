const express = require("express")
const {
    getAllDisciplines,
    getDisciplineById,
    createDiscipline,
    updateDiscipline,
    deleteDiscipline,
    initializeDefaultDisciplines,
    // Keep old exports for backward compatibility
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    initializeDefaultCategories,
} = require("../controllers/categoryController")
const { authenticateToken, authorizeRoles } = require("../middleware/auth")

const router = express.Router()

// Get all disciplines (public endpoint for dropdowns)
router.get("/", getAllDisciplines)

// Get discipline by ID
router.get("/:id", getDisciplineById)

// Admin routes
router.post("/", authenticateToken, authorizeRoles("Admin"), createDiscipline)
router.put("/:id", authenticateToken, authorizeRoles("Admin"), updateDiscipline)
router.delete("/:id", authenticateToken, authorizeRoles("Admin"), deleteDiscipline)
router.post("/initialize", authenticateToken, authorizeRoles("Admin"), initializeDefaultDisciplines)

module.exports = router
