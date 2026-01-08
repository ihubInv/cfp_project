const Project = require("../models/Project")
const ActivityLog = require("../models/Activitylog")
const Equipment = require("../models/Equipment")

// Public endpoints
const getPublicProjects = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            discipline,
            scheme,
            year,
            sortBy = "createdAt",
            sortOrder = "desc",
        } = req.query

        console.log("Public projects request params:", req.query) // Debug log

        const query = {} // Show all projects

        // Search functionality
        if (search) {
            query.$text = { $search: search }
        }

        // Filters
        if (discipline) query.discipline = discipline
        if (scheme) query.scheme = scheme
        if (year) {
            query["budget.sanctionYear"] = parseInt(year)
        }

        console.log("Public projects query:", query) // Debug log

        const sort = {}
        sort[sortBy] = sortOrder === "desc" ? -1 : 1

        const projects = await Project.find(query)
            .populate("createdBy", "firstName lastName")
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)

        const total = await Project.countDocuments(query)

        res.json({
            projects,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total,
        })
    } catch (error) {
        console.error("Error fetching public projects:", error)
        res.status(500).json({ message: "Error fetching projects", error: error.message })
    }
}

const getPublicProjectById = async (req, res) => {
    try {
        console.log("Fetching project by ID:", req.params.id) // Debug log
        
        const project = await Project.findOne({
            _id: req.params.id,
            validationStatus: { $ne: "Rejected" } // Show all except rejected
        })
            .populate("createdBy", "firstName lastName")

        console.log("Project found:", project ? "Yes" : "No") // Debug log
        
        if (!project) {
            return res.status(404).json({ message: "Project not found" })
        }

        res.json(project)
    } catch (error) {
        console.error("Error fetching public project:", error)
        res.status(500).json({ message: "Error fetching project", error: error.message })
    }
}

// Get projects by scheme
const getProjectsByScheme = async (req, res) => {
    try {
        const { scheme } = req.params
        const {
            page = 1,
            limit = 10,
            search,
            discipline,
            year,
            sortBy = "createdAt",
            sortOrder = "desc",
        } = req.query

        const query = { 
            scheme: scheme
        }

        console.log("Projects by scheme query:", query) // Debug log

        // Search functionality
        if (search) {
            query.$text = { $search: search }
        }

        // Additional filters
        if (discipline) query.discipline = discipline
        if (year) {
            query["budget.sanctionYear"] = parseInt(year)
        }

        const sort = {}
        sort[sortBy] = sortOrder === "desc" ? -1 : 1

        const projects = await Project.find(query)
            .populate("createdBy", "firstName lastName")
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)

        const total = await Project.countDocuments(query)

        res.json({
            projects,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total,
            scheme: scheme
        })
    } catch (error) {
        console.error("Error fetching projects by scheme:", error)
        res.status(500).json({ message: "Error fetching projects", error: error.message })
    }
}

const getProjectById = async (req, res) => {
    try {
        const query = { _id: req.params.id }
        
        // Filter by user role - PI users can only access their own projects
        if (req.user.role === "PI") {
            query.createdBy = req.user._id
        }
        // Admin and Validator users can access any project (no additional filter)

        const project = await Project.findOne(query)
            .populate("createdBy", "firstName lastName")
            .populate("lastUpdatedBy", "firstName lastName")

        if (!project) {
            return res.status(404).json({ message: "Project not found" })
        }

        res.json(project)
    } catch (error) {
        console.error("Error fetching project:", error)
        res.status(500).json({ message: "Error fetching project", error: error.message })
    }
}

// Admin and PI endpoints
const getAllProjects = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            discipline,
            year,
            sortBy = "createdAt",
            sortOrder = "desc",
        } = req.query

        const query = {}

        // Filter by user role - PI users can only see their own projects
        if (req.user.role === "PI") {
            query.createdBy = req.user._id
            console.log("PI user filtering by createdBy:", req.user._id)
        }
        // Admin and Validator users can see all projects (no additional filter)

        // Search functionality
        if (search) {
            query.$text = { $search: search }
        }

        // Filters
        if (discipline) query.discipline = discipline
        if (year) {
            query["budget.sanctionYear"] = parseInt(year)
        }

        const sort = {}
        sort[sortBy] = sortOrder === "desc" ? -1 : 1

        const projects = await Project.find(query)
            .populate("createdBy", "firstName lastName")
            .populate("lastUpdatedBy", "firstName lastName")
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)

        const total = await Project.countDocuments(query)

        res.json({
            projects,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total,
        })
    } catch (error) {
        console.error("Error fetching projects:", error)
        res.status(500).json({ message: "Error fetching projects", error: error.message })
    }
}

