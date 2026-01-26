const express = require("express")
const { 
    uploadProjectFiles, 
    downloadFile, 
    deleteFile, 
    getProjectFiles,
    uploadPatentDocuments,
    downloadPatentDocument,
    deletePatentDocument,
} = require("../controllers/fileController")
const { authenticateToken, authorizeRoles } = require("../middleware/auth")
const { upload, setUploadType, handleUploadError } = require("../middleware/upload")

const router = express.Router()

// Patent Document Routes (must come before general project routes to avoid conflicts)
// Upload patent documents (Admin and PI)
router.post(
    "/projects/:projectId/patent/upload",
    authenticateToken,
    authorizeRoles("Admin", "PI"),
    setUploadType("patents"),
    upload.array("files", 5), // Allow up to 5 files
    handleUploadError,
    uploadPatentDocuments,
)

// Download patent document (authenticated users)
router.get("/projects/:projectId/patent/:filename/download", authenticateToken, downloadPatentDocument)

// Delete patent document (Admin and PI)
router.delete("/projects/:projectId/patent/:filename", authenticateToken, authorizeRoles("Admin", "PI"), deletePatentDocument)

// General Project File Routes
// Upload files to project (Admin and PI)
router.post(
    "/projects/:projectId/upload",
    authenticateToken,
    authorizeRoles("Admin", "PI"),
    setUploadType("projects"),
    upload.array("files", 5), // Allow up to 5 files
    handleUploadError,
    uploadProjectFiles,
)

// Download file (authenticated users)
router.get("/projects/:projectId/download/:filename", authenticateToken, downloadFile)

// Get project files (authenticated users) - must come after download route
router.get("/projects/:projectId", authenticateToken, getProjectFiles)

// Delete file (Admin and PI) - must come last to avoid conflicts
router.delete("/projects/:projectId/:filename", authenticateToken, authorizeRoles("Admin", "PI"), deleteFile)

module.exports = router
