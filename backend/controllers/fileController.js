const path = require("path")
const fs = require("fs")
const Project = require("../models/Project")
const ActivityLog = require("../models/ActivityLog")

const uploadProjectFiles = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" })
        }

        const { projectId } = req.params
        const query = { _id: projectId }
        
        // Filter by user role - PI users can only upload files to their own projects
        if (req.user.role === "PI") {
            query.createdBy = req.user._id
        }
        // Admin and Validator users can upload files to any project (no additional filter)

        const project = await Project.findOne(query)

        if (!project) {
            // Clean up uploaded files if project doesn't exist
            req.files.forEach((file) => {
                fs.unlinkSync(file.path)
            })
            return res.status(404).json({ message: "Project not found" })
        }

        // Process uploaded files
        const attachments = req.files.map((file) => ({
            filename: file.filename,
            originalName: file.originalname,
            path: file.path,
            mimetype: file.mimetype,
            size: file.size,
            uploadedAt: new Date(),
        }))

        // Add attachments to project
        project.attachments.push(...attachments)
        await project.save()

        // Log activity
        await ActivityLog.create({
            user: req.user._id,
            action: "UPLOAD_FILE",
            targetType: "Project",
            targetId: project._id,
            details: {
                description: `Uploaded ${req.files.length} file(s) to project: ${project.title}`,
                metadata: {
                    fileCount: req.files.length,
                    fileNames: req.files.map((f) => f.originalname),
                },
            },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        })

        res.json({
            message: "Files uploaded successfully",
            attachments: attachments.map((att) => ({
                filename: att.filename,
                originalName: att.originalName,
                mimetype: att.mimetype,
                size: att.size,
                uploadedAt: att.uploadedAt,
            })),
        })
    } catch (error) {
        // Clean up uploaded files on error
        if (req.files) {
            req.files.forEach((file) => {
                try {
                    fs.unlinkSync(file.path)
                } catch (unlinkError) {
                    console.error("Error cleaning up file:", unlinkError)
                }
            })
        }
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

const downloadFile = async (req, res) => {
    try {
        const { projectId, filename } = req.params

        const project = await Project.findById(projectId)
        if (!project) {
            return res.status(404).json({ message: "Project not found" })
        }

        // Find the attachment
        const attachment = project.attachments.find((att) => att.filename === filename)
        if (!attachment) {
            return res.status(404).json({ message: "File not found" })
        }

        // Check if file exists on disk
        if (!fs.existsSync(attachment.path)) {
            return res.status(404).json({ message: "File not found on server" })
        }

        // Set appropriate headers
        res.setHeader("Content-Disposition", `attachment; filename="${attachment.originalName}"`)
        res.setHeader("Content-Type", attachment.mimetype)

        // Stream the file
        const fileStream = fs.createReadStream(attachment.path)
        fileStream.pipe(res)

        // Log download activity
        await ActivityLog.create({
            user: req.user?._id,
            action: "DOWNLOAD_FILE",
            targetType: "Project",
            targetId: project._id,
            details: {
                description: `Downloaded file: ${attachment.originalName}`,
                metadata: {
                    filename: attachment.filename,
                    originalName: attachment.originalName,
                },
            },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

const deleteFile = async (req, res) => {
    try {
        const { projectId, filename } = req.params
        const query = { _id: projectId }
        
        // Filter by user role - PI users can only delete files from their own projects
        if (req.user.role === "PI") {
            query.createdBy = req.user._id
        }
        // Admin and Validator users can delete files from any project (no additional filter)

        const project = await Project.findOne(query)
        if (!project) {
            return res.status(404).json({ message: "Project not found" })
        }

        // Find and remove the attachment
        const attachmentIndex = project.attachments.findIndex((att) => att.filename === filename)
        if (attachmentIndex === -1) {
            return res.status(404).json({ message: "File not found" })
        }

        const attachment = project.attachments[attachmentIndex]

        // Remove file from disk
        try {
            if (fs.existsSync(attachment.path)) {
                fs.unlinkSync(attachment.path)
            }
        } catch (fileError) {
            console.error("Error deleting file from disk:", fileError)
        }

        // Remove from database
        project.attachments.splice(attachmentIndex, 1)
        await project.save()

        // Log activity
        await ActivityLog.create({
            user: req.user._id,
            action: "DELETE_FILE",
            targetType: "Project",
            targetId: project._id,
            details: {
                description: `Deleted file: ${attachment.originalName}`,
                metadata: {
                    filename: attachment.filename,
                    originalName: attachment.originalName,
                },
            },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        })

        res.json({ message: "File deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

const getProjectFiles = async (req, res) => {
    try {
        const { projectId } = req.params
        const query = { _id: projectId }
        
        // Filter by user role - PI users can only access files from their own projects
        if (req.user.role === "PI") {
            query.createdBy = req.user._id
        }
        // Admin and Validator users can access files from any project (no additional filter)

        const project = await Project.findOne(query).select("attachments title")
        if (!project) {
            return res.status(404).json({ message: "Project not found" })
        }

        // Return file metadata (don't expose full paths)
        const files = project.attachments.map((att) => ({
            filename: att.filename,
            originalName: att.originalName,
            mimetype: att.mimetype,
            size: att.size,
            uploadedAt: att.uploadedAt,
        }))

        res.json({
            projectTitle: project.title,
            files,
        })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

module.exports = {
    uploadProjectFiles,
    downloadFile,
    deleteFile,
    getProjectFiles,
}
