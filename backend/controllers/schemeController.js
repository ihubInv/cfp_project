const Scheme = require("../models/Scheme")
const ActivityLog = require("../models/Activitylog")

// Get all schemes
const getAllSchemes = async (req, res) => {
    try {
        const { isActive } = req.query
        let query = {}
        
        // Only filter by isActive if explicitly requested
        if (isActive !== undefined) {
            query.isActive = isActive === 'true'
        }

        const schemes = await Scheme.find(query)
            .populate("createdBy", "firstName lastName")
            .sort({ name: 1 })

        res.json(schemes)
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

// Get scheme by ID
const getSchemeById = async (req, res) => {
    try {
        const scheme = await Scheme.findById(req.params.id)
            .populate("createdBy", "firstName lastName")

        if (!scheme) {
            return res.status(404).json({ message: "Scheme not found" })
        }

        res.json(scheme)
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

// Create new scheme
const createScheme = async (req, res) => {
    try {
        const { name, description } = req.body

        // Check if scheme already exists
        const existingScheme = await Scheme.findOne({ 
            name: { $regex: new RegExp(`^${name}$`, 'i') }
        })

        if (existingScheme) {
            return res.status(400).json({ 
                message: "Scheme with this name already exists" 
            })
        }

        const schemeData = {
            name: name.trim(),
            description: description?.trim() || "",
            createdBy: req.user._id,
        }

        const scheme = new Scheme(schemeData)
        await scheme.save()

        // Populate the createdBy field for response
        await scheme.populate("createdBy", "firstName lastName")

        // Log activity
        await ActivityLog.create({
            user: req.user._id,
            action: "CREATE_SCHEME",
            targetType: "Scheme",
            targetId: scheme._id,
            details: {
                description: `Created scheme: ${scheme.name}`,
            },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        })

        res.status(201).json({
            message: "Scheme created successfully",
            scheme,
        })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: "Scheme with this name already exists" 
            })
        }
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

// Update scheme
const updateScheme = async (req, res) => {
    try {
        const { name, description, isActive } = req.body

        const scheme = await Scheme.findById(req.params.id)

        if (!scheme) {
            return res.status(404).json({ message: "Scheme not found" })
        }

        // Check if name is being changed and if it conflicts
        if (name && name !== scheme.name) {
            const existingScheme = await Scheme.findOne({ 
                name: { $regex: new RegExp(`^${name}$`, 'i') },
                _id: { $ne: req.params.id }
            })

            if (existingScheme) {
                return res.status(400).json({ 
                    message: "Scheme with this name already exists" 
                })
            }
        }

        const updateData = {}
        if (name) updateData.name = name.trim()
        if (description !== undefined) updateData.description = description?.trim() || ""
        if (isActive !== undefined) updateData.isActive = isActive

        const updatedScheme = await Scheme.findByIdAndUpdate(
            req.params.id, 
            updateData, 
            { new: true, runValidators: true }
        ).populate("createdBy", "firstName lastName")

        // Log activity
        await ActivityLog.create({
            user: req.user._id,
            action: "UPDATE_SCHEME",
            targetType: "Scheme",
            targetId: scheme._id,
            details: {
                description: `Updated scheme: ${scheme.name}`,
                changes: updateData,
            },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        })

        res.json({
            message: "Scheme updated successfully",
            scheme: updatedScheme,
        })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: "Scheme with this name already exists" 
            })
        }
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

// Delete scheme (soft delete)
const deleteScheme = async (req, res) => {
    try {
        console.log("Delete scheme request received")
        console.log("Scheme ID:", req.params.id)
        console.log("User:", req.user)
        
        const scheme = await Scheme.findById(req.params.id)

        if (!scheme) {
            console.log("Scheme not found:", req.params.id)
            return res.status(404).json({ message: "Scheme not found" })
        }

        console.log("Found scheme:", scheme.name)

        // Check if scheme is being used by any projects
        const Project = require("../models/Project")
        const projectsUsingScheme = await Project.countDocuments({ scheme: scheme.name })
        
        console.log("Projects using scheme:", projectsUsingScheme)
        
        if (projectsUsingScheme > 0) {
            console.log("Cannot delete - scheme in use")
            return res.status(400).json({ 
                message: `Cannot delete scheme "${scheme.name}" as it is being used by ${projectsUsingScheme} project(s). Please reassign those projects to a different scheme first.` 
            })
        }

        // Soft delete by setting isActive to false
        console.log("Proceeding with soft delete")
        await Scheme.findByIdAndUpdate(req.params.id, { isActive: false })

        // Log activity (with error handling)
        try {
            await ActivityLog.create({
                user: req.user._id,
                action: "DELETE_SCHEME",
                targetType: "Scheme",
                targetId: scheme._id,
                details: {
                    description: `Deleted scheme: ${scheme.name}`,
                },
                ipAddress: req.ip,
                userAgent: req.get("User-Agent"),
            })
            console.log("Activity logged successfully")
        } catch (logError) {
            console.error("Failed to log scheme deletion activity:", logError)
            // Don't fail the deletion if logging fails
        }

        console.log("Scheme deleted successfully")
        res.json({
            message: "Scheme deleted successfully",
        })
    } catch (error) {
        console.error("Error deleting scheme:", error)
        res.status(500).json({ 
            message: "Server error", 
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        })
    }
}

// Permanently delete scheme (hard delete)
const permanentDeleteScheme = async (req, res) => {
    try {
        console.log("Permanent delete scheme request received")
        console.log("Scheme ID:", req.params.id)
        console.log("User:", req.user)
        
        const scheme = await Scheme.findById(req.params.id)

        if (!scheme) {
            console.log("Scheme not found:", req.params.id)
            return res.status(404).json({ message: "Scheme not found" })
        }

        console.log("Found scheme:", scheme.name)

        // Check if scheme is being used by any projects
        const Project = require("../models/Project")
        const projectsUsingScheme = await Project.countDocuments({ scheme: scheme.name })
        
        console.log("Projects using scheme:", projectsUsingScheme)
        
        if (projectsUsingScheme > 0) {
            console.log("Cannot permanently delete - scheme in use")
            return res.status(400).json({ 
                message: `Cannot permanently delete scheme "${scheme.name}" as it is being used by ${projectsUsingScheme} project(s). Please reassign those projects to a different scheme first.` 
            })
        }

        // Permanently delete from database
        console.log("Proceeding with permanent delete")
        await Scheme.findByIdAndDelete(req.params.id)

        // Log activity (with error handling)
        try {
            await ActivityLog.create({
                user: req.user._id,
                action: "PERMANENT_DELETE_SCHEME",
                targetType: "Scheme",
                targetId: scheme._id,
                details: {
                    description: `Permanently deleted scheme: ${scheme.name}`,
                },
                ipAddress: req.ip,
                userAgent: req.get("User-Agent"),
            })
            console.log("Activity logged successfully")
        } catch (logError) {
            console.error("Failed to log scheme permanent deletion activity:", logError)
            // Don't fail the deletion if logging fails
        }

        console.log("Scheme permanently deleted successfully")
        res.json({
            message: "Scheme permanently deleted successfully",
        })
    } catch (error) {
        console.error("Error permanently deleting scheme:", error)
        res.status(500).json({ 
            message: "Server error", 
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        })
    }
}

// Initialize default schemes
const initializeDefaultSchemes = async (req, res) => {
    try {
        const defaultSchemes = [
            "Seminar/Symposia (SSY)",
            "Prime Minister Early Career Research Grant",
            "Empowerment and Equity Opportunities for Excellence in Science (EMEQ)",
            "Start-up Research Grant (SRG)",
            "State University Research Excellence (SERB SURE)",
            "Mathematical Research Impact Centric Support (MATRICS)",
            "International Travel Support (ITS)",
            "High Impact Proposal in Interdisciplinary Sciences (HIPIS)",
            "Ramanujan Fellowship",
            "JC Bose Fellowship",
            "SwarnaJayanti Fellowships",
            "National Post Doctoral Fellowship (N-PDF)",
            "Women Excellence Award",
            "Distinguished Investigator Award (DIA)"
        ]

        const existingSchemes = await Scheme.find({})
        const existingNames = existingSchemes.map(scheme => scheme.name.toLowerCase())

        const newSchemes = []
        
        for (const schemeName of defaultSchemes) {
            if (!existingNames.includes(schemeName.toLowerCase())) {
                const scheme = new Scheme({
                    name: schemeName,
                    description: `Default scheme: ${schemeName}`,
                    createdBy: req.user._id,
                })
                await scheme.save()
                newSchemes.push(scheme)
            }
        }

        // Log activity
        if (newSchemes.length > 0) {
            await ActivityLog.create({
                user: req.user._id,
                action: "INITIALIZE_SCHEMES",
                targetType: "Scheme",
                details: {
                    description: `Initialized ${newSchemes.length} default schemes`,
                },
                ipAddress: req.ip,
                userAgent: req.get("User-Agent"),
            })
        }

        res.json({
            message: `${newSchemes.length} default schemes initialized`,
            schemes: newSchemes,
        })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

module.exports = {
    getAllSchemes,
    getSchemeById,
    createScheme,
    updateScheme,
    deleteScheme,
    permanentDeleteScheme,
    initializeDefaultSchemes,
}
