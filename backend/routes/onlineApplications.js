const express = require("express")
const {
    getAllOnlineApplications,
    getOnlineApplicationById,
    submitOnlineApplication,
    updateApplicationStatus,
    deleteOnlineApplication,
    getApplicationStats,
    getApplicationSettings,
    updateApplicationSettings,
    downloadApplicationDocument,
    exportApplications,
    bulkUpdateApplicationStatus,
} = require("../controllers/onlineApplicationController")
const { authenticateToken, authorizeRoles } = require("../middleware/auth")
const { upload, setUploadType } = require("../middleware/upload")

const router = express.Router()

// Public routes
router.post("/", setUploadType('online-applications'), upload.single('supportingDocuments'), submitOnlineApplication)
router.get("/settings", getApplicationSettings)

// Admin routes
router.get("/", authenticateToken, authorizeRoles("Admin", "Validator"), getAllOnlineApplications)
router.get("/stats", authenticateToken, authorizeRoles("Admin", "Validator"), getApplicationStats)
router.get("/:id", authenticateToken, authorizeRoles("Admin", "Validator"), getOnlineApplicationById)
router.put("/:id/status", authenticateToken, authorizeRoles("Admin", "Validator"), (req, res, next) => {
    console.log("=== Status Update Route ===")
    console.log("Request params:", req.params)
    console.log("Request body:", req.body)
    console.log("User:", req.user)
    next()
}, updateApplicationStatus)
router.delete("/:id", authenticateToken, authorizeRoles("Admin", "Validator"), deleteOnlineApplication)
router.put("/settings", authenticateToken, authorizeRoles("Admin"), updateApplicationSettings)
router.get("/:id/download/:documentType", authenticateToken, authorizeRoles("Admin", "Validator"), downloadApplicationDocument)
router.post("/export", authenticateToken, authorizeRoles("Admin", "Validator"), exportApplications)
router.put("/bulk-update", authenticateToken, authorizeRoles("Admin", "Validator"), bulkUpdateApplicationStatus)

module.exports = router
