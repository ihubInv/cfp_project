const express = require("express")
const router = express.Router()
const Publication = require("../models/Publication")
const { authenticateToken } = require("../middleware/auth")

// Get all publications
router.get("/", async (req, res) => {
    try {
        const { page = 1, limit = 10, search, type, year } = req.query
        const query = {}

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { authors: { $regex: search, $options: "i" } },
                { journal: { $regex: search, $options: "i" } },
                { keywords: { $regex: search, $options: "i" } }
            ]
        }

        if (type) {
            query.type = type
        }

        if (year) {
            query.year = parseInt(year)
        }

        const publications = await Publication.find(query)
            .populate("project", "title")
            .populate("addedBy", "name")
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ year: -1 })

        const total = await Publication.countDocuments(query)

        res.json({
            publications,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        })
    } catch (error) {
        console.error("Error fetching publications:", error)
        res.status(500).json({ message: "Server error" })
    }
})

// Get publication by ID
router.get("/:id", async (req, res) => {
    try {
        const publication = await Publication.findById(req.params.id)
            .populate("project", "title")
            .populate("addedBy", "name email")

        if (!publication) {
            return res.status(404).json({ message: "Publication not found" })
        }

        res.json(publication)
    } catch (error) {
        console.error("Error fetching publication:", error)
        res.status(500).json({ message: "Server error" })
    }
})

// Create new publication
router.post("/", authenticateToken, async (req, res) => {
    try {
        const publication = new Publication({
            ...req.body,
            addedBy: req.user.id
        })

        await publication.save()
        res.status(201).json(publication)
    } catch (error) {
        console.error("Error creating publication:", error)
        res.status(500).json({ message: "Server error" })
    }
})

// Update publication
router.put("/:id", authenticateToken, async (req, res) => {
    try {
        const publication = await Publication.findById(req.params.id)

        if (!publication) {
            return res.status(404).json({ message: "Publication not found" })
        }

        // Check if user owns the publication or is admin
        if (publication.addedBy.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" })
        }

        const updatedPublication = await Publication.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )

        res.json(updatedPublication)
    } catch (error) {
        console.error("Error updating publication:", error)
        res.status(500).json({ message: "Server error" })
    }
})

// Delete publication
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const publication = await Publication.findById(req.params.id)

        if (!publication) {
            return res.status(404).json({ message: "Publication not found" })
        }

        // Check if user owns the publication or is admin
        if (publication.addedBy.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" })
        }

        await Publication.findByIdAndDelete(req.params.id)
        res.json({ message: "Publication deleted successfully" })
    } catch (error) {
        console.error("Error deleting publication:", error)
        res.status(500).json({ message: "Server error" })
    }
})

module.exports = router
