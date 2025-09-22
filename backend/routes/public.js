const express = require("express")
const router = express.Router()
const {
    getFundingStats,
    getProjectStats,
    getRecentProjects,
    getPlatformOverview,
    getPublicPublications
} = require("../controllers/publicController")

// Public routes for homepage statistics
router.get("/funding-stats", getFundingStats)
router.get("/project-stats", getProjectStats)
router.get("/recent-projects", getRecentProjects)
router.get("/platform-overview", getPlatformOverview)
router.get("/publications", getPublicPublications)

module.exports = router
