const express = require("express")
const {
    getAllManpowerTypes,
    getManpowerTypeById,
    createManpowerType,
    updateManpowerType,
    deleteManpowerType,
    getManpowerTypeStats,
} = require("../controllers/manpowerTypeController")
const { authenticateToken, authorizeRoles } = require("../middleware/auth")

const router = express.Router()

// Public routes (for project forms)
router.get("/", getAllManpowerTypes)

// Admin routes
router.get("/stats", authenticateToken, authorizeRoles("Admin", "Validator"), getManpowerTypeStats)
router.get("/:id", authenticateToken, authorizeRoles("Admin", "Validator"), getManpowerTypeById)
router.post("/", authenticateToken, authorizeRoles("Admin"), createManpowerType)
router.put("/:id", authenticateToken, authorizeRoles("Admin"), updateManpowerType)
router.delete("/:id", authenticateToken, authorizeRoles("Admin"), deleteManpowerType)

module.exports = router
