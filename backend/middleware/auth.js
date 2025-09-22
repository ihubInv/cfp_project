const { verifyAccessToken } = require("../utils/jwt")
const User = require("../models/User")

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        return res.status(401).json({ message: "Access token required" })
    }

    try {
        const decoded = verifyAccessToken(token)
        const user = await User.findById(decoded.userId).select("-password -refreshToken")

        if (!user || !user.isActive) {
            return res.status(401).json({ message: "Invalid token or user inactive" })
        }

        req.user = user
        next()
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" })
    }
}

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        console.log("Authorizing roles:", roles)
        console.log("User role:", req.user?.role)
        
        if (!req.user) {
            console.log("No user found in request")
            return res.status(401).json({ message: "Authentication required" })
        }

        if (!roles.includes(req.user.role)) {
            console.log("User role not authorized:", req.user.role)
            return res.status(403).json({ message: "Insufficient permissions" })
        }

        console.log("Authorization successful")
        next()
    }
}

module.exports = {
    authenticateToken,
    authorizeRoles,
}
