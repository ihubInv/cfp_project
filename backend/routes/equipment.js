const express = require("express")
const router = express.Router()
const Equipment = require("../models/Equipment")
const { authenticateToken, authorizeRoles } = require("../middleware/auth")

// Get all equipment
router.get("/", async (req, res) => {
    try {
        const { page = 1, limit = 10, search, category, institution, state, year } = req.query
        const query = {}

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { "specifications.manufacturer": { $regex: search, $options: "i" } },
                { "specifications.model": { $regex: search, $options: "i" } }
            ]
        }

        if (category && category !== "all") {
            query.category = category
        }

        if (institution) {
            query["location.institution"] = { $regex: institution, $options: "i" }
        }

        if (state) {
            query["location.state"] = { $regex: state, $options: "i" }
        }

        if (year) {
            query["specifications.yearOfPurchase"] = { $regex: year, $options: "i" }
        }

        const equipment = await Equipment.find(query)
            .populate("associatedProjects", "title fileNumber")
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 })

        const total = await Equipment.countDocuments(query)

        res.json({
            equipment,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        })
    } catch (error) {
        console.error("Error fetching equipment:", error)
        res.status(500).json({ message: "Server error", error: error.message })
    }
})

// Get equipment by ID
router.get("/:id", async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.id)
            .populate("institution", "name")
            .populate("addedBy", "name email")

        if (!equipment) {
            return res.status(404).json({ message: "Equipment not found" })
        }

        res.json(equipment)
    } catch (error) {
        console.error("Error fetching equipment:", error)
        res.status(500).json({ message: "Server error" })
    }
})

// Create new equipment (Admin only)
router.post("/", authenticateToken, authorizeRoles("Admin"), async (req, res) => {
    try {
        const equipment = new Equipment({
            ...req.body,
            createdBy: req.user._id
        })

        await equipment.save()
        res.status(201).json(equipment)
    } catch (error) {
        console.error("Error creating equipment:", error)
        res.status(500).json({ message: "Server error", error: error.message })
    }
})

// Update equipment (Admin only)
router.put("/:id", authenticateToken, authorizeRoles("Admin"), async (req, res) => {
    try {
        const equipment = await Equipment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )

        if (!equipment) {
            return res.status(404).json({ message: "Equipment not found" })
        }

        res.json(equipment)
    } catch (error) {
        console.error("Error updating equipment:", error)
        res.status(500).json({ message: "Server error", error: error.message })
    }
})

// Delete equipment (Admin only)
router.delete("/:id", authenticateToken, authorizeRoles("Admin"), async (req, res) => {
    try {
        const equipment = await Equipment.findByIdAndDelete(req.params.id)

        if (!equipment) {
            return res.status(404).json({ message: "Equipment not found" })
        }

        res.json({ message: "Equipment deleted successfully" })
    } catch (error) {
        console.error("Error deleting equipment:", error)
        res.status(500).json({ message: "Server error", error: error.message })
    }
})

module.exports = router
