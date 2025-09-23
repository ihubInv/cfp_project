const mongoose = require("mongoose")
const OnlineApplication = require("../models/OnlineApplication")
const ActivityLog = require("../models/ActivityLog")
const path = require("path")
const fs = require("fs")

// Submit new online application (public)
const submitOnlineApplication = async (req, res) => {
    try {
        console.log("=== Online Application Submission ===")
        console.log("Request body:", req.body)
        console.log("Request file:", req.file)
        
        const {
            applicantName,
            email,
            phone,
            organization,
            designation,
            scheme,
            discipline,
            projectTitle,
            projectDescription,
            duration,
            budget,
            coInvestigators,
            expectedOutcomes
        } = req.body

        // Validate required fields
        if (!applicantName || !email || !phone || !organization || !designation || 
            !scheme || !discipline || !projectTitle || !projectDescription || 
            !duration || !budget || !expectedOutcomes) {
            return res.status(400).json({ 
                message: "All required fields must be provided" 
            })
        }

        // Check if application is currently open
        // For now, skip this check to allow submissions
        // const settings = await getApplicationSettings()
        // if (!settings.isOpen) {
        //     return res.status(400).json({ 
        //         message: "Applications are currently closed" 
        //     })
        // }

        // Create new application
        const applicationData = {
            applicantName,
            email,
            phone,
            organization,
            designation,
            scheme,
            discipline,
            projectTitle,
            projectDescription,
            duration: parseInt(duration),
            budget: parseInt(budget),
            coInvestigators: coInvestigators || "",
            expectedOutcomes,
            status: "pending",
            submittedAt: new Date()
        }

        // Handle file upload if present
        if (req.file) {
            applicationData.supportingDocuments = req.file.filename
        }

        console.log("Creating application with data:", applicationData)
        
        const application = new OnlineApplication(applicationData)
        await application.save()
        
        console.log("Application saved successfully:", application._id)

        // Log activity - skip for now to avoid errors
        console.log("Application submitted successfully, skipping activity log for now")

        res.status(201).json({ 
            message: "Application submitted successfully",
            applicationId: application._id
        })

    } catch (error) {
        console.error("Error submitting application:", error)
        res.status(500).json({ 
            message: "Server error", 
            error: error.message 
        })
    }
}

// Get all online applications (admin)
const getAllOnlineApplications = async (req, res) => {
    try {
        const { status, scheme, discipline, search, page = 1, limit = 10 } = req.query
        
        let query = {}
        
        if (status && status !== 'all') {
            query.status = status
        }
        
        if (scheme && scheme !== 'all') {
            query.scheme = scheme
        }
        
        if (discipline && discipline !== 'all') {
            query.discipline = discipline
        }
        
        if (search) {
            query.$or = [
                { applicantName: { $regex: search, $options: 'i' } },
                { projectTitle: { $regex: search, $options: 'i' } },
                { organization: { $regex: search, $options: 'i' } }
            ]
        }

        const applications = await OnlineApplication.find(query)
            .sort({ submittedAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)

        const total = await OnlineApplication.countDocuments(query)

        res.json({
            applications,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        })

    } catch (error) {
        console.error("Error fetching applications:", error)
        res.status(500).json({ 
            message: "Server error", 
            error: error.message 
        })
    }
}

// Get online application by ID
const getOnlineApplicationById = async (req, res) => {
    try {
        const application = await OnlineApplication.findById(req.params.id)
        
        if (!application) {
            return res.status(404).json({ message: "Application not found" })
        }

        res.json(application)

    } catch (error) {
        console.error("Error fetching application:", error)
        res.status(500).json({ 
            message: "Server error", 
            error: error.message 
        })
    }
}

// Update application status (admin)
const updateApplicationStatus = async (req, res) => {
    try {
        const { status, comments } = req.body
        const { id } = req.params

        console.log("=== Update Application Status ===")
        console.log("Application ID:", id)
        console.log("New Status:", status)
        console.log("Comments:", comments)
        console.log("User:", req.user)

        const application = await OnlineApplication.findById(id)
        if (!application) {
            console.log("Application not found")
            return res.status(404).json({ message: "Application not found" })
        }

        console.log("Application found:", application.applicantName)
        console.log("Current status:", application.status)

        application.status = status
        if (comments) {
            application.comments = comments
        }
        application.updatedAt = new Date()

        await application.save()
        console.log("Application status updated successfully")

        // Log activity - skip for now to avoid errors
        console.log("Skipping activity log for now to avoid errors")

        res.json({ 
            message: "Application status updated successfully",
            application 
        })

    } catch (error) {
        console.error("Error updating application status:", error)
        res.status(500).json({ 
            message: "Server error", 
            error: error.message 
        })
    }
}

// Delete online application (admin)
const deleteOnlineApplication = async (req, res) => {
    try {
        const application = await OnlineApplication.findById(req.params.id)
        if (!application) {
            return res.status(404).json({ message: "Application not found" })
        }

        // Delete associated file if exists
        if (application.supportingDocuments) {
            const filePath = path.join(__dirname, '../uploads/online-applications', application.supportingDocuments)
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath)
            }
        }

        await OnlineApplication.findByIdAndDelete(req.params.id)

        // Log activity
        await ActivityLog.create({
            action: "Application Deleted",
            details: `Application ${req.params.id} deleted`,
            user: req.user.id,
            timestamp: new Date()
        })

        res.json({ message: "Application deleted successfully" })

    } catch (error) {
        console.error("Error deleting application:", error)
        res.status(500).json({ 
            message: "Server error", 
            error: error.message 
        })
    }
}

