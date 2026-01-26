const mongoose = require("mongoose")

const activityLogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        action: {
            type: String,
            required: true,
            enum: [
                "CREATE_PROJECT",
                "UPDATE_PROJECT",
                "DELETE_PROJECT",
                "VALIDATE_PROJECT",
                "CREATE_USER",
                "UPDATE_USER",
                "DELETE_USER",
                "UPLOAD_FILE",
                "DELETE_FILE",
                "DOWNLOAD_FILE",
                "UPLOAD_PATENT_DOCUMENT",
                "DOWNLOAD_PATENT_DOCUMENT",
                "DELETE_PATENT_DOCUMENT",
                "LOGIN",
                "LOGOUT",
                "CREATE_EQUIPMENT",
                "UPDATE_EQUIPMENT",
                "DELETE_EQUIPMENT",
                "CREATE_PUBLICATION",
                "UPDATE_PUBLICATION",
                "DELETE_PUBLICATION",
                "CREATE_CATEGORY",
                "UPDATE_CATEGORY",
                "DELETE_CATEGORY",
                "INITIALIZE_CATEGORIES",
                "CREATE_SCHEME",
                "UPDATE_SCHEME",
                "DELETE_SCHEME",
                "INITIALIZE_SCHEMES",
                "BULK_IMPORT",
                "DATA_EXPORT",
            ],
        },
        targetType: {
            type: String,
            enum: ["Project", "User", "Equipment", "Publication", "File", "System", "Category", "Scheme"],
        },
        targetId: mongoose.Schema.Types.ObjectId,
        details: {
            description: String,
            changes: mongoose.Schema.Types.Mixed,
            metadata: mongoose.Schema.Types.Mixed,
        },
        ipAddress: String,
        userAgent: String,
    },
    {
        timestamps: true,
    },
)

module.exports = mongoose.models.ActivityLog || mongoose.model("ActivityLog", activityLogSchema)
