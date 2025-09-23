const mongoose = require("mongoose")

const onlineApplicationSchema = new mongoose.Schema({
    applicantName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    organization: {
        type: String,
        required: true,
        trim: true
    },
    designation: {
        type: String,
        required: true,
        trim: true
    },
    scheme: {
        type: String,
        required: true,
        trim: true
    },
    discipline: {
        type: String,
        required: true,
        trim: true
    },
    projectTitle: {
        type: String,
        required: true,
        trim: true
    },
    projectDescription: {
        type: String,
        required: true,
        trim: true
    },
    duration: {
        type: Number,
        required: true,
        min: 1
    },
    budget: {
        type: Number,
        required: true,
        min: 0
    },
    coInvestigators: {
        type: String,
        trim: true,
        default: ""
    },
    expectedOutcomes: {
        type: String,
        required: true,
        trim: true
    },
    supportingDocuments: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    comments: {
        type: String,
        trim: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

// Index for better query performance
onlineApplicationSchema.index({ status: 1 })
onlineApplicationSchema.index({ scheme: 1 })
onlineApplicationSchema.index({ discipline: 1 })
onlineApplicationSchema.index({ submittedAt: -1 })

module.exports = mongoose.model("OnlineApplication", onlineApplicationSchema)
