const Project = require("../models/Project")
const User = require("../models/User")
const Publication = require("../models/Publication")
const Equipment = require("../models/Equipment")

const getDashboardStats = async (req, res) => {
    try {
        // Basic counts
        const totalProjects = await Project.countDocuments()
        const ongoingProjects = await Project.countDocuments({
            status: "Ongoing",
        })
        const completedProjects = await Project.countDocuments({
            status: "Completed",
        })

        const totalUsers = await User.countDocuments({ isActive: true })
        const totalPublications = await Publication.countDocuments()
        const totalEquipment = await Equipment.countDocuments()

        // Funding statistics
        const fundingStats = await Project.aggregate([
            {
                $group: {
                    _id: null,
                    totalFunding: { $sum: "$budget.totalAmount" },
                    avgFunding: { $avg: "$budget.totalAmount" },
                },
            },
        ])

        // Projects by discipline
        const projectsByDiscipline = await Project.aggregate([
            { $group: { _id: "$discipline", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ])

        // Projects by state
        const projectsByState = await Project.aggregate([
            { $group: { _id: "$state", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
        ])

        // Funding by year
        const fundingByYear = await Project.aggregate([
            {
                $group: {
                    _id: "$budget.sanctionYear",
                    totalFunding: { $sum: "$budget.totalAmount" },
                    projectCount: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ])

        // Recent activity
        const recentProjects = await Project.find()
            .populate("createdBy", "firstName lastName")
            .sort({ createdAt: -1 })
            .limit(5)
            .select("title principalInvestigators budget.totalAmount createdAt")

        res.json({
            overview: {
                totalProjects,
                ongoingProjects,
                completedProjects,
                totalUsers,
                totalPublications,
                totalEquipment,
                totalFunding: fundingStats[0]?.totalFunding || 0,
                avgFunding: fundingStats[0]?.avgFunding || 0,
            },
            charts: {
                projectsByDiscipline,
                projectsByState,
                fundingByYear,
            },
            recentActivity: {
                recentProjects,
            },
        })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

const getFundingStats = async (req, res) => {
    try {
        const fundingByProgram = await Project.aggregate([
            {
                $group: {
                    _id: "$scheme",
                    totalFunding: { $sum: "$budget.totalAmount" },
                    projectCount: { $sum: 1 },
                    avgFunding: { $avg: "$budget.totalAmount" },
                },
            },
            { $sort: { totalFunding: -1 } },
        ])

        const fundingByDiscipline = await Project.aggregate([
            {
                $group: {
                    _id: "$discipline",
                    totalFunding: { $sum: "$budget.totalAmount" },
                    projectCount: { $sum: 1 },
                },
            },
            { $sort: { totalFunding: -1 } },
        ])

        const fundingTrends = await Project.aggregate([
            {
                $group: {
                    _id: {
                        year: "$budget.sanctionYear",
                        month: { $month: "$createdAt" },
                    },
                    totalFunding: { $sum: "$budget.totalAmount" },
                    projectCount: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ])

        res.json({
            fundingByProgram,
            fundingByDiscipline,
            fundingTrends,
        })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

module.exports = {
    getDashboardStats,
    getFundingStats,
}
