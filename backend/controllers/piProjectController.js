const PIProject = require("../models/PIProject")
const User = require("../models/User")
const { createActivityLog } = require("./activityLogController")
const multer = require("multer")
const path = require("path")
const fs = require("fs")

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, "../uploads/pi-projects")
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true })
        }
        cb(null, uploadPath)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf|doc|docx|txt|jpg|jpeg|png|xlsx|xls/
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
        const mimetype = allowedTypes.test(file.mimetype)
        
        if (mimetype && extname) {
            return cb(null, true)
        } else {
            cb(new Error("Only PDF, DOC, DOCX, TXT, JPG, JPEG, PNG, XLS, XLSX files are allowed"))
        }
    }
})

// Get all PI projects (Admin only)
const getAllPIProjects = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, piId, search } = req.query
        const query = {}

        if (status && status !== "all") {
            query.projectStatus = status
        }

        if (piId) {
            query.pi = piId
        }

        if (search) {
            query.$or = [
                { projectTitle: { $regex: search, $options: "i" } },
                { piName: { $regex: search, $options: "i" } },
                { piInstitution: { $regex: search, $options: "i" } },
                { fundingAgency: { $regex: search, $options: "i" } }
            ]
        }

        const projects = await PIProject.find(query)
            .populate("pi", "firstName lastName email institution")
            .populate("adminReview.reviewedBy", "firstName lastName")
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)

        const total = await PIProject.countDocuments(query)

        res.json({
            projects,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        })
    } catch (error) {
        console.error("Error fetching PI projects:", error)
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

// Get PI projects by PI ID
const getPIProjectsByPI = async (req, res) => {
    try {
        const piId = req.user._id
        const { page = 1, limit = 10, status } = req.query
        const query = { pi: piId }

        if (status && status !== "all") {
            query.projectStatus = status
        }

        const projects = await PIProject.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)

        const total = await PIProject.countDocuments(query)

        res.json({
            projects,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        })
    } catch (error) {
        console.error("Error fetching PI projects:", error)
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

// Get single PI project
const getPIProjectById = async (req, res) => {
    try {
        const project = await PIProject.findById(req.params.id)
            .populate("pi", "firstName lastName email institution")
            .populate("adminReview.reviewedBy", "firstName lastName")

        if (!project) {
            return res.status(404).json({ message: "Project not found" })
        }

        // Check if user has access to this project
        if (req.user.role === "PI" && project.pi._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access denied" })
        }

        res.json(project)
    } catch (error) {
        console.error("Error fetching PI project:", error)
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

// Create new PI project
const createPIProject = async (req, res) => {
    try {
        const piId = req.user._id
        const pi = await User.findById(piId)

        if (!pi) {
            return res.status(404).json({ message: "PI not found" })
        }

        const projectData = {
            ...req.body,
            pi: piId,
            piName: `${pi.firstName} ${pi.lastName}`,
            piEmail: pi.email,
            piInstitution: pi.institution,
            lastUpdatedBy: piId
        }

        const project = new PIProject(projectData)
        await project.save()

        // Log the project creation
        await createActivityLog(
            piId,
            "CREATE_PI_PROJECT",
            "PIProject",
            project._id,
            {
                description: `Created new project: ${project.projectTitle}`,
                projectTitle: project.projectTitle
            },
            req
        )

        res.status(201).json(project)
    } catch (error) {
        console.error("Error creating PI project:", error)
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

// Update PI project
const updatePIProject = async (req, res) => {
    try {
        const projectId = req.params.id
        const userId = req.user._id

        const project = await PIProject.findById(projectId)
        if (!project) {
            return res.status(404).json({ message: "Project not found" })
        }

        // Check if user has access to update this project
        if (req.user.role === "PI" && project.pi.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Access denied" })
        }

        const updateData = {
            ...req.body,
            lastUpdatedBy: userId
        }

        const updatedProject = await PIProject.findByIdAndUpdate(
            projectId,
            updateData,
            { new: true }
        )

        // Log the project update
        await createActivityLog(
            userId,
            "UPDATE_PI_PROJECT",
            "PIProject",
            projectId,
            {
                description: `Updated project: ${updatedProject.projectTitle}`,
                changes: Object.keys(req.body)
            },
            req
        )

        res.json(updatedProject)
    } catch (error) {
        console.error("Error updating PI project:", error)
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

// Upload project documents
const uploadProjectDocuments = async (req, res) => {
    try {
        const projectId = req.params.id
        const userId = req.user._id

        const project = await PIProject.findById(projectId)
        if (!project) {
            return res.status(404).json({ message: "Project not found" })
        }

        // Check if user has access to upload documents
        if (req.user.role === "PI" && project.pi.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Access denied" })
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" })
        }

        const documents = req.files.map(file => ({
            filename: file.filename,
            originalName: file.originalname,
            path: file.path,
            mimetype: file.mimetype,
            size: file.size,
            category: req.body.category || "Other",
            uploadedAt: new Date()
        }))

        project.documents.push(...documents)
        await project.save()

        // Log the document upload
        await createActivityLog(
            userId,
            "UPLOAD_PI_DOCUMENTS",
            "PIProject",
            projectId,
            {
                description: `Uploaded ${documents.length} document(s) to project: ${project.projectTitle}`,
                documents: documents.map(doc => doc.originalName)
            },
            req
        )

        res.json({ message: "Documents uploaded successfully", documents })
    } catch (error) {
        console.error("Error uploading documents:", error)
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

// Submit progress report
const submitProgressReport = async (req, res) => {
    try {
        const projectId = req.params.id
        const userId = req.user._id

        const project = await PIProject.findById(projectId)
        if (!project) {
            return res.status(404).json({ message: "Project not found" })
        }

        // Check if user has access to submit reports
        if (req.user.role === "PI" && project.pi.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Access denied" })
        }

        const reportData = {
            ...req.body,
            reportNumber: project.progressReports.length + 1,
            submittedAt: new Date(),
            status: "Submitted"
        }

        project.progressReports.push(reportData)
        await project.save()

        // Log the progress report submission
        await createActivityLog(
            userId,
            "SUBMIT_PROGRESS_REPORT",
            "PIProject",
            projectId,
            {
                description: `Submitted progress report #${reportData.reportNumber} for project: ${project.projectTitle}`,
                reportNumber: reportData.reportNumber
            },
            req
        )

        res.json({ message: "Progress report submitted successfully", report: reportData })
    } catch (error) {
        console.error("Error submitting progress report:", error)
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

// Admin review project
const reviewProject = async (req, res) => {
    try {
        const projectId = req.params.id
        const adminId = req.user._id

        const project = await PIProject.findById(projectId)
        if (!project) {
            return res.status(404).json({ message: "Project not found" })
        }

        const reviewData = {
            reviewedBy: adminId,
            reviewDate: new Date(),
            ...req.body
        }

        project.adminReview = reviewData
        await project.save()

        // Log the project review
        await createActivityLog(
            adminId,
            "REVIEW_PI_PROJECT",
            "PIProject",
            projectId,
            {
                description: `Reviewed project: ${project.projectTitle}`,
                reviewStatus: reviewData.status,
                comments: reviewData.comments
            },
            req
        )

        res.json({ message: "Project reviewed successfully", review: reviewData })
    } catch (error) {
        console.error("Error reviewing project:", error)
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

// Get PI project statistics
const getPIProjectStats = async (req, res) => {
    try {
        const userId = req.user._id
        const isAdmin = req.user.role === "Admin"
        
        const query = isAdmin ? {} : { pi: userId }
        
        const totalProjects = await PIProject.countDocuments(query)
        const activeProjects = await PIProject.countDocuments({ ...query, projectStatus: "In Progress" })
        const completedProjects = await PIProject.countDocuments({ ...query, projectStatus: "Completed" })
        const pendingReview = await PIProject.countDocuments({ ...query, "adminReview.status": "Pending" })
        
        const totalBudget = await PIProject.aggregate([
            { $match: query },
            { $group: { _id: null, total: { $sum: "$totalBudget" } } }
        ])

        res.json({
            totalProjects,
            activeProjects,
            completedProjects,
            pendingReview,
            totalBudget: totalBudget[0]?.total || 0
        })
    } catch (error) {
        console.error("Error fetching PI project stats:", error)
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

module.exports = {
    getAllPIProjects,
    getPIProjectsByPI,
    getPIProjectById,
    createPIProject,
    updatePIProject,
    uploadProjectDocuments,
    submitProgressReport,
    reviewProject,
    getPIProjectStats,
    upload
}
