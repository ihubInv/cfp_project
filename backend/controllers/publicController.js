const Project = require("../models/Project")
const User = require("../models/User")
const Publication = require("../models/Publication")
const Equipment = require("../models/Equipment")
const Outcome = require("../models/Outcome")

// Get comprehensive funding statistics for homepage
const getFundingStats = async (req, res) => {
    try {
        // Get current year
        const currentYear = new Date().getFullYear()
        
        // Ongoing projects statistics
        const ongoingProjects = await Project.aggregate([
            { $match: { status: "Ongoing" } },
            {
                $group: {
                    _id: "$scheme",
                    count: { $sum: 1 },
                    totalFunding: { $sum: "$budget.totalAmount" }
                }
            },
            { $sort: { count: -1 } }
        ])

        // Proposals received this year
        const proposalsReceived = await Project.aggregate([
            { 
                $match: { 
                    createdAt: { 
                        $gte: new Date(`${currentYear}-01-01`),
                        $lt: new Date(`${currentYear + 1}-01-01`)
                    }
                } 
            },
            {
                $group: {
                    _id: "$scheme",
                    count: { $sum: 1 },
                    totalFunding: { $sum: "$budget.totalAmount" }
                }
            },
            { $sort: { count: -1 } }
        ])

        // Proposals supported this year
        const proposalsSupported = await Project.aggregate([
            { 
                $match: { 
                    createdAt: { 
                        $gte: new Date(`${currentYear}-01-01`),
                        $lt: new Date(`${currentYear + 1}-01-01`)
                    }
                } 
            },
            {
                $group: {
                    _id: "$scheme",
                    count: { $sum: 1 },
                    totalFunding: { $sum: "$budget.totalAmount" }
                }
            },
            { $sort: { count: -1 } }
        ])

        // Project output statistics
        const projectOutput = await Promise.all([
            Publication.countDocuments(),
            Equipment.countDocuments(),
            Project.aggregate([
                { $group: { _id: null, totalManpower: { $sum: "$manpower.total" } } }
            ])
        ])

        // Overall statistics
        const overallStats = await Promise.all([
            Project.countDocuments({ status: "Ongoing" }),
            Project.countDocuments({ 
                createdAt: { 
                    $gte: new Date(`${currentYear}-01-01`),
                    $lt: new Date(`${currentYear + 1}-01-01`)
                }
            }),
            Project.countDocuments({ 
                createdAt: { 
                    $gte: new Date(`${currentYear}-01-01`),
                    $lt: new Date(`${currentYear + 1}-01-01`)
                }
            }),
            Project.aggregate([
                { $group: { _id: null, totalFunding: { $sum: "$budget.totalAmount" } } }
            ])
        ])

        res.json({
            ongoingProjects: {
                total: overallStats[0],
                programs: ongoingProjects
            },
            proposalsReceived: {
                total: overallStats[1],
                programs: proposalsReceived
            },
            proposalsSupported: {
                total: overallStats[2],
                programs: proposalsSupported
            },
            projectOutput: {
                publications: projectOutput[0],
                equipment: projectOutput[1],
                manpower: projectOutput[2][0]?.totalManpower || 0
            },
            totalFunding: overallStats[3][0]?.totalFunding || 0,
            year: currentYear
        })
    } catch (error) {
        console.error("Error fetching funding stats:", error)
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

// Get project statistics by discipline
const getProjectStats = async (req, res) => {
    try {
        const stats = await Project.aggregate([
            {
                $group: {
                    _id: "$discipline",
                    count: { $sum: 1 },
                    totalFunding: { $sum: "$budget.totalAmount" },
                    avgFunding: { $avg: "$budget.totalAmount" }
                }
            },
            { $sort: { count: -1 } }
        ])

        res.json(stats)
    } catch (error) {
        console.error("Error fetching project stats:", error)
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

// Get recent projects
const getRecentProjects = async (req, res) => {
    try {
        const { limit = 10 } = req.query
        
        const projects = await Project.find()
            .populate("createdBy", "firstName lastName email")
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .select("title principalInvestigators budget.totalAmount discipline createdAt")

        res.json(projects)
    } catch (error) {
        console.error("Error fetching recent projects:", error)
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

// Get platform overview statistics
const getPlatformOverview = async (req, res) => {
    try {
        const [
            totalProjects,
            totalUsers,
            totalPublications,
            totalEquipment,
            totalOutcomes,
            fundingStats
        ] = await Promise.all([
            Project.countDocuments(),
            User.countDocuments({ isActive: true }),
            Publication.countDocuments(),
            Equipment.countDocuments(),
            Outcome.countDocuments(),
            Project.aggregate([
                { $group: { _id: null, totalFunding: { $sum: "$budget.totalAmount" } } }
            ])
        ])

        res.json({
            totalProjects,
            totalUsers,
            totalPublications,
            totalEquipment,
            totalOutcomes,
            totalFunding: fundingStats[0]?.totalFunding || 0
        })
    } catch (error) {
        console.error("Error fetching platform overview:", error)
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

module.exports = {
    getFundingStats,
    getProjectStats,
    getRecentProjects,
    getPlatformOverview
}
