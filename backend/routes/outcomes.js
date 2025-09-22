const express = require("express")
const router = express.Router()
const Outcome = require("../models/Outcome")
const { authenticateToken } = require("../middleware/auth")

// Get all outcomes
router.get("/", async (req, res) => {
    try {
        const { page = 1, limit = 10, search, type, year } = req.query
        const query = {}

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { impact: { $regex: search, $options: "i" } }
            ]
        }

        if (type) {
            query.type = type
        }

        if (year) {
            query.year = parseInt(year)
        }

        const outcomes = await Outcome.find(query)
            .populate("project", "title")
            .populate("addedBy", "name")
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ year: -1 })

        const total = await Outcome.countDocuments(query)

        res.json({
            outcomes,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        })
    } catch (error) {
        console.error("Error fetching outcomes:", error)
        res.status(500).json({ message: "Server error" })
    }
})

// Get outcome by ID
router.get("/:id", async (req, res) => {
    try {
        const outcome = await Outcome.findById(req.params.id)
            .populate("project", "title")
            .populate("addedBy", "name email")

        if (!outcome) {
            return res.status(404).json({ message: "Outcome not found" })
        }

        res.json(outcome)
    } catch (error) {
        console.error("Error fetching outcome:", error)
        res.status(500).json({ message: "Server error" })
    }
})

// Create new outcome
router.post("/", authenticateToken, async (req, res) => {
    try {
        const outcome = new Outcome({
            ...req.body,
            addedBy: req.user.id
        })

        await outcome.save()
        res.status(201).json(outcome)
    } catch (error) {
        console.error("Error creating outcome:", error)
        res.status(500).json({ message: "Server error" })
    }
})

// Update outcome
router.put("/:id", authenticateToken, async (req, res) => {
    try {
        const outcome = await Outcome.findById(req.params.id)

        if (!outcome) {
            return res.status(404).json({ message: "Outcome not found" })
        }

        // Check if user owns the outcome or is admin
        if (outcome.addedBy.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" })
        }

        const updatedOutcome = await Outcome.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )

        res.json(updatedOutcome)
    } catch (error) {
        console.error("Error updating outcome:", error)
        res.status(500).json({ message: "Server error" })
    }
})

// Delete outcome
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const outcome = await Outcome.findById(req.params.id)

        if (!outcome) {
            return res.status(404).json({ message: "Outcome not found" })
        }

        // Check if user owns the outcome or is admin
        if (outcome.addedBy.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" })
        }

        await Outcome.findByIdAndDelete(req.params.id)
        res.json({ message: "Outcome deleted successfully" })
    } catch (error) {
        console.error("Error deleting outcome:", error)
        res.status(500).json({ message: "Server error" })
    }
})

module.exports = router
