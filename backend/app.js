const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
require("dotenv").config()

const connectDB = require("./config/database")

// Import routes
const authRoutes = require("./routes/auth")
const projectRoutes = require("./routes/projects")
const userRoutes = require("./routes/users")
const analyticsRoutes = require("./routes/analytics")
const fileRoutes = require("./routes/files")
const equipmentRoutes = require("./routes/equipment")
const publicationRoutes = require("./routes/publications")
const outcomeRoutes = require("./routes/outcomes")
const publicRoutes = require("./routes/public")
const categoryRoutes = require("./routes/categories")
const schemeRoutes = require("./routes/schemes")
const manpowerTypeRoutes = require("./routes/manpowerTypes")
const activityLogRoutes = require("./routes/activityLogs")
const settingsRoutes = require("./routes/settings")
const piProjectRoutes = require("./routes/piProjects")
const onlineApplicationRoutes = require("./routes/onlineApplications")

const app = express()

// Connect to database
connectDB()

// Middleware
app.use(helmet())
app.use(
    cors({
        origin: process.env.FRONTEND_URL 
            ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
            : ["http://72.60.206.223:3000", "http://cfpihubiitmandi.cloud", "https://cfpihubiitmandi.cloud", "http://www.cfpihubiitmandi.cloud", "https://www.cfpihubiitmandi.cloud"],
        credentials: true,
    }),
)
app.use(morgan("combined"))
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/projects", projectRoutes)
app.use("/api/users", userRoutes)
app.use("/api/analytics", analyticsRoutes)
app.use("/api/files", fileRoutes)
app.use("/api/equipment", equipmentRoutes)
app.use("/api/publications", publicationRoutes)
app.use("/api/outcomes", outcomeRoutes)
app.use("/api/public", publicRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/schemes", schemeRoutes)
app.use("/api/manpower-types", manpowerTypeRoutes)
app.use("/api/activity-logs", activityLogRoutes)
app.use("/api/settings", settingsRoutes)
app.use("/api/pi-projects", piProjectRoutes)
app.use("/api/online-applications", onlineApplicationRoutes)

// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() })
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ message: "Something went wrong!" })
})

// 404 handler
app.use("*", (req, res) => {
    res.status(404).json({ message: "Route not found" })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`)
})

module.exports = app