const createProject = async (req, res) => {
    try {
        const userId = req.user._id
        console.log("Creating project for user:", userId, "Role:", req.user.role)
        console.log("Request body:", JSON.stringify(req.body, null, 2))

        // All fields are optional - only validate formats if provided
        
        // Validate email formats if provided
        if (req.body.principalInvestigators && req.body.principalInvestigators.length > 0) {
            for (const pi of req.body.principalInvestigators) {
                if (pi.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pi.email)) {
                    return res.status(400).json({ message: `Invalid PI email format: ${pi.email}` })
                }
            }
        }
        
        if (req.body.coPrincipalInvestigators && req.body.coPrincipalInvestigators.length > 0) {
            for (const coPI of req.body.coPrincipalInvestigators) {
                if (coPI.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(coPI.email)) {
                    return res.status(400).json({ message: `Invalid Co-PI email format: ${coPI.email}` })
                }
            }
        }
        
        // Validate budget amount format if provided
        if (req.body.budget && req.body.budget.totalAmount) {
            const totalAmount = parseFloat(req.body.budget.totalAmount)
            if (isNaN(totalAmount) || totalAmount < 0) {
                return res.status(400).json({ message: "Budget total amount must be a valid positive number if provided" })
            }
        }
        
        // Ensure principalInvestigators is an array (can be empty)
        if (!req.body.principalInvestigators) {
            req.body.principalInvestigators = []
        }
        
        // Ensure coPrincipalInvestigators is an array (can be empty)
        if (!req.body.coPrincipalInvestigators) {
            req.body.coPrincipalInvestigators = []
        }

        // Generate file number if not provided
        let fileNumber = req.body.fileNumber
        if (!fileNumber) {
            const currentYear = req.body.budget?.sanctionYear || new Date().getFullYear()
            const count = await Project.countDocuments({ "budget.sanctionYear": currentYear })
            fileNumber = `SRG/${currentYear}/${String(count + 1).padStart(4, '0')}`
        }

        console.log("Generated file number:", fileNumber)

        // Ensure backward compatibility by setting legacy pi field from first PI (if available)
        const projectData = {
            ...req.body,
            fileNumber,
            createdBy: userId,
            lastUpdatedBy: userId,
            // Set default empty strings for optional fields if not provided
            title: req.body.title || '',
            discipline: req.body.discipline || '',
            scheme: req.body.scheme || '',
            projectSummary: req.body.projectSummary || '',
            // Set legacy fields for backward compatibility
            pi: (req.body.principalInvestigators && req.body.principalInvestigators.length > 0) 
                ? req.body.principalInvestigators[0] 
                : {},
            coPI: (req.body.coPrincipalInvestigators && req.body.coPrincipalInvestigators.length > 0)
                ? req.body.coPrincipalInvestigators[0]
                : {},
        }

        console.log("Project data to save:", JSON.stringify(projectData, null, 2))

        const project = new Project(projectData)
        await project.save()

        console.log("Project saved successfully:", project._id)

        // Sync project equipment to equipment management system
        try {
            await syncProjectEquipmentToInventory(project, userId)
            console.log("Project equipment synced to inventory successfully")
        } catch (syncError) {
            console.error("Failed to sync project equipment:", syncError)
            // Don't fail project creation if equipment sync fails
        }

        // Log activity
        try {
            await ActivityLog.create({
                user: userId,
                action: "CREATE_PROJECT",
                details: `Created project: ${project.title}`,
                projectId: project._id,
                fileNumber: project.fileNumber,
            })
            console.log("Activity logged successfully")
        } catch (logError) {
            console.error("Failed to log activity:", logError)
            // Don't fail project creation if logging fails
        }

        res.status(201).json({
            message: "Project created successfully",
            project,
        })
    } catch (error) {
        console.error("Error creating project:", error)
        console.error("Error details:", error.message)
        console.error("Error stack:", error.stack)
        res.status(500).json({ message: "Error creating project", error: error.message })
    }
}

const updateProject = async (req, res) => {
    try {
        const userId = req.user._id
        const projectId = req.params.id

        const query = { _id: projectId }
        
        // Filter by user role - PI users can only update their own projects
        if (req.user.role === "PI") {
            query.createdBy = req.user._id
        }
        // Admin and Validator users can update any project (no additional filter)

        const project = await Project.findOne(query)
        if (!project) {
            return res.status(404).json({ message: "Project not found" })
        }

        // Ensure backward compatibility by setting legacy fields
        const updateData = {
            ...req.body,
            lastUpdatedBy: userId,
            // Set legacy fields for backward compatibility
            pi: req.body.principalInvestigators?.[0] || project.pi || {},
            coPI: req.body.coPrincipalInvestigators?.[0] || project.coPI || {},
        }

        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            updateData,
            { new: true, runValidators: true }
        )

        // Log activity
        await ActivityLog.create({
            user: userId,
            action: "UPDATE_PROJECT",
            details: `Updated project: ${updatedProject.title}`,
            projectId: updatedProject._id,
            fileNumber: updatedProject.fileNumber,
        })

        res.json({
            message: "Project updated successfully",
            project: updatedProject,
        })
    } catch (error) {
        console.error("Error updating project:", error)
        res.status(500).json({ message: "Error updating project", error: error.message })
    }
}

