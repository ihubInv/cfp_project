const express = require("express")
const { uploadProjectFiles, downloadFile, deleteFile, getProjectFiles } = require("../controllers/fileController")
const { authenticateToken, authorizeRoles } = require("../middleware/auth")
const { upload, setUploadType, handleUploadError } = require("../middleware/upload")

const router = express.Router()

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

// Get project files (authenticated users)
router.get("/projects/:projectId", authenticateToken, getProjectFiles)

// Download file (authenticated users)
router.get("/projects/:projectId/download/:filename", authenticateToken, downloadFile)

// Delete file (Admin and PI)
router.delete("/projects/:projectId/:filename", authenticateToken, authorizeRoles("Admin", "PI"), deleteFile)

module.exports = router
