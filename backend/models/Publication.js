const mongoose = require("mongoose")

const publicationSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        authors: [
            {
                name: { type: String, required: true },
                affiliation: String,
                isCorresponding: { type: Boolean, default: false },
            },
        ],
        journal: {
            name: String,
            volume: String,
            issue: String,
            pages: String,
            impactFactor: Number,
        },
        conference: {
            name: String,
            location: String,
            date: Date,
        },
        publicationType: {
            type: String,
            enum: ["Journal Article", "Conference Paper", "Book Chapter", "Patent", "Report", "Thesis"],
            required: true,
        },
        publicationDate: Date,
        doi: String,
        url: String,
        abstract: String,
        keywords: [String],
        associatedProjects: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Project",
                required: true,
            },
        ],
        citations: {
            count: { type: Number, default: 0 },
            lastUpdated: Date,
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

module.exports = mongoose.model("Publication", publicationSchema)
