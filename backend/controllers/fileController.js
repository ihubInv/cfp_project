const path = require("path")
const fs = require("fs")
const Project = require("../models/Project")
const ActivityLog = require("../models/Activitylog")

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

// Patent Document Upload
const uploadPatentDocuments = async (req, res) => {
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
        const patentDocuments = req.files.map((file) => ({
            filename: file.filename,
            originalName: file.originalname,
            path: file.path,
            mimetype: file.mimetype,
            size: file.size,
            uploadedAt: new Date(),
        }))

        // Get patent index from query parameter (if provided)
        const patentIndex = req.query.patentIndex ? parseInt(req.query.patentIndex) : null

        console.log("=== Patent Document Upload Debug ===")
        console.log("Project ID:", projectId)
        console.log("Patent Index from query:", patentIndex)
        console.log("Current patents array length:", project.patents ? project.patents.length : 0)
        console.log("Current patents:", JSON.stringify(project.patents, null, 2))

        // If patentIndex is provided, add document to that specific patent
        if (patentIndex !== null && patentIndex >= 0) {
            // Ensure patents array exists
            if (!project.patents) {
                project.patents = []
            }
            
            // If patent doesn't exist at this index, create it
            while (project.patents.length <= patentIndex) {
                project.patents.push({ patentDetail: "", patentDocument: null })
            }
            
            // Add document to the specific patent entry
            if (patentDocuments.length > 0) {
                // Ensure the patent entry exists and has the structure
                if (!project.patents[patentIndex]) {
                    project.patents[patentIndex] = { patentDetail: "", patentDocument: null }
                }
                project.patents[patentIndex].patentDocument = patentDocuments[0]
                project.markModified('patents')
                console.log(`Document added to patent at index ${patentIndex}`)
                console.log("Updated patent:", JSON.stringify(project.patents[patentIndex], null, 2))
                console.log("Full patents array after update:", JSON.stringify(project.patents, null, 2))
            }
        } else {
            // Legacy: Add to patentDocuments array
            if (!project.patentDocuments) {
                project.patentDocuments = []
            }
            project.patentDocuments.push(...patentDocuments)
            console.log("Document added to legacy patentDocuments array")
        }
        
        await project.save()
        
        console.log("Project saved. Patents after save:", JSON.stringify(project.patents, null, 2))
        console.log("=== End Debug ===")

        // Log activity
        await ActivityLog.create({
            user: req.user._id,
            action: "UPLOAD_PATENT_DOCUMENT",
            targetType: "Project",
            targetId: project._id,
            details: {
                description: `Uploaded ${req.files.length} patent document(s) to project: ${project.title}`,
                metadata: {
                    fileCount: req.files.length,
                    fileNames: req.files.map((f) => f.originalname),
                },
            },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        })

        // Refetch the project to get the latest data including the uploaded document
        // Use findOne to ensure we get the same query filters
        let updatedProject = null
        try {
            updatedProject = await Project.findOne({ _id: projectId })
                .populate("createdBy", "firstName lastName")
                .populate("lastUpdatedBy", "firstName lastName")
                .lean() // Convert to plain JavaScript object to ensure all fields are included
            
            console.log("Refetched project. Patents count:", updatedProject ? (updatedProject.patents ? updatedProject.patents.length : 0) : "null")
            if (updatedProject && updatedProject.patents) {
                console.log("Patents data:", JSON.stringify(updatedProject.patents, null, 2))
            } else {
                console.log("WARNING: updatedProject or patents is null/undefined")
            }
        } catch (refetchError) {
            console.error("Error refetching project:", refetchError)
            console.error("Refetch error stack:", refetchError.stack)
            // Try to use the project we just saved as fallback
            try {
                // Convert Mongoose document to plain object
                updatedProject = project.toObject ? project.toObject({ virtuals: true }) : JSON.parse(JSON.stringify(project))
                // Ensure patents array is included
                if (!updatedProject.patents && project.patents) {
                    updatedProject.patents = project.patents
                }
                console.log("Using saved project as fallback. Patents:", updatedProject.patents ? updatedProject.patents.length : 0)
            } catch (fallbackError) {
                console.error("Fallback also failed:", fallbackError)
            }
        }
        
        const response = {
            message: "Patent documents uploaded successfully",
            documents: patentDocuments.map((doc) => ({
                filename: doc.filename,
                originalName: doc.originalName,
                mimetype: doc.mimetype,
                size: doc.size,
                uploadedAt: doc.uploadedAt,
            })),
        }
        
        // Always try to include project - use refetched version or fallback to saved project
        if (updatedProject) {
            response.project = updatedProject
            console.log("Including project in response. Patents:", updatedProject.patents ? updatedProject.patents.length : 0)
        } else {
            console.log("ERROR: Could not get updated project for response")
        }
        
        console.log("Final response keys:", Object.keys(response))
        res.json(response)
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

// Download Patent Document
const downloadPatentDocument = async (req, res) => {
    try {
        const { projectId, filename } = req.params

        const project = await Project.findById(projectId)
        if (!project) {
            return res.status(404).json({ message: "Project not found" })
        }

        // Find the patent document - check both patents array and legacy patentDocuments
        let document = null
        let documentPath = null
        
        // First check patents array
        if (project.patents && project.patents.length > 0) {
            for (const patent of project.patents) {
                if (patent.patentDocument && patent.patentDocument.filename === filename) {
                    document = patent.patentDocument
                    documentPath = patent.patentDocument.path
                    break
                }
            }
        }
        
        // If not found, check legacy patentDocuments
        if (!document) {
            document = project.patentDocuments.find((doc) => doc.filename === filename)
            if (document) {
                documentPath = document.path
            }
        }
        
        if (!document) {
            return res.status(404).json({ message: "Patent document not found" })
        }

        // Check if file exists on disk
        const filePath = documentPath || document.path
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "File not found on server" })
        }

        // Set appropriate headers
        res.setHeader("Content-Disposition", `attachment; filename="${document.originalName}"`)
        res.setHeader("Content-Type", document.mimetype)

        // Stream the file
        const fileStream = fs.createReadStream(filePath)
        fileStream.pipe(res)

        // Log download activity
        await ActivityLog.create({
            user: req.user?._id,
            action: "DOWNLOAD_PATENT_DOCUMENT",
            targetType: "Project",
            targetId: project._id,
            details: {
                description: `Downloaded patent document: ${document.originalName}`,
                metadata: {
                    filename: document.filename,
                    originalName: document.originalName,
                },
            },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

// Delete Patent Document
const deletePatentDocument = async (req, res) => {
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

        // Find and remove the patent document - check both patents array and legacy patentDocuments
        let document = null
        let documentPath = null
        let foundInPatents = false
        let patentIndex = -1
        
        // First check patents array
        if (project.patents && project.patents.length > 0) {
            for (let i = 0; i < project.patents.length; i++) {
                const patent = project.patents[i]
                if (patent.patentDocument && patent.patentDocument.filename === filename) {
                    document = patent.patentDocument
                    documentPath = patent.patentDocument.path
                    foundInPatents = true
                    patentIndex = i
                    break
                }
            }
        }
        
        // If not found in patents, check legacy patentDocuments
        if (!document) {
            const documentIndex = project.patentDocuments.findIndex((doc) => doc.filename === filename)
            if (documentIndex !== -1) {
                document = project.patentDocuments[documentIndex]
                documentPath = document.path
            }
        }
        
        if (!document) {
            return res.status(404).json({ message: "Patent document not found" })
        }

        // Remove file from disk
        const filePathToDelete = documentPath || document.path
        try {
            if (fs.existsSync(filePathToDelete)) {
                fs.unlinkSync(filePathToDelete)
            }
        } catch (fileError) {
            console.error("Error deleting file from disk:", fileError)
        }

        // Remove from database
        if (foundInPatents && patentIndex >= 0) {
            // Remove document from patents array
            project.patents[patentIndex].patentDocument = undefined
            project.markModified('patents')
        } else {
            // Remove from legacy patentDocuments array
            const documentIndex = project.patentDocuments.findIndex((doc) => doc.filename === filename)
            if (documentIndex !== -1) {
                project.patentDocuments.splice(documentIndex, 1)
            }
        }
        await project.save()

        // Log activity
        await ActivityLog.create({
            user: req.user._id,
            action: "DELETE_PATENT_DOCUMENT",
            targetType: "Project",
            targetId: project._id,
            details: {
                description: `Deleted patent document: ${document.originalName}`,
                metadata: {
                    filename: document.filename,
                    originalName: document.originalName,
                },
            },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        })

        // Refetch the project to get the latest data
        const updatedProject = await Project.findOne({ _id: projectId })
            .populate("createdBy", "firstName lastName")
            .populate("lastUpdatedBy", "firstName lastName")
            .lean()
        
        res.json({ 
            message: "Patent document deleted successfully",
            project: updatedProject // Return the updated project so frontend can use it
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
    uploadPatentDocuments,
    downloadPatentDocument,
    deletePatentDocument,
}
