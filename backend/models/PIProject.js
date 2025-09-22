const mongoose = require("mongoose")

const piProjectSchema = new mongoose.Schema(
    {
        // Basic Project Information
        projectTitle: {
            type: String,
            required: true,
            trim: true,
        },
        projectDescription: {
            type: String,
            required: true,
        },
        projectType: {
            type: String,
            enum: ["Research", "Development", "Innovation", "Collaboration", "Consultancy"],
            required: true,
        },
        projectStatus: {
            type: String,
            enum: ["Draft", "Submitted", "Under Review", "Approved", "In Progress", "Completed", "Cancelled"],
            default: "Draft",
        },
        
        // PI Information
        pi: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        piName: {
            type: String,
            required: true,
        },
        piEmail: {
            type: String,
            required: true,
        },
        piInstitution: {
            type: String,
            required: true,
        },
        piDepartment: {
            type: String,
            required: true,
        },
        
        // Project Details
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        duration: {
            type: Number, // in months
            required: true,
        },
        
        // Funding Information
        fundingAgency: {
            type: String,
            required: true,
        },
        fundingScheme: {
            type: String,
            required: true,
        },
        totalBudget: {
            type: Number,
            required: true,
        },
        approvedBudget: {
            type: Number,
            default: 0,
        },
        currency: {
            type: String,
            default: "INR",
        },
        
        // Team Information
        teamMembers: [{
            name: {
                type: String,
                required: true,
            },
            designation: {
                type: String,
                required: true,
            },
            institution: {
                type: String,
                required: true,
            },
            email: {
                type: String,
                required: true,
            },
            role: {
                type: String,
                enum: ["Co-PI", "Research Associate", "Research Scholar", "Technical Staff", "Other"],
                required: true,
            },
        }],
        
        // Objectives and Outcomes
        objectives: [{
            type: String,
            required: true,
        }],
        expectedOutcomes: [{
            type: String,
            required: true,
        }],
        deliverables: [{
            type: String,
            required: true,
        }],
        
        // Technical Details
        methodology: {
            type: String,
            required: true,
        },
        technologyStack: [{
            type: String,
        }],
        equipmentRequired: [{
            name: String,
            quantity: Number,
            estimatedCost: Number,
            justification: String,
        }],
        
        // Progress Tracking
        milestones: [{
            title: {
                type: String,
                required: true,
            },
            description: String,
            targetDate: {
                type: Date,
                required: true,
            },
            completedDate: Date,
            status: {
                type: String,
                enum: ["Pending", "In Progress", "Completed", "Delayed"],
                default: "Pending",
            },
            completionPercentage: {
                type: Number,
                default: 0,
                min: 0,
                max: 100,
            },
        }],
        
        // Financial Tracking
        budgetBreakdown: [{
            category: {
                type: String,
                required: true,
            },
            allocatedAmount: {
                type: Number,
                required: true,
            },
            spentAmount: {
                type: Number,
                default: 0,
            },
            remainingAmount: {
                type: Number,
            },
        }],
        
        // Documents and Files
        documents: [{
            filename: {
                type: String,
                required: true,
            },
            originalName: {
                type: String,
                required: true,
            },
            path: {
                type: String,
                required: true,
            },
            mimetype: {
                type: String,
                required: true,
            },
            size: {
                type: Number,
                required: true,
            },
            category: {
                type: String,
                enum: ["Proposal", "Progress Report", "Final Report", "Financial Statement", "Other"],
                required: true,
            },
            uploadedAt: {
                type: Date,
                default: Date.now,
            },
        }],
        
        // Progress Reports
        progressReports: [{
            reportNumber: {
                type: Number,
                required: true,
            },
            period: {
                startDate: Date,
                endDate: Date,
            },
            achievements: [String],
            challenges: [String],
            nextSteps: [String],
            financialStatus: {
                totalSpent: Number,
                remainingBudget: Number,
            },
            submittedAt: {
                type: Date,
                default: Date.now,
            },
            status: {
                type: String,
                enum: ["Draft", "Submitted", "Under Review", "Approved"],
                default: "Draft",
            },
        }],
        
        // Admin Review
        adminReview: {
            reviewedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            reviewDate: Date,
            comments: String,
            status: {
                type: String,
                enum: ["Pending", "Approved", "Rejected", "Needs Revision"],
                default: "Pending",
            },
            feedback: String,
        },
        
        // Metadata
        isActive: {
            type: Boolean,
            default: true,
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

// Calculate remaining budget
piProjectSchema.methods.calculateRemainingBudget = function() {
    const totalSpent = this.budgetBreakdown.reduce((sum, item) => sum + (item.spentAmount || 0), 0)
    return this.totalBudget - totalSpent
}

// Calculate project progress
piProjectSchema.methods.calculateProgress = function() {
    if (this.milestones.length === 0) return 0
    const totalProgress = this.milestones.reduce((sum, milestone) => sum + milestone.completionPercentage, 0)
    return Math.round(totalProgress / this.milestones.length)
}

module.exports = mongoose.models.PIProject || mongoose.model("PIProject", piProjectSchema)
