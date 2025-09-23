"use client"

import { useState } from "react"
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { selectCurrentUser, logout } from "../../store/slices/authSlice"
import { Button } from "../ui/button"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import {
    BarChart3,
    Users,
    FolderOpen,
    Settings,
    Database,
    FileText,
    Activity,
    Menu,
    Home,
    CheckCircle,
    TrendingUp,
    Tag,
    Award,
    LogOut,
    UserPlus,
    ClipboardList,
    Send,
} from "lucide-react"

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector(selectCurrentUser)

    const handleLogout = () => {
        dispatch(logout())
        navigate("/admin/login")
    }

    const navigation = [
        { name: "Dashboard", href: "/admin/dashboard", icon: BarChart3 },
        { name: "Analytics", href: "/admin/analytics", icon: TrendingUp },
        { name: "User Management", href: "/admin/users", icon: Users },
        { name: "PI Management", href: "/admin/pi-management", icon: UserPlus },
        { name: "PI Tracking", href: "/admin/pi-tracking", icon: ClipboardList },
        { name: "Project Management", href: "/admin/projects", icon: FolderOpen },
        { name: "Online Applications", href: "/admin/online-applications", icon: Send },
        { name: "Discipline Management", href: "/admin/categories", icon: Tag },
        { name: "Scheme Management", href: "/admin/schemes", icon: Award },
        { name: "Equipment", href: "/admin/equipment", icon: Database },
        { name: "Manpower Types", href: "/admin/manpower-types", icon: Users },
        { name: "Publications", href: "/admin/publications", icon: FileText },
        { name: "Activity Logs", href: "/admin/logs", icon: Activity },
        { name: "Settings", href: "/admin/settings", icon: Settings },
    ]

    const isActive = (href) => location.pathname === href

    const SidebarContent = () => (
        <div className="flex flex-col h-full max-h-screen">
            <div className="flex items-center space-x-2 p-6 border-b">
                <img 
                    src="/iHub.png" 
                    alt="IIT Mandi iHub Logo" 
                    className="h-8 w-8 object-contain"
                />
                <div>
                    <h1 className="text-xl font-bold">iHub & HCi Founndation</h1>
                    <p className="text-sm text-gray-600">{user?.role}</p>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <Button variant="ghost" asChild className="w-full justify-start mb-4">
                    <Link to="/">
                        <Home className="mr-2 h-4 w-4" />
                        Back to Public Site
                    </Link>
                </Button>

                {navigation.map((item) => (
                    <Button
                        key={item.name}
                        variant={isActive(item.href) ? "default" : "ghost"}
                        asChild
                        className="w-full justify-start"
                    >
                        <Link to={item.href}>
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.name}
                        </Link>
                    </Button>
                ))}
            </nav>

            <div className="p-4 border-t space-y-4">
                <div className="text-sm text-gray-600">
                    <p>Logged in as:</p>
                    <p className="font-medium">
                        {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs">{user?.email}</p>
                </div>
                <Button 
                    variant="outline" 
                    onClick={handleLogout}
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-50">
                        <Menu className="h-6 w-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-80">
                    <SidebarContent />
                </SheetContent>
            </Sheet>

            {/* Desktop sidebar */}
            <div className="hidden md:flex md:w-80 md:flex-col md:fixed md:inset-y-0 md:h-screen">
                <div className="bg-white shadow-sm border-r h-full">
                    <SidebarContent />
                </div>
            </div>

            {/* Main content */}
            <div className="md:pl-80">
                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AdminLayout
