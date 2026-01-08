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
        
        // Ongoing projects statistics (using validationStatus)
        const ongoingProjects = await Project.aggregate([
            { $match: { validationStatus: "Ongoing" } },
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

        // Project output statistics - get real counts from database
        // Count all publications from projects - use a simpler approach
        const publicationsCountResult = await Project.aggregate([
            {
                $project: {
                    publicationsCount: { 
                        $cond: [
                            { $isArray: "$publications" },
                            { $size: "$publications" },
                            0
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$publicationsCount" }
                }
            }
        ])
        const publicationsCount = publicationsCountResult.length > 0 && publicationsCountResult[0].total ? publicationsCountResult[0].total : 0
        
        // Debug: Log for troubleshooting
        console.log("Publications aggregation result:", JSON.stringify(publicationsCountResult, null, 2))
        console.log("Final publications count:", publicationsCount)

        // Count equipment
        const equipmentCount = await Equipment.countDocuments()

        // Calculate total manpower from manpowerSanctioned arrays
        const manpowerResult = await Project.aggregate([
            { $match: { manpowerSanctioned: { $exists: true, $ne: [] } } },
            { $unwind: "$manpowerSanctioned" },
            { $group: { _id: null, totalManpower: { $sum: { $ifNull: ["$manpowerSanctioned.number", 0] } } } }
        ])
        const manpowerCount = manpowerResult.length > 0 ? manpowerResult[0].totalManpower : 0

        const projectOutput = [publicationsCount, equipmentCount, manpowerCount]

        // Overall statistics - get real-time counts
        const overallStats = await Promise.all([
            // Active/Ongoing projects
            Project.countDocuments({ validationStatus: "Ongoing" }),
            // Completed projects
            Project.countDocuments({ validationStatus: "Completed" }),
            // Proposals received this year
            Project.countDocuments({ 
                createdAt: { 
                    $gte: new Date(`${currentYear}-01-01`),
                    $lt: new Date(`${currentYear + 1}-01-01`)
                }
            }),
            // Total funding
            Project.aggregate([
                { $group: { _id: null, totalFunding: { $sum: { $ifNull: ["$budget.totalAmount", 0] } } } }
            ])
        ])

        res.json({
            ongoingProjects: {
                total: overallStats[0],
                programs: ongoingProjects
            },
            completedProjects: overallStats[1], // Add completed projects count
            activeProjects: overallStats[0], // Alias for active projects
            proposalsReceived: {
                total: overallStats[2],
                programs: proposalsReceived
            },
            proposalsSupported: {
                total: overallStats[2],
                programs: proposalsSupported
            },
            projectOutput: {
                publications: projectOutput[0] || 0, // Count from aggregation (already handled)
                equipment: projectOutput[1] || 0,
                manpower: projectOutput[2] || 0
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

// Get all publications from projects (public endpoint)
const getPublicPublications = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            search, 
            type, 
            year,
            discipline 
        } = req.query

        // Build aggregation pipeline to extract publications from projects
        const pipeline = [
            // Match projects that have publications
            {
                $match: {
                    publications: { $exists: true, $ne: [] }
                }
            },
            // Unwind publications array
            {
                $unwind: "$publications"
            },
            // Add project information to each publication
            {
                $addFields: {
                    "publications.projectId": "$_id",
                    "publications.projectTitle": "$title",
                    "publications.projectFileNumber": "$fileNumber",
                    "publications.projectDiscipline": "$discipline",
                    "publications.projectScheme": "$scheme",
                    "publications.principalInvestigators": "$principalInvestigators",
                    "publications.coPrincipalInvestigators": "$coPrincipalInvestigators"
                }
            },
            // Replace root with publication data
            {
                $replaceRoot: { newRoot: "$publications" }
            }
        ]

        // Add search filter
        if (search) {
            pipeline.push({
                $match: {
                    $or: [
                        { name: { $regex: search, $options: "i" } },
                        { publicationDetail: { $regex: search, $options: "i" } },
                        { projectTitle: { $regex: search, $options: "i" } }
                    ]
                }
            })
        }

        // Add type filter (if you want to filter by publication type)
        if (type && type !== "all") {
            pipeline.push({
                $match: { status: type }
            })
        }

        // Add discipline filter
        if (discipline && discipline !== "all") {
            pipeline.push({
                $match: { projectDiscipline: discipline }
            })
        }

        // Add year filter (if you want to filter by year)
        if (year && year !== "all") {
            pipeline.push({
                $match: { 
                    createdAt: { 
                        $gte: new Date(`${year}-01-01`),
                        $lt: new Date(`${parseInt(year) + 1}-01-01`)
                    }
                }
            })
        }

        // Add pagination
        const skip = (page - 1) * limit
        pipeline.push(
            { $skip: skip },
            { $limit: parseInt(limit) },
            { $sort: { _id: -1 } }
        )

        // Execute aggregation
        const publications = await Project.aggregate(pipeline)

        // Get total count for pagination
        const countPipeline = [
            {
                $match: {
                    publications: { $exists: true, $ne: [] }
                }
            },
            {
                $unwind: "$publications"
            },
            {
                $addFields: {
                    "publications.projectId": "$_id",
                    "publications.projectTitle": "$title"
                }
            },
            {
                $replaceRoot: { newRoot: "$publications" }
            }
        ]

        // Add same filters to count pipeline
        if (search) {
            countPipeline.push({
                $match: {
                    $or: [
                        { name: { $regex: search, $options: "i" } },
                        { publicationDetail: { $regex: search, $options: "i" } },
                        { projectTitle: { $regex: search, $options: "i" } }
                    ]
                }
            })
        }

        if (type && type !== "all") {
            countPipeline.push({
                $match: { status: type }
            })
        }

        if (discipline && discipline !== "all") {
            countPipeline.push({
                $match: { projectDiscipline: discipline }
            })
        }

        if (year && year !== "all") {
            countPipeline.push({
                $match: { 
                    createdAt: { 
                        $gte: new Date(`${year}-01-01`),
                        $lt: new Date(`${parseInt(year) + 1}-01-01`)
                    }
                }
            })
        }

        const total = await Project.aggregate([...countPipeline, { $count: "total" }])
        const totalCount = total.length > 0 ? total[0].total : 0

        res.json({
            publications,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: parseInt(page),
            total: totalCount
        })
    } catch (error) {
        console.error("Error fetching public publications:", error)
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

module.exports = {
    getFundingStats,
    getProjectStats,
    getRecentProjects,
    getPlatformOverview,
    getPublicPublications
}
