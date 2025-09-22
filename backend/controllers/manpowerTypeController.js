const ManpowerType = require("../models/ManpowerType")

// Get all manpower types
const getAllManpowerTypes = async (req, res) => {
    try {
        const { category, isActive = true } = req.query

        const query = {}
        if (category) query.category = category
        if (isActive !== undefined) query.isActive = isActive === 'true'

        const manpowerTypes = await ManpowerType.find(query)
            .populate("createdBy", "firstName lastName")
            .sort({ name: 1 })

        res.json({
            success: true,
            data: manpowerTypes,
        })
    } catch (error) {
        console.error("Error fetching manpower types:", error)
        res.status(500).json({ 
            success: false, 
            message: "Error fetching manpower types", 
            error: error.message 
        })
    }
}

// Get manpower type by ID
const getManpowerTypeById = async (req, res) => {
    try {
        const { id } = req.params
        const manpowerType = await ManpowerType.findById(id)
            .populate("createdBy", "firstName lastName")

        if (!manpowerType) {
            return res.status(404).json({
                success: false,
                message: "Manpower type not found",
            })
        }

        res.json({
            success: true,
            data: manpowerType,
        })
    } catch (error) {
        console.error("Error fetching manpower type:", error)
        res.status(500).json({
            success: false,
            message: "Error fetching manpower type",
            error: error.message,
        })
    }
}

// Create new manpower type
const createManpowerType = async (req, res) => {
    try {
        const { name, description, category } = req.body
        const createdBy = req.user.id

        // Check if manpower type already exists
        const existingType = await ManpowerType.findOne({ 
            name: { $regex: new RegExp(`^${name}$`, 'i') } 
        })

        if (existingType) {
            return res.status(400).json({
                success: false,
                message: "Manpower type with this name already exists",
            })
        }

        const manpowerType = new ManpowerType({
            name,
            description,
            category,
            createdBy,
        })

        await manpowerType.save()
        await manpowerType.populate("createdBy", "firstName lastName")

        res.status(201).json({
            success: true,
            message: "Manpower type created successfully",
            data: manpowerType,
        })
    } catch (error) {
        console.error("Error creating manpower type:", error)
        res.status(500).json({
            success: false,
            message: "Error creating manpower type",
            error: error.message,
        })
    }
}

// Update manpower type
const updateManpowerType = async (req, res) => {
    try {
        const { id } = req.params
        const { name, description, category, isActive } = req.body

        const manpowerType = await ManpowerType.findById(id)

        if (!manpowerType) {
            return res.status(404).json({
                success: false,
                message: "Manpower type not found",
            })
        }

        // Check if name is being changed and if new name already exists
        if (name && name !== manpowerType.name) {
            const existingType = await ManpowerType.findOne({ 
                name: { $regex: new RegExp(`^${name}$`, 'i') },
                _id: { $ne: id }
            })

            if (existingType) {
                return res.status(400).json({
                    success: false,
                    message: "Manpower type with this name already exists",
                })
            }
        }

        const updateData = {}
        if (name !== undefined) updateData.name = name
        if (description !== undefined) updateData.description = description
        if (category !== undefined) updateData.category = category
        if (isActive !== undefined) updateData.isActive = isActive

        const updatedManpowerType = await ManpowerType.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate("createdBy", "firstName lastName")

        res.json({
            success: true,
            message: "Manpower type updated successfully",
            data: updatedManpowerType,
        })
    } catch (error) {
        console.error("Error updating manpower type:", error)
        res.status(500).json({
            success: false,
            message: "Error updating manpower type",
            error: error.message,
        })
    }
}

// Delete manpower type
const deleteManpowerType = async (req, res) => {
    try {
        const { id } = req.params

        const manpowerType = await ManpowerType.findById(id)

        if (!manpowerType) {
            return res.status(404).json({
                success: false,
                message: "Manpower type not found",
            })
        }

        // Instead of hard delete, mark as inactive
        await ManpowerType.findByIdAndUpdate(id, { isActive: false })

        res.json({
            success: true,
            message: "Manpower type deactivated successfully",
        })
    } catch (error) {
        console.error("Error deleting manpower type:", error)
        res.status(500).json({
            success: false,
            message: "Error deleting manpower type",
            error: error.message,
        })
    }
}

// Get manpower type statistics
const getManpowerTypeStats = async (req, res) => {
    try {
        const stats = await ManpowerType.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 },
                    activeCount: {
                        $sum: { $cond: ["$isActive", 1, 0] }
                    }
                }
            },
            { $sort: { _id: 1 } }
        ])

        const totalTypes = await ManpowerType.countDocuments()
        const activeTypes = await ManpowerType.countDocuments({ isActive: true })

        res.json({
            success: true,
            data: {
                total: totalTypes,
                active: activeTypes,
                inactive: totalTypes - activeTypes,
                byCategory: stats,
            },
        })
    } catch (error) {
        console.error("Error fetching manpower type stats:", error)
        res.status(500).json({
            success: false,
            message: "Error fetching manpower type statistics",
            error: error.message,
        })
    }
}

module.exports = {
    getAllManpowerTypes,
    getManpowerTypeById,
    createManpowerType,
    updateManpowerType,
    deleteManpowerType,
    getManpowerTypeStats,
}