const deleteProject = async (req, res) => {
    try {
        const userId = req.user._id
        const projectId = req.params.id

        const query = { _id: projectId }
        
        // Filter by user role - PI users can only delete their own projects
        if (req.user.role === "PI") {
            query.createdBy = req.user._id
        }
        // Admin and Validator users can delete any project (no additional filter)

        const project = await Project.findOne(query)
        if (!project) {
            return res.status(404).json({ message: "Project not found" })
        }

        await Project.findByIdAndDelete(projectId)

        // Log activity
        await ActivityLog.create({
            user: userId,
            action: "DELETE_PROJECT",
            details: `Deleted project: ${project.title}`,
            projectId: project._id,
            fileNumber: project.fileNumber,
        })

        res.json({ message: "Project deleted successfully" })
    } catch (error) {
        console.error("Error deleting project:", error)
        res.status(500).json({ message: "Error deleting project", error: error.message })
    }
}


const getProjectStats = async (req, res) => {
    try {
        const stats = await Project.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    validated: { $sum: { $cond: [{ $eq: ["$validationStatus", "Validated"] }, 1, 0] } },
                    pending: { $sum: { $cond: [{ $eq: ["$validationStatus", "Pending"] }, 1, 0] } },
                    rejected: { $sum: { $cond: [{ $eq: ["$validationStatus", "Rejected"] }, 1, 0] } },
                },
            },
        ])

        const disciplineStats = await Project.aggregate([
            {
                $group: {
                    _id: "$discipline",
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
        ])

        res.json({
            overall: stats[0] || { total: 0, validated: 0, pending: 0, rejected: 0 },
            byDiscipline: disciplineStats,
        })
    } catch (error) {
        console.error("Error fetching project stats:", error)
        res.status(500).json({ message: "Error fetching project stats", error: error.message })
    }
}

// Helper function to sync project equipment to equipment inventory
const syncProjectEquipmentToInventory = async (project, userId) => {
    if (!project.equipmentSanctioned || project.equipmentSanctioned.length === 0) {
        console.log("No equipment to sync for project:", project.title)
        return
    }

    console.log(`Syncing ${project.equipmentSanctioned.length} equipment items for project: ${project.title}`)

    for (const equipmentItem of project.equipmentSanctioned) {
        try {
            // Check if equipment already exists (by name and model)
            const existingEquipment = await Equipment.findOne({
                name: equipmentItem.genericName,
                "specifications.model": equipmentItem.model,
                "specifications.manufacturer": equipmentItem.make
            })

            if (existingEquipment) {
                console.log(`Equipment already exists: ${equipmentItem.genericName} - ${equipmentItem.model}`)
                // Update associated projects if not already linked
                if (!existingEquipment.associatedProjects.includes(project._id)) {
                    existingEquipment.associatedProjects.push(project._id)
                    await existingEquipment.save()
                    console.log(`Added project ${project.title} to existing equipment: ${equipmentItem.genericName}`)
                }
                continue
            }

            // Create new equipment entry
            const newEquipment = new Equipment({
                name: equipmentItem.genericName,
                type: "Research Equipment", // Default type
                category: "Project Equipment", // Default category
                description: `Equipment sanctioned for project: ${project.title}`,
                specifications: {
                    model: equipmentItem.model,
                    manufacturer: equipmentItem.make,
                    yearOfPurchase: project.budget?.sanctionYear || new Date().getFullYear(),
                    cost: equipmentItem.priceInr,
                    technicalSpecs: {
                        projectFileNumber: project.fileNumber,
                        projectTitle: project.title,
                        sanctionYear: project.budget?.sanctionYear
                    }
                },
                location: {
                    institution: project.principalInvestigators?.[0]?.instituteName || "IIT Mandi",
                    department: project.principalInvestigators?.[0]?.department || "General",
                    building: "Research Lab",
                    room: "TBD",
                    state: "Himachal Pradesh"
                },
                availability: {
                    status: "Available",
                    accessType: "By Appointment"
                },
                associatedProjects: [project._id],
                contactPerson: {
                    name: project.principalInvestigators?.[0]?.name || "Project PI",
                    email: project.principalInvestigators?.[0]?.email || "",
                    phone: ""
                },
                createdBy: userId
            })

            await newEquipment.save()
            console.log(`Created new equipment: ${equipmentItem.genericName} - ${equipmentItem.model}`)

        } catch (equipmentError) {
            console.error(`Failed to sync equipment ${equipmentItem.genericName}:`, equipmentError)
            // Continue with other equipment items even if one fails
        }
    }
}

module.exports = {
    getPublicProjects,
    getPublicProjectById,
    getProjectsByScheme,
    getProjectById,
    getAllProjects,
    createProject,
    updateProject,
    deleteProject,
    getProjectStats,
    syncProjectEquipmentToInventory, // Export the sync function for manual use
}