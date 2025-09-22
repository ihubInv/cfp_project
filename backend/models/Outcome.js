const mongoose = require("mongoose")

const outcomeSchema = new mongoose.Schema(
    {
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        type: {
            type: String,
            enum: ["Publication", "Patent", "Technology Transfer", "Manpower Development", "Award", "Other"],
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: String,
        details: mongoose.Schema.Types.Mixed, // Flexible structure for different outcome types
        achievementDate: Date,
        impact: {
            description: String,
            metrics: mongoose.Schema.Types.Mixed,
        },
        attachments: [
            {
                filename: String,
                originalName: String,
                path: String,
                mimetype: String,
                size: Number,
            },
        ],
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

module.exports = mongoose.model("Outcome", outcomeSchema)
