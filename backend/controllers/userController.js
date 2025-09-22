const User = require("../models/User")
const ActivityLog = require("../models/ActivityLog")

const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, role, isActive } = req.query

        const query = {}

        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { username: { $regex: search, $options: "i" } },
                { institution: { $regex: search, $options: "i" } },
            ]
        }

        if (role) query.role = role
        if (isActive !== undefined) query.isActive = isActive === "true"

        const users = await User.find(query)
            .select("-password -refreshToken")
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)

        const total = await User.countDocuments(query)

        res.json({
            users,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total,
        })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

const createUser = async (req, res) => {
    try {
        const { username, email, password, firstName, lastName, institution, role } = req.body

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        })

        if (existingUser) {
            return res.status(400).json({
                message: "User with this email or username already exists",
            })
        }

        const user = new User({
            username,
            email,
            password,
            firstName,
            lastName,
            institution,
            role,
        })

        await user.save()

        // Log activity
        await ActivityLog.create({
            user: req.user._id,
            action: "CREATE_USER",
            targetType: "User",
            targetId: user._id,
            details: {
                description: `Created user: ${user.firstName} ${user.lastName}`,
            },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        })

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                institution: user.institution,
                role: user.role,
                isActive: user.isActive,
            },
        })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params
        const updateData = req.body

        // Remove sensitive fields from update
        delete updateData.password
        delete updateData.refreshToken

        const user = await User.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        }).select("-password -refreshToken")

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        // Log activity
        await ActivityLog.create({
            user: req.user._id,
            action: "UPDATE_USER",
            targetType: "User",
            targetId: user._id,
            details: {
                description: `Updated user: ${user.firstName} ${user.lastName}`,
                changes: updateData,
            },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        })

        res.json({
            message: "User updated successfully",
            user,
        })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params

        const user = await User.findById(id)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        // Soft delete - deactivate user instead of removing
        user.isActive = false
        await user.save()

        // Log activity
        await ActivityLog.create({
            user: req.user._id,
            action: "DELETE_USER",
            targetType: "User",
            targetId: user._id,
            details: {
                description: `Deactivated user: ${user.firstName} ${user.lastName}`,
            },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        })

        res.json({ message: "User deactivated successfully" })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

const getUserStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments()
        const activeUsers = await User.countDocuments({ isActive: true })
        const usersByRole = await User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }])

        const recentUsers = await User.find({ isActive: true })
            .select("-password -refreshToken")
            .sort({ createdAt: -1 })
            .limit(5)

        res.json({
            totalUsers,
            activeUsers,
            inactiveUsers: totalUsers - activeUsers,
            usersByRole,
            recentUsers,
        })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserStats,
}
