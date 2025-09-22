const mongoose = require("mongoose")

const projectSchema = new mongoose.Schema(
    {
        // Basic Project Fields
        title: {
            type: String,
            required: true,
            text: true,
        },
        fileNumber: {
            type: String,
            required: true,
            unique: true,
        },
        discipline: {
            type: String,
            required: true,
        },
        scheme: {
            type: String,
            required: true,
        },
        projectSummary: {
            type: String,
            required: true,
            text: true,
        },
        
        // Multiple Principal Investigators
        principalInvestigators: [{
            name: { type: String, required: true },
            designation: { type: String, required: true },
            email: { type: String, required: true },
            instituteName: { type: String, required: true },
            department: { type: String, required: true },
            instituteAddress: { type: String, required: true },
        }],
        
        // Multiple Co-Principal Investigators
        coPrincipalInvestigators: [{
            name: { type: String },
            designation: { type: String },
            email: { type: String },
            instituteName: { type: String },
            department: { type: String },
            instituteAddress: { type: String },
        }],
        
        // Legacy fields for backward compatibility
        pi: {
            name: { type: String },
            designation: { type: String },
            email: { type: String },
            instituteName: { type: String },
            department: { type: String },
            instituteAddress: { type: String },
        },
        
        coPI: {
            name: { type: String },
            designation: { type: String },
            email: { type: String },
            instituteName: { type: String },
            department: { type: String },
            instituteAddress: { type: String },
        },
        
        // Equipment Sanctioned
        equipmentSanctioned: [{
            genericName: { type: String, required: true },
            make: { type: String, required: true },
            model: { type: String, required: true },
            priceInr: { type: Number, required: true },
            invoiceUpload: { type: String }, // File path or URL
        }],
        
        // Manpower Sanctioned
        manpowerSanctioned: [{
            manpowerType: { type: String, required: true },
            number: { type: Number, required: true },
        }],
        
        // Publications
        publications: [{
            name: { type: String, required: true },
            publicationDetail: { type: String, required: true },
            status: { type: String, required: true },
        }],
        
        // Budget Information
        budget: {
            sanctionYear: { type: Number, required: true },
            date: { type: Date, required: true },
            totalAmount: { type: Number, required: true },
        },
        
        // Patent Details
        patentDetail: {
            type: String,
        },
        
        // File Attachments
        attachments: [{
            filename: { type: String, required: true },
            originalName: { type: String, required: true },
            path: { type: String, required: true },
            mimetype: { type: String, required: true },
            size: { type: Number, required: true },
            uploadedAt: { type: Date, default: Date.now },
        }],
        
        // System Fields
        role: {
            type: String,
            enum: ["Admin", "Public", "PI"],
            default: "Public",
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        lastUpdatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    },
)

// Create text index for search
projectSchema.index({
    title: "text",
    projectSummary: "text",
    "pi.name": "text",
    "pi.email": "text",
    "coPI.name": "text",
    discipline: "text",
})

module.exports = mongoose.model("Project", projectSchema)