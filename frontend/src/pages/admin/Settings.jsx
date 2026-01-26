"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Switch } from "../../components/ui/switch"
import { Separator } from "../../components/ui/separator"
import { 
  Settings as SettingsIcon, 
  Save, 
  Database, 
  Mail, 
  Shield, 
  Bell,
  Globe,
  Key,
  Users,
  FileText,
  Loader2,
  Download,
  RotateCcw,
  TestTube
} from "lucide-react"
import { 
  useGetSettingsQuery, 
  useUpdateSettingsMutation, 
  useTestEmailConfigMutation,
  useResetSettingsMutation,
  useExportSettingsQuery 
} from "../../store/api/settingsApi"

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general")
  const [settings, setSettings] = useState({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [isTestingEmail, setIsTestingEmail] = useState(false)

  // API hooks
  const { data: settingsData, isLoading, error, refetch } = useGetSettingsQuery()
  const [updateSettings] = useUpdateSettingsMutation()
  const [testEmailConfig] = useTestEmailConfigMutation()
  const [resetSettings] = useResetSettingsMutation()

  // Update local settings when API data changes
  useEffect(() => {
    if (settingsData) {
      setSettings(settingsData)
    }
  }, [settingsData])

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage("")
    
    try {
      await updateSettings(settings).unwrap()
      setSaveMessage("Settings saved successfully!")
      setTimeout(() => setSaveMessage(""), 3000)
    } catch (error) {
      setSaveMessage(error.data?.message || "Failed to save settings. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleTestEmail = async () => {
    setIsTestingEmail(true)
    setSaveMessage("")
    
    try {
      const emailConfig = {
        smtpHost: settings.smtpHost,
        smtpPort: settings.smtpPort,
        smtpUser: settings.smtpUser,
        smtpPassword: settings.smtpPassword,
        smtpSecure: settings.smtpSecure
      }
      
      await testEmailConfig(emailConfig).unwrap()
      setSaveMessage("Email configuration test successful!")
      setTimeout(() => setSaveMessage(""), 3000)
    } catch (error) {
      setSaveMessage(error.data?.message || "Email test failed. Please check your configuration.")
    } finally {
      setIsTestingEmail(false)
    }
  }

  const handleResetSettings = async () => {
    if (window.confirm("Are you sure you want to reset all settings to default values? This action cannot be undone.")) {
      setIsSaving(true)
      setSaveMessage("")
      
      try {
        await resetSettings().unwrap()
        setSaveMessage("Settings reset to defaults successfully!")
        setTimeout(() => setSaveMessage(""), 3000)
        refetch() // Refresh the settings data
      } catch (error) {
        setSaveMessage(error.data?.message || "Failed to reset settings. Please try again.")
      } finally {
        setIsSaving(false)
      }
    }
  }

  const handleExportSettings = async () => {
    try {
      const response = await fetch('/api/settings/export', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `settings_backup_${new Date().toISOString().split('T')[0]}.json`
        a.click()
        window.URL.revokeObjectURL(url)
        setSaveMessage("Settings exported successfully!")
        setTimeout(() => setSaveMessage(""), 3000)
      }
    } catch (error) {
      setSaveMessage("Failed to export settings. Please try again.")
    }
  }

  const tabs = [
    { id: "general", label: "General", icon: SettingsIcon },
    { id: "system", label: "System", icon: Database },
    { id: "security", label: "Security", icon: Shield },
    { id: "email", label: "Email", icon: Mail },
    { id: "files", label: "File Upload", icon: FileText },
    { id: "projects", label: "Projects", icon: Users },
  ]

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="siteName">Site Name</Label>
        <Input
          id="siteName"
          value={settings.siteName}
          onChange={(e) => handleInputChange("siteName", e.target.value)}
          placeholder="Enter site name"
        />
      </div>
      
      <div>
        <Label htmlFor="siteDescription">Site Description</Label>
        <Textarea
          id="siteDescription"
          value={settings.siteDescription}
          onChange={(e) => handleInputChange("siteDescription", e.target.value)}
          placeholder="Enter site description"
          rows={3}
        />
      </div>
      
      <div>
        <Label htmlFor="adminEmail">Admin Email</Label>
        <Input
          id="adminEmail"
          type="email"
          value={settings.adminEmail}
          onChange={(e) => handleInputChange("adminEmail", e.target.value)}
          placeholder="admin@example.com"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="timezone">Timezone</Label>
          <Select value={settings.timezone} onValueChange={(value) => handleInputChange("timezone", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UTC">UTC</SelectItem>
              <SelectItem value="America/New_York">Eastern Time</SelectItem>
              <SelectItem value="America/Chicago">Central Time</SelectItem>
              <SelectItem value="America/Denver">Mountain Time</SelectItem>
              <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
              <SelectItem value="Europe/London">London</SelectItem>
              <SelectItem value="Europe/Paris">Paris</SelectItem>
              <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
              <SelectItem value="Asia/Kolkata">India</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="language">Language</Label>
          <Select value={settings.language} onValueChange={(value) => handleInputChange("language", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Spanish">Spanish</SelectItem>
              <SelectItem value="French">French</SelectItem>
              <SelectItem value="German">German</SelectItem>
              <SelectItem value="Chinese">Chinese</SelectItem>
              <SelectItem value="Japanese">Japanese</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
          <p className="text-sm text-gray-500">Enable maintenance mode to temporarily disable the system</p>
        </div>
        <Switch
          id="maintenanceMode"
          checked={settings.maintenanceMode}
          onCheckedChange={(checked) => handleInputChange("maintenanceMode", checked)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="userRegistration">User Registration</Label>
          <p className="text-sm text-gray-500">Allow new users to register accounts</p>
        </div>
        <Switch
          id="userRegistration"
          checked={settings.userRegistration}
          onCheckedChange={(checked) => handleInputChange("userRegistration", checked)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="emailNotifications">Email Notifications</Label>
          <p className="text-sm text-gray-500">Send email notifications for system events</p>
        </div>
        <Switch
          id="emailNotifications"
          checked={settings.emailNotifications}
          onCheckedChange={(checked) => handleInputChange("emailNotifications", checked)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="activityLogging">Activity Logging</Label>
          <p className="text-sm text-gray-500">Log all user activities for audit purposes</p>
        </div>
        <Switch
          id="activityLogging"
          checked={settings.activityLogging}
          onCheckedChange={(checked) => handleInputChange("activityLogging", checked)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="autoBackup">Automatic Backup</Label>
          <p className="text-sm text-gray-500">Automatically backup system data</p>
        </div>
        <Switch
          id="autoBackup"
          checked={settings.autoBackup}
          onCheckedChange={(checked) => handleInputChange("autoBackup", checked)}
        />
      </div>
      
      {settings.autoBackup && (
        <div>
          <Label htmlFor="backupFrequency">Backup Frequency</Label>
          <Select value={settings.backupFrequency} onValueChange={(value) => handleInputChange("backupFrequency", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hourly">Hourly</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
        <Input
          id="passwordMinLength"
          type="number"
          value={settings.passwordMinLength}
          onChange={(e) => handleInputChange("passwordMinLength", parseInt(e.target.value))}
          min="6"
          max="20"
        />
      </div>
      
      <div>
        <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
        <Input
          id="sessionTimeout"
          type="number"
          value={settings.sessionTimeout}
          onChange={(e) => handleInputChange("sessionTimeout", parseInt(e.target.value))}
          min="15"
          max="480"
        />
      </div>
      
      <div>
        <Label htmlFor="maxLoginAttempts">Maximum Login Attempts</Label>
        <Input
          id="maxLoginAttempts"
          type="number"
          value={settings.maxLoginAttempts}
          onChange={(e) => handleInputChange("maxLoginAttempts", parseInt(e.target.value))}
          min="3"
          max="10"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
          <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
        </div>
        <Switch
          id="twoFactorAuth"
          checked={settings.twoFactorAuth}
          onCheckedChange={(checked) => handleInputChange("twoFactorAuth", checked)}
        />
      </div>
      
      <div>
        <Label htmlFor="ipWhitelist">IP Whitelist</Label>
        <Textarea
          id="ipWhitelist"
          value={settings.ipWhitelist}
          onChange={(e) => handleInputChange("ipWhitelist", e.target.value)}
          placeholder="Enter IP addresses separated by commas (leave empty to allow all)"
          rows={3}
        />
      </div>
    </div>
  )

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="smtpHost">SMTP Host</Label>
          <Input
            id="smtpHost"
            value={settings.smtpHost}
            onChange={(e) => handleInputChange("smtpHost", e.target.value)}
            placeholder="smtp.gmail.com"
          />
        </div>
        
        <div>
          <Label htmlFor="smtpPort">SMTP Port</Label>
          <Input
            id="smtpPort"
            type="number"
            value={settings.smtpPort}
            onChange={(e) => handleInputChange("smtpPort", parseInt(e.target.value))}
            placeholder="587"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="smtpUser">SMTP Username</Label>
        <Input
          id="smtpUser"
          value={settings.smtpUser}
          onChange={(e) => handleInputChange("smtpUser", e.target.value)}
          placeholder="your-email@gmail.com"
        />
      </div>
      
      <div>
        <Label htmlFor="smtpPassword">SMTP Password</Label>
        <Input
          id="smtpPassword"
          type="password"
          value={settings.smtpPassword}
          onChange={(e) => handleInputChange("smtpPassword", e.target.value)}
          placeholder="App password or account password"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="smtpSecure">Use Secure Connection</Label>
          <p className="text-sm text-gray-500">Use TLS/SSL for SMTP connection</p>
        </div>
        <Switch
          id="smtpSecure"
          checked={settings.smtpSecure}
          onCheckedChange={(checked) => handleInputChange("smtpSecure", checked)}
        />
      </div>
    </div>
  )

  const renderFileUploadSettings = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="maxFileSize">Maximum File Size (MB)</Label>
        <Input
          id="maxFileSize"
          type="number"
          value={settings.maxFileSize}
          onChange={(e) => handleInputChange("maxFileSize", parseInt(e.target.value))}
          min="1"
          max="100"
        />
      </div>
      
      <div>
        <Label htmlFor="allowedFileTypes">Allowed File Types</Label>
        <Input
          id="allowedFileTypes"
          value={settings.allowedFileTypes}
          onChange={(e) => handleInputChange("allowedFileTypes", e.target.value)}
          placeholder="pdf,doc,docx,txt,jpg,jpeg,png"
        />
        <p className="text-sm text-gray-500 mt-1">Separate file extensions with commas</p>
      </div>
      
      <div>
        <Label htmlFor="uploadPath">Upload Path</Label>
        <Input
          id="uploadPath"
          value={settings.uploadPath}
          onChange={(e) => handleInputChange("uploadPath", e.target.value)}
          placeholder="/uploads"
        />
      </div>
    </div>
  )

  const renderProjectSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="autoValidation">Auto-Validation</Label>
          <p className="text-sm text-gray-500">Automatically validate projects without manual review</p>
        </div>
        <Switch
          id="autoValidation"
          checked={settings.autoValidation}
          onCheckedChange={(checked) => handleInputChange("autoValidation", checked)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="validationRequired">Validation Required</Label>
          <p className="text-sm text-gray-500">Require admin validation for all projects</p>
        </div>
        <Switch
          id="validationRequired"
          checked={settings.validationRequired}
          onCheckedChange={(checked) => handleInputChange("validationRequired", checked)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="projectApprovalWorkflow">Approval Workflow</Label>
          <p className="text-sm text-gray-500">Enable multi-step approval process for projects</p>
        </div>
        <Switch
          id="projectApprovalWorkflow"
          checked={settings.projectApprovalWorkflow}
          onCheckedChange={(checked) => handleInputChange("projectApprovalWorkflow", checked)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="fundingValidation">Funding Validation</Label>
          <p className="text-sm text-gray-500">Validate funding information for projects</p>
        </div>
        <Switch
          id="fundingValidation"
          checked={settings.fundingValidation}
          onCheckedChange={(checked) => handleInputChange("fundingValidation", checked)}
        />
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return renderGeneralSettings()
      case "system":
        return renderSystemSettings()
      case "security":
        return renderSecuritySettings()
      case "email":
        return renderEmailSettings()
      case "files":
        return renderFileUploadSettings()
      case "projects":
        return renderProjectSettings()
      default:
        return renderGeneralSettings()
    }
  }

  return (
    <div className="space-y-6 bg-gradient-to-br from-gray-50 to-white min-h-screen p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          System Settings
        </h1>
        <p className="text-gray-600 text-lg">Configure system-wide settings and preferences</p>
      </div>

      {saveMessage && (
        <Alert className={saveMessage.includes("successfully") ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          <AlertDescription className={saveMessage.includes("successfully") ? "text-green-800" : "text-red-800"}>
            {saveMessage}
          </AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#0d559e]" />
          <p className="mt-2 text-gray-600">Loading settings...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-600">Error loading settings. Please try again.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <Card className="lg:col-span-1 group hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-200 overflow-hidden relative bg-gradient-to-br from-white to-blue-50/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-blue-700 transition-colors">Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-0 relative z-10">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left text-sm font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                        : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                  >
                    <tab.icon className="h-4 w-4 mr-3" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>

          {/* Settings Content */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center">
                {(() => {
                  const currentTab = tabs.find(tab => tab.id === activeTab)
                  const IconComponent = currentTab?.icon
                  return IconComponent ? <IconComponent className="h-5 w-5 mr-2" /> : null
                })()}
                {tabs.find(tab => tab.id === activeTab)?.label} Settings
              </CardTitle>
              <CardDescription>
                Configure {tabs.find(tab => tab.id === activeTab)?.label.toLowerCase()} settings for your system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderTabContent()}
              
              <Separator className="my-6" />
              
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleResetSettings} 
                    disabled={isSaving}
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset to Defaults
                  </Button>
                  <Button 
                    onClick={handleExportSettings} 
                    disabled={isSaving}
                    variant="outline"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Settings
                  </Button>
                </div>
                
                <div className="flex space-x-2">
                  {activeTab === "email" && (
                    <Button 
                      onClick={handleTestEmail} 
                      disabled={isTestingEmail}
                      variant="outline"
                    >
                      <TestTube className="h-4 w-4 mr-2" />
                      {isTestingEmail ? "Testing..." : "Test Email"}
                    </Button>
                  )}
                  <Button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className="bg-[#0d559e] hover:bg-[#0d559e]/90"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Settings"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default Settings
