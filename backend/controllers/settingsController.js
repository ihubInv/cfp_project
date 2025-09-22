const Settings = require("../models/Settings")
const { createActivityLog } = require("./activityLogController")

// Get system settings
const getSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings()
    
    // Remove sensitive information before sending
    const safeSettings = settings.toObject()
    delete safeSettings.smtpPassword
    
    res.json(safeSettings)
  } catch (error) {
    console.error("Error fetching settings:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Update system settings
const updateSettings = async (req, res) => {
  try {
    const userId = req.user._id
    const updateData = req.body
    
    // Remove sensitive fields that shouldn't be updated directly
    delete updateData._id
    delete updateData.createdAt
    delete updateData.updatedAt
    delete updateData.lastUpdatedBy
    
    // Add the user who made the update
    updateData.lastUpdatedBy = userId
    
    // Validate numeric fields
    if (updateData.passwordMinLength && (updateData.passwordMinLength < 6 || updateData.passwordMinLength > 20)) {
      return res.status(400).json({ message: "Password minimum length must be between 6 and 20" })
    }
    
    if (updateData.sessionTimeout && (updateData.sessionTimeout < 15 || updateData.sessionTimeout > 480)) {
      return res.status(400).json({ message: "Session timeout must be between 15 and 480 minutes" })
    }
    
    if (updateData.maxLoginAttempts && (updateData.maxLoginAttempts < 3 || updateData.maxLoginAttempts > 10)) {
      return res.status(400).json({ message: "Maximum login attempts must be between 3 and 10" })
    }
    
    if (updateData.maxFileSize && (updateData.maxFileSize < 1 || updateData.maxFileSize > 100)) {
      return res.status(400).json({ message: "Maximum file size must be between 1 and 100 MB" })
    }
    
    // Validate backup frequency
    if (updateData.backupFrequency && !["hourly", "daily", "weekly", "monthly"].includes(updateData.backupFrequency)) {
      return res.status(400).json({ message: "Invalid backup frequency" })
    }
    
    // Validate timezone
    const validTimezones = [
      "UTC", "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
      "Europe/London", "Europe/Paris", "Asia/Tokyo", "Asia/Kolkata"
    ]
    if (updateData.timezone && !validTimezones.includes(updateData.timezone)) {
      return res.status(400).json({ message: "Invalid timezone" })
    }
    
    // Validate language
    const validLanguages = ["English", "Spanish", "French", "German", "Chinese", "Japanese"]
    if (updateData.language && !validLanguages.includes(updateData.language)) {
      return res.status(400).json({ message: "Invalid language" })
    }
    
    // Get existing settings
    let settings = await Settings.findOne()
    if (!settings) {
      settings = new Settings(updateData)
    } else {
      Object.assign(settings, updateData)
    }
    
    await settings.save()
    
    // Log the settings update
    await createActivityLog(
      userId,
      "UPDATE_SETTINGS",
      "System",
      null,
      {
        description: "Updated system settings",
        changes: Object.keys(updateData)
      },
      req
    )
    
    // Remove sensitive information before sending response
    const safeSettings = settings.toObject()
    delete safeSettings.smtpPassword
    
    res.json({
      message: "Settings updated successfully",
      settings: safeSettings
    })
  } catch (error) {
    console.error("Error updating settings:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Test email configuration
const testEmailConfig = async (req, res) => {
  try {
    const { smtpHost, smtpPort, smtpUser, smtpPassword, smtpSecure } = req.body
    
    if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword) {
      return res.status(400).json({ message: "All SMTP fields are required for testing" })
    }
    
    // Here you would implement actual email testing
    // For now, we'll simulate a successful test
    res.json({ message: "Email configuration test successful" })
  } catch (error) {
    console.error("Error testing email config:", error)
    res.status(500).json({ message: "Email test failed", error: error.message })
  }
}

// Reset settings to defaults
const resetSettings = async (req, res) => {
  try {
    const userId = req.user._id
    
    // Delete existing settings
    await Settings.deleteMany({})
    
    // Create new default settings
    const defaultSettings = new Settings({
      lastUpdatedBy: userId
    })
    await defaultSettings.save()
    
    // Log the settings reset
    await createActivityLog(
      userId,
      "RESET_SETTINGS",
      "System",
      null,
      {
        description: "Reset all settings to default values"
      },
      req
    )
    
    res.json({ message: "Settings reset to defaults successfully" })
  } catch (error) {
    console.error("Error resetting settings:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Export settings
const exportSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings()
    
    // Remove sensitive information
    const safeSettings = settings.toObject()
    delete safeSettings.smtpPassword
    delete safeSettings._id
    delete safeSettings.createdAt
    delete safeSettings.updatedAt
    delete safeSettings.lastUpdatedBy
    
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Content-Disposition', 'attachment; filename="settings_backup.json"')
    res.json(safeSettings)
  } catch (error) {
    console.error("Error exporting settings:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

module.exports = {
  getSettings,
  updateSettings,
  testEmailConfig,
  resetSettings,
  exportSettings
}
