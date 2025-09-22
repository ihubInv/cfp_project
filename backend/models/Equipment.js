const mongoose = require("mongoose")

const equipmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        description: String,
        specifications: {
            model: String,
            manufacturer: String,
            yearOfPurchase: Number,
            cost: Number,
            technicalSpecs: mongoose.Schema.Types.Mixed,
        },
        location: {
            institution: { type: String, required: true },
            department: String,
            building: String,
            room: String,
            state: { type: String, required: true },
        },
        availability: {
            status: {
                type: String,
                enum: ["Available", "In Use", "Under Maintenance", "Decommissioned"],
                default: "Available",
            },
            accessType: {
                type: String,
                enum: ["Open Access", "Restricted", "By Appointment"],
                default: "By Appointment",
            },
        },
        associatedProjects: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Project",
            },
        ],
        contactPerson: {
            name: String,
            email: String,
            phone: String,
        },
        images: [String],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    },
)

module.exports = mongoose.model("Equipment", equipmentSchema)