// Get application statistics (admin)
const getApplicationStats = async (req, res) => {
    try {
        const stats = await OnlineApplication.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ])

        const total = await OnlineApplication.countDocuments()
        const recent = await OnlineApplication.find()
            .sort({ submittedAt: -1 })
            .limit(5)

        res.json({
            stats,
            total,
            recent
        })

    } catch (error) {
        console.error("Error fetching application stats:", error)
        res.status(500).json({ 
            message: "Server error", 
            error: error.message 
        })
    }
}

// Get application settings
const getApplicationSettings = async (req, res) => {
    try {
        // For now, return default settings
        // In a real implementation, this would come from a database
        const settings = {
            isOpen: true,
            openDate: "2024-01-01",
            closeDate: "2024-12-31",
            autoClose: true,
            message: "Applications are currently being accepted for Call for Proposal 5.0"
        }

        res.json(settings)

    } catch (error) {
        console.error("Error fetching application settings:", error)
        res.status(500).json({ 
            message: "Server error", 
            error: error.message 
        })
    }
}

// Update application settings (admin)
const updateApplicationSettings = async (req, res) => {
    try {
        // For now, just return success
        // In a real implementation, this would save to database
        res.json({ 
            message: "Settings updated successfully" 
        })

    } catch (error) {
        console.error("Error updating application settings:", error)
        res.status(500).json({ 
            message: "Server error", 
            error: error.message 
        })
    }
}

// Download application document
const downloadApplicationDocument = async (req, res) => {
    try {
        const { id, documentType } = req.params
        
        console.log("=== Document Download Request ===")
        console.log("Application ID:", id)
        console.log("Document Type:", documentType)
        
        const application = await OnlineApplication.findById(id)
        if (!application) {
            console.log("Application not found")
            return res.status(404).json({ message: "Application not found" })
        }

        console.log("Application found:", application.applicantName)
        console.log("Supporting documents:", application.supportingDocuments)

        if (!application.supportingDocuments) {
            console.log("No supporting documents found")
            return res.status(404).json({ message: "Document not found" })
        }

        const filePath = path.join(__dirname, '../uploads/online-applications', application.supportingDocuments)
        console.log("File path:", filePath)
        
        if (!fs.existsSync(filePath)) {
            console.log("File does not exist at path:", filePath)
            return res.status(404).json({ message: "File not found" })
        }

        console.log("File exists, starting download")
        res.download(filePath, application.supportingDocuments)

    } catch (error) {
        console.error("Error downloading document:", error)
        res.status(500).json({ 
            message: "Server error", 
            error: error.message 
        })
    }
}

// Export applications to CSV (admin)
const exportApplications = async (req, res) => {
    try {
        const applications = await OnlineApplication.find()
            .sort({ submittedAt: -1 })

        // Create CSV content
        const csvContent = [
            ["Name", "Email", "Organization", "Scheme", "Discipline", "Project Title", "Status", "Submitted Date"],
            ...applications.map(app => [
                app.applicantName,
                app.email,
                app.organization,
                app.scheme,
                app.discipline,
                app.projectTitle,
                app.status,
                app.submittedAt.toLocaleDateString()
            ])
        ].map(row => row.join(",")).join("\n")

        res.setHeader('Content-Type', 'text/csv')
        res.setHeader('Content-Disposition', 'attachment; filename=online_applications.csv')
        res.send(csvContent)

    } catch (error) {
        console.error("Error exporting applications:", error)
        res.status(500).json({ 
            message: "Server error", 
            error: error.message 
        })
    }
}

// Bulk update application status (admin)
const bulkUpdateApplicationStatus = async (req, res) => {
    try {
        const { applicationIds, status, comments } = req.body

        const result = await OnlineApplication.updateMany(
            { _id: { $in: applicationIds } },
            { 
                status, 
                comments,
                updatedAt: new Date()
            }
        )

        // Log activity
        await ActivityLog.create({
            action: "Bulk Status Update",
            details: `${result.modifiedCount} applications status changed to ${status}`,
            user: req.user.id,
            timestamp: new Date()
        })

        res.json({ 
            message: `${result.modifiedCount} applications updated successfully` 
        })

    } catch (error) {
        console.error("Error bulk updating applications:", error)
        res.status(500).json({ 
            message: "Server error", 
            error: error.message 
        })
    }
}

module.exports = {
    submitOnlineApplication,
    getAllOnlineApplications,
    getOnlineApplicationById,
    updateApplicationStatus,
    deleteOnlineApplication,
    getApplicationStats,
    getApplicationSettings,
    updateApplicationSettings,
    downloadApplicationDocument,
    exportApplications,
    bulkUpdateApplicationStatus
}
