import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'
import './styles/globals.css'

// Pages
import HomePage from './pages/HomePage'
import ProjectsPage from './pages/ProjectsPage'
import ProjectListingPage from './pages/ProjectListingPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import EquipmentPage from './pages/EquipmentPage'
import PublicationsPage from './pages/PublicationsPage'
import FundingDashboard from './pages/FundingDashboard'
import AboutPage from './pages/AboutPage'
import VisionMissionPage from './pages/VisionMissionPage'
import MandatePage from './pages/MandatePage'
import BoardPage from './pages/BoardPage'
import OversightPage from './pages/OversightPage'
import ResearchSupportPage from './pages/ResearchSupportPage'
import ContactPage from './pages/ContactPage'
import UnauthorizedPage from './pages/UnauthorizedPage'
import OnlineApplicationPage from './pages/OnlineApplicationPage'

// Auth Pages
import LoginForm from './components/auth/LoginForm'
import RegisterForm from './components/auth/RegisterForm'

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin'
import AdminRegister from './pages/admin/AdminRegister'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard'
import ProjectManagement from './pages/admin/ProjectManagement'
import UserManagement from './pages/admin/UserManagement'
import EquipmentManagement from './pages/admin/EquipmentManagement'
import ManpowerTypeManagement from './pages/admin/ManpowerTypeManagement'
import PublicationsManagement from './pages/admin/PublicationsManagement'
import ActivityLogs from './pages/admin/ActivityLogs'
import Settings from './pages/admin/Settings'
import CategoryManagement from './pages/admin/CategoryManagement'
import SchemeManagement from './pages/admin/SchemeManagement'
import PIManagement from './pages/admin/PIManagement'
import AdminPITracking from './pages/admin/AdminPITracking'
import OnlineApplicationsAdmin from './pages/admin/OnlineApplicationsAdmin'

// PI Pages
import PIDashboard from './pages/PIDashboard'

// Protected Route
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminProtectedRoute from './components/auth/AdminProtectedRoute'

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/project-listing" element={<ProjectListingPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/equipment" element={<EquipmentPage />} />
            <Route path="/publications" element={<PublicationsPage />} />
            <Route path="/funding" element={<FundingDashboard />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/vision-mission" element={<VisionMissionPage />} />
            <Route path="/mandate" element={<MandatePage />} />
            <Route path="/board" element={<BoardPage />} />
            <Route path="/oversight" element={<OversightPage />} />
            <Route path="/research-support" element={<ResearchSupportPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/online-application" element={<OnlineApplicationPage />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            
            {/* Admin Auth Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/register" element={<AdminRegister />} />
            
            {/* Admin Protected Routes */}
            <Route path="/admin" element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="analytics" element={<AnalyticsDashboard />} />
              <Route path="projects" element={<ProjectManagement />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="equipment" element={<EquipmentManagement />} />
              <Route path="manpower-types" element={<ManpowerTypeManagement />} />
              <Route path="publications" element={<PublicationsManagement />} />
              <Route path="categories" element={<CategoryManagement />} />
              <Route path="schemes" element={<SchemeManagement />} />
              <Route path="logs" element={<ActivityLogs />} />
              <Route path="settings" element={<Settings />} />
              <Route path="pi-management" element={<PIManagement />} />
              <Route path="pi-tracking" element={<AdminPITracking />} />
              <Route path="online-applications" element={<OnlineApplicationsAdmin />} />
            </Route>
            
            {/* PI Protected Routes */}
            <Route path="/pi" element={
              <ProtectedRoute allowedRoles={["PI"]}>
                <PIDashboard />
              </ProtectedRoute>
            } />
            
            {/* Catch all route */}
            <Route path="*" element={<div>404 - Page Not Found</div>} />
          </Routes>
        </div>
      </Router>
    </Provider>
  )
}

export default App
