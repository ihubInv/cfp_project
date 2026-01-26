const mongoose = require("mongoose")

const projectSchema = new mongoose.Schema(
    {
        // Basic Project Fields
        title: {
            type: String,
            required: false,
            text: true,
        },
        fileNumber: {
            type: String,
            required: true,
            unique: true,
        },
        discipline: {
            type: String,
            required: false,
        },
        scheme: {
            type: String,
            required: false,
        },
        projectSummary: {
            type: String,
            required: false,
            text: true,
        },
        
        // Multiple Principal Investigators
        principalInvestigators: [{
            name: { type: String, required: false },
            designation: { type: String, required: false },
            email: { type: String, required: false },
            instituteName: { type: String, required: false },
            department: { type: String, required: false },
            instituteAddress: { type: String, required: false },
            affiliationType: { type: String, enum: ["Institute", "Industry"], default: "Institute" },
        }],
        
        // Multiple Co-Principal Investigators
        coPrincipalInvestigators: [{
            name: { type: String },
            designation: { type: String },
            email: { type: String },
            instituteName: { type: String },
            department: { type: String },
            instituteAddress: { type: String },
            affiliationType: { type: String, enum: ["Institute", "Industry"], default: "Institute" },
        }],
        
        // Legacy fields for backward compatibility
        pi: {
            name: { type: String },
            designation: { type: String },
            email: { type: String },
            instituteName: { type: String },
            department: { type: String },
            instituteAddress: { type: String },
            affiliationType: { type: String, enum: ["Institute", "Industry"], default: "Institute" },
        },
        
        coPI: {
            name: { type: String },
            designation: { type: String },
            email: { type: String },
            instituteName: { type: String },
            department: { type: String },
            instituteAddress: { type: String },
            affiliationType: { type: String, enum: ["Institute", "Industry"], default: "Institute" },
        },
        
        // Equipment Sanctioned
        equipmentSanctioned: [{
            genericName: { type: String, required: false },
            make: { type: String, required: false },
            model: { type: String, required: false },
            priceInr: { type: Number, required: false },
            invoiceUpload: { type: String }, // File path or URL
        }],
        
        // Manpower Sanctioned
        manpowerSanctioned: [{
            manpowerType: { type: String, required: false },
            number: { type: Number, required: false },
        }],
        
        // Publications
        publications: [{
            link: { type: String, required: false }, // Publication URL/link
            name: { type: String, required: false }, // Legacy field for backward compatibility
            publicationDetail: { type: String, required: false }, // Legacy field for backward compatibility
            status: { type: String, required: false }, // Legacy field for backward compatibility
        }],
        
        // Budget Information
        budget: {
            sanctionYear: { type: Number, required: false },
            date: { type: Date, required: false },
            totalAmount: { type: Number, required: false },
        },
        
        // Patent Details (legacy - kept for backward compatibility)
        patentDetail: {
            type: String,
        },
        
        // Patents - Array of patent entries, each with details and document
        patents: [{
            patentDetail: { type: String, required: false }, // Description/details for this patent
            patentDocument: { // Document for this specific patent
                filename: { type: String, required: false },
                originalName: { type: String, required: false },
                path: { type: String, required: false },
                mimetype: { type: String, required: false },
                size: { type: Number, required: false },
                uploadedAt: { type: Date, default: Date.now },
            },
        }],
        
        // Patent Documents (legacy - kept for backward compatibility)
        patentDocuments: [{
            filename: { type: String, required: true },
            originalName: { type: String, required: true },
            path: { type: String, required: true },
            mimetype: { type: String, required: true },
            size: { type: Number, required: true },
            uploadedAt: { type: Date, default: Date.now },
        }],
        
        // File Attachments
        attachments: [{
            filename: { type: String, required: true },
            originalName: { type: String, required: true },
            path: { type: String, required: true },
            mimetype: { type: String, required: true },
            size: { type: Number, required: true },
            uploadedAt: { type: Date, default: Date.now },
        }],
        
        // Project Status
        validationStatus: {
            type: String,
            enum: ["Ongoing", "Completed", "Rejected", "Pending"],
            default: "Ongoing",
        },
        status: {
            type: String,
            required: false,
        },
        
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