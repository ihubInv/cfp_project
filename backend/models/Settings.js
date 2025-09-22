const mongoose = require("mongoose")

const settingsSchema = new mongoose.Schema(
    {
        // General Settings
        siteName: {
            type: String,
            default: "IIT Mandi iHub & HCi Foundation"
        },
        siteDescription: {
            type: String,
            default: "A comprehensive platform for managing research projects, publications, and academic resources"
        },
        adminEmail: {
            type: String,
            default: "admin@iitmandi.ac.in"
        },
        timezone: {
            type: String,
            default: "Asia/Kolkata"
        },
        language: {
            type: String,
            default: "English"
        },
        
        // System Settings
        maintenanceMode: {
            type: Boolean,
            default: false
        },
        userRegistration: {
            type: Boolean,
            default: true
        },
        emailNotifications: {
            type: Boolean,
            default: true
        },
        activityLogging: {
            type: Boolean,
            default: true
        },
        autoBackup: {
            type: Boolean,
            default: true
        },
        backupFrequency: {
            type: String,
            enum: ["hourly", "daily", "weekly", "monthly"],
            default: "daily"
        },
        
        // Security Settings
        passwordMinLength: {
            type: Number,
            default: 8,
            min: 6,
            max: 20
        },
        sessionTimeout: {
            type: Number,
            default: 60,
            min: 15,
            max: 480
        },
        maxLoginAttempts: {
            type: Number,
            default: 5,
            min: 3,
            max: 10
        },
        twoFactorAuth: {
            type: Boolean,
            default: false
        },
        ipWhitelist: {
            type: String,
            default: ""
        },
        
        // Email Settings
        smtpHost: {
            type: String,
            default: ""
        },
        smtpPort: {
            type: Number,
            default: 587
        },
        smtpUser: {
            type: String,
            default: ""
        },
        smtpPassword: {
            type: String,
            default: ""
        },
        smtpSecure: {
            type: Boolean,
            default: true
        },
        
        // File Upload Settings
        maxFileSize: {
            type: Number,
            default: 10,
            min: 1,
            max: 100
        },
        allowedFileTypes: {
            type: String,
            default: "pdf,doc,docx,txt,jpg,jpeg,png"
        },
        uploadPath: {
            type: String,
            default: "/uploads"
        },
        
        // Project Settings
        autoValidation: {
            type: Boolean,
            default: false
        },
        validationRequired: {
            type: Boolean,
            default: true
        },
        projectApprovalWorkflow: {
            type: Boolean,
            default: true
        },
        fundingValidation: {
            type: Boolean,
            default: true
        },
        
        // Metadata
        lastUpdatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true,
    },
)

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function() {
    let settings = await this.findOne()
    if (!settings) {
        // Create default settings if none exist
        settings = new this({
            lastUpdatedBy: new mongoose.Types.ObjectId() // You might want to set this to a default admin user
        })
        await settings.save()
    }
    return settings
}

module.exports = mongoose.models.Settings || mongoose.model("Settings", settingsSchema)
