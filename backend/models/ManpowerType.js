const mongoose = require("mongoose")

const manpowerTypeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        category: {
            type: String,
            enum: ["Research", "Technical", "Administrative", "Support", "Other"],
            default: "Research",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

// Create index for better search performance
manpowerTypeSchema.index({ name: 1, isActive: 1 })

module.exports = mongoose.model("ManpowerType", manpowerTypeSchema)
