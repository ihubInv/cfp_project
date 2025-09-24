const User = require("../models/User")
const ActivityLog = require("../models/Activitylog")
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require("../utils/jwt")

const register = async (req, res) => {
    try {
        const { username, email, password, firstName, lastName, institution, role } = req.body

        // Validate required fields
        if (!username || !email || !password || !firstName || !lastName || !institution) {
            return res.status(400).json({
                message: "All fields are required",
            })
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        })

        if (existingUser) {
            return res.status(400).json({
                message: "User with this email or username already exists",
            })
        }

        // Create new user
        const user = new User({
            username,
            email,
            password,
            firstName,
            lastName,
            institution,
            role: role || "Public",
        })

        await user.save()

        // Log activity (with error handling)
        try {
            await ActivityLog.create({
                user: user._id,
                action: "CREATE_USER",
                targetType: "User",
                targetId: user._id,
                details: {
                    description: "User registered successfully",
                },
                ipAddress: req.ip,
                userAgent: req.get("User-Agent"),
            })
        } catch (logError) {
            console.error("Failed to log user registration activity:", logError)
            // Don't fail registration if logging fails
        }

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        })
    } catch (error) {
        console.error("Registration error:", error)
        res.status(500).json({ 
            message: "Server error", 
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body

        // Find user
        const user = await User.findOne({ email })
        if (!user || !user.isActive) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        // Generate tokens
        const accessToken = generateAccessToken({ userId: user._id, role: user.role })
        const refreshToken = generateRefreshToken({ userId: user._id })

        // Save refresh token
        user.refreshToken = refreshToken
        await user.save()

        // Log activity
        await ActivityLog.create({
            user: user._id,
            action: "LOGIN",
            targetType: "System",
            details: {
                description: "User logged in successfully",
            },
            ipAddress: req.ip,
            userAgent: req.get("User-Agent"),
        })

        res.json({
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                institution: user.institution,
            },
            accessToken,
            refreshToken,
        })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body

        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token required" })
        }

        const decoded = verifyRefreshToken(refreshToken)
        const user = await User.findById(decoded.userId)

        if (!user || user.refreshToken !== refreshToken || !user.isActive) {
            return res.status(403).json({ message: "Invalid refresh token" })
        }

        // Generate new access token
        const newAccessToken = generateAccessToken({ userId: user._id, role: user.role })

        res.json({
            accessToken: newAccessToken,
        })
    } catch (error) {
        res.status(403).json({ message: "Invalid refresh token" })
    }
}

const logout = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        if (user) {
            user.refreshToken = null
            await user.save()

            // Log activity
            await ActivityLog.create({
                user: user._id,
                action: "LOGOUT",
                targetType: "System",
                details: {
                    description: "User logged out successfully",
                },
                ipAddress: req.ip,
                userAgent: req.get("User-Agent"),
            })
        }

        res.json({ message: "Logout successful" })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

const testRegistration = async (req, res) => {
    try {
        console.log("Test registration endpoint called")
        console.log("Request body:", req.body)
        console.log("Request headers:", req.headers)
        
        res.json({
            message: "Test endpoint working",
            body: req.body,
            timestamp: new Date().toISOString()
        })
    } catch (error) {
        console.error("Test endpoint error:", error)
        res.status(500).json({ message: "Test endpoint error", error: error.message })
    }
}

module.exports = {
    register,
    login,
    refreshToken,
    logout,
    testRegistration,
}
