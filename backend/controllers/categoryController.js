const Category = require("../models/Category")
const ActivityLog = require("../models/ActivityLog")

// Get all disciplines
const getAllDisciplines = async (req, res) => {
    try {
        const { isActive = true } = req.query
        const query = isActive !== 'false' ? { isActive: true } : {}

        const disciplines = await Category.find(query)
            .populate("createdBy", "firstName lastName")
            .sort({ name: 1 })

        res.json(disciplines)
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

// Get discipline by ID
const getDisciplineById = async (req, res) => {
    try {
        const discipline = await Category.findById(req.params.id)
            .populate("createdBy", "firstName lastName")

        if (!discipline) {
            return res.status(404).json({ message: "Discipline not found" })
        }

        res.json(discipline)
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

// Create new discipline
const createDiscipline = async (req, res) => {
    try {
        const { name, description } = req.body

        // Check if discipline already exists
        const existingDiscipline = await Category.findOne({ 
            name: { $regex: new RegExp(`^${name}$`, 'i') }
        })

        if (existingDiscipline) {
            return res.status(400).json({ 
                message: "Discipline with this name already exists" 
            })
        }

        const disciplineData = {
            name: name.trim(),
            description: description?.trim() || "",
            createdBy: req.user._id,
        }

        const discipline = new Category(disciplineData)
        await discipline.save()

        // Populate the createdBy field for response
        await discipline.populate("createdBy", "firstName lastName")

        // Log activity
        await ActivityLog.create({
            user: req.user._id,
            action: "CREATE_DISCIPLINE",
            targetType: "Discipline",
            targetId: discipline._id,
            details: {
                description: `Created discipline: ${discipline.name}`,
            },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        })

        res.status(201).json({
            message: "Discipline created successfully",
            discipline,
        })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: "Discipline with this name already exists" 
            })
        }
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

// Update discipline
const updateDiscipline = async (req, res) => {
    try {
        const { name, description, isActive } = req.body

        const discipline = await Category.findById(req.params.id)

        if (!discipline) {
            return res.status(404).json({ message: "Discipline not found" })
        }

        // Check if name is being changed and if it conflicts
        if (name && name !== discipline.name) {
            const existingDiscipline = await Category.findOne({ 
                name: { $regex: new RegExp(`^${name}$`, 'i') },
                _id: { $ne: req.params.id }
            })

            if (existingDiscipline) {
                return res.status(400).json({ 
                    message: "Discipline with this name already exists" 
                })
            }
        }

        const updateData = {}
        if (name) updateData.name = name.trim()
        if (description !== undefined) updateData.description = description?.trim() || ""
        if (isActive !== undefined) updateData.isActive = isActive

        const updatedDiscipline = await Category.findByIdAndUpdate(
            req.params.id, 
            updateData, 
            { new: true, runValidators: true }
        ).populate("createdBy", "firstName lastName")

        // Log activity
        await ActivityLog.create({
            user: req.user._id,
            action: "UPDATE_DISCIPLINE",
            targetType: "Discipline",
            targetId: discipline._id,
            details: {
                description: `Updated discipline: ${discipline.name}`,
                changes: updateData,
            },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        })

        res.json({
            message: "Discipline updated successfully",
            discipline: updatedDiscipline,
        })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: "Discipline with this name already exists" 
            })
        }
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

// Delete discipline (soft delete)
const deleteDiscipline = async (req, res) => {
    try {
        const discipline = await Category.findById(req.params.id)

        if (!discipline) {
            return res.status(404).json({ message: "Discipline not found" })
        }

        // Soft delete by setting isActive to false
        await Category.findByIdAndUpdate(req.params.id, { isActive: false })

        // Log activity
        await ActivityLog.create({
            user: req.user._id,
            action: "DELETE_DISCIPLINE",
            targetType: "Discipline",
            targetId: discipline._id,
            details: {
                description: `Deleted discipline: ${discipline.name}`,
            },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        })

        res.json({
            message: "Discipline deleted successfully",
        })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

// Initialize default disciplines
const initializeDefaultDisciplines = async (req, res) => {
    try {
        const defaultDisciplines = [
            "Assistive Technology",
            "Device-Led Technology", 
            "Experience Technology",
            "Generative AI",
            "Road Safety",
            "Transitional Research"
        ]

        const existingDisciplines = await Category.find({})
        const existingNames = existingDisciplines.map(discipline => discipline.name.toLowerCase())

        const newDisciplines = []
        
        for (const disciplineName of defaultDisciplines) {
            if (!existingNames.includes(disciplineName.toLowerCase())) {
                const discipline = new Category({
                    name: disciplineName,
                    description: `Default discipline: ${disciplineName}`,
                    createdBy: req.user._id,
                })
                await discipline.save()
                newDisciplines.push(discipline)
            }
        }

        // Log activity
        if (newDisciplines.length > 0) {
            await ActivityLog.create({
                user: req.user._id,
                action: "INITIALIZE_DISCIPLINES",
                targetType: "Discipline",
                details: {
                    description: `Initialized ${newDisciplines.length} default disciplines`,
                },
                ipAddress: req.ip,
                userAgent: req.get("User-Agent"),
            })
        }

        res.json({
            message: `${newDisciplines.length} default disciplines initialized`,
            disciplines: newDisciplines,
        })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

// Backward compatibility functions (aliases)
const getAllCategories = getAllDisciplines
const getCategoryById = getDisciplineById
const createCategory = createDiscipline
const updateCategory = updateDiscipline
const deleteCategory = deleteDiscipline
const initializeDefaultCategories = initializeDefaultDisciplines

module.exports = {
    getAllDisciplines,
    getDisciplineById,
    createDiscipline,
    updateDiscipline,
    deleteDiscipline,
    initializeDefaultDisciplines,
    // Keep old exports for backward compatibility
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    initializeDefaultCategories,
}
