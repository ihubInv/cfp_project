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
        
        // Ongoing projects statistics (check validationStatus field)
        const ongoingProjects = await Project.aggregate([
            { 
                $match: { 
                    $or: [
                        { validationStatus: "Ongoing" },
                        { $and: [
                            { $or: [{ validationStatus: { $exists: false } }, { validationStatus: null }] },
                            { status: { $in: ["Ongoing", "ongoing", "ONGOING"] } }
                        ]}
                    ]
                } 
            },
            {
                $group: {
                    _id: { $ifNull: ["$scheme", "Other"] },
                    count: { $sum: 1 },
                    totalFunding: { $sum: { $ifNull: ["$budget.totalAmount", 0] } }
                }
            },
            { $sort: { count: -1 } }
        ])

        // Proposals received (all time, not just current year)
        // Handle null/empty schemes by grouping them as "Other" or the scheme name
        const proposalsReceived = await Project.aggregate([
            {
                $group: {
                    _id: { $ifNull: ["$scheme", "Other"] },
                    count: { $sum: 1 },
                    totalFunding: { $sum: { $ifNull: ["$budget.totalAmount", 0] } }
                }
            },
            { $sort: { count: -1 } }
        ])

        // Proposals supported/approved (all time, not just current year)
        const proposalsSupported = await Project.aggregate([
            {
                $group: {
                    _id: { $ifNull: ["$scheme", "Other"] },
                    count: { $sum: 1 },
                    totalFunding: { $sum: { $ifNull: ["$budget.totalAmount", 0] } }
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

        // Get total count of ALL projects first (this is the source of truth)
        const totalProjectsCount = await Project.countDocuments()

        // Overall statistics - get real-time counts (all time, not just current year)
        const overallStats = await Promise.all([
            // Active/Ongoing projects - check validationStatus field (mapped from status in frontend)
            // Also check status field as fallback for backward compatibility
            Project.countDocuments({ 
                $or: [
                    { validationStatus: "Ongoing" },
                    { $and: [
                        { $or: [{ validationStatus: { $exists: false } }, { validationStatus: null }] },
                        { status: { $in: ["Ongoing", "ongoing", "ONGOING"] } }
                    ]}
                ]
            }),
            // Completed projects - check validationStatus field (primary)
            // This is set by the admin panel when Project Status is set to "Completed"
            Project.countDocuments({ 
                validationStatus: "Completed"
            }),
            // Total funding
            Project.aggregate([
                { $group: { _id: null, totalFunding: { $sum: { $ifNull: ["$budget.totalAmount", 0] } } } }
            ])
        ])

        // Debug: Check projects with Completed validationStatus
        const completedProjectsDebug = await Project.find({ 
            validationStatus: "Completed"
        }).select("_id title validationStatus status fileNumber").limit(10)
        
        console.log("=== Sample Completed Projects ===")
        console.log("Found", completedProjectsDebug.length, "completed projects (showing first 10):")
        completedProjectsDebug.forEach(p => {
            console.log(`  - File: ${p.fileNumber || p._id}, Title: "${p.title || 'N/A'}", validationStatus="${p.validationStatus}", status="${p.status || 'N/A'}"`)
        })
        
        // Also check if there are any projects with status="Completed" but validationStatus not set
        const legacyCompleted = await Project.countDocuments({ 
            validationStatus: { $ne: "Completed" },
            status: "Completed"
        })
        if (legacyCompleted > 0) {
            console.log(`⚠️  WARNING: Found ${legacyCompleted} projects with status="Completed" but validationStatus is not "Completed". These need to be updated.`)
        }
        
        // Debug logging - comprehensive
        console.log("=== Funding Stats Debug ===")
        console.log("Total Projects in DB:", totalProjectsCount)
        console.log("Active/Ongoing Projects:", overallStats[0])
        console.log("Completed Projects:", overallStats[1])
        console.log("Total Funding:", overallStats[2][0]?.totalFunding || 0)
        console.log("Proposals Received programs count:", proposalsReceived.length)
        console.log("Proposals Received programs:", JSON.stringify(proposalsReceived, null, 2))
        console.log("Proposals Supported programs count:", proposalsSupported.length)
        console.log("Proposals Supported programs:", JSON.stringify(proposalsSupported, null, 2))
        
        // Verify: Sum of programs should equal total projects
        const proposalsReceivedSum = proposalsReceived.reduce((sum, p) => sum + p.count, 0)
        const proposalsSupportedSum = proposalsSupported.reduce((sum, p) => sum + p.count, 0)
        console.log("Proposals Received sum:", proposalsReceivedSum, "vs Total:", totalProjectsCount)
        console.log("Proposals Supported sum:", proposalsSupportedSum, "vs Total:", totalProjectsCount)

        // Ensure we always return data, even if arrays are empty
        const response = {
            ongoingProjects: {
                total: overallStats[0] || 0,
                programs: ongoingProjects || []
            },
            completedProjects: overallStats[1] || 0, // Add completed projects count
            activeProjects: overallStats[0] || 0, // Alias for active projects
            proposalsReceived: {
                total: totalProjectsCount || 0, // Use direct count from database
                programs: proposalsReceived && proposalsReceived.length > 0 ? proposalsReceived : []
            },
            proposalsSupported: {
                total: totalProjectsCount || 0, // Use direct count from database
                programs: proposalsSupported && proposalsSupported.length > 0 ? proposalsSupported : []
            },
            projectOutput: {
                publications: projectOutput[0] || 0, // Count from aggregation (already handled)
                equipment: projectOutput[1] || 0,
                manpower: projectOutput[2] || 0
            },
            totalFunding: overallStats[2][0]?.totalFunding || 0,
            year: currentYear
        }
        
        console.log("=== Response being sent ===")
        console.log(JSON.stringify(response, null, 2))
        
        res.json(response)
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
