import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { selectCurrentUser, selectIsAuthenticated, logout } from "../../store/slices/authSlice"
import { useLogoutMutation } from "../../store/api/authApi"
import { Button } from "../ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { User, LogOut, Settings, BarChart3, Menu, X, LogIn } from "lucide-react"

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector(selectCurrentUser)
    const isAuthenticated = useSelector(selectIsAuthenticated)
    const [logoutMutation] = useLogoutMutation()

    const handleLogout = async () => {
        try {
            await logoutMutation().unwrap()
        } catch (error) {
            console.error("Logout error:", error)
        } finally {
            dispatch(logout())
            navigate("/")
        }
    }

    return (
        <>
            {/* Top Header */}
            {/* <div className="bg-[#0d559e] text-white py-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <button className="text-sm hover:text-blue-200">A<sup>-</sup></button>
                            <button className="text-sm hover:text-blue-200">A<sup>+</sup></button>
                            <button className="text-sm hover:text-blue-200">A</button>
                        </div>
                        <div className="flex items-center space-x-4">
                            <a href="#" className="text-sm hover:text-blue-200">Facebook</a>
                            <a href="#" className="text-sm hover:text-blue-200">Twitter</a>
                        </div>
                    </div>
                </div>
            </div> */}

            {/* Main Header */}
            <header className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center space-x-3">
                                <img 
                                    src="/iHub.png" 
                                    alt="IIT Mandi iHub Logo" 
                                    className="w-24 h-24 object-contain"
                                />
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">IIT Mandi iHub & HCi Foundation</h1>
                                    <p className="text-sm text-gray-600">CFP Portal</p>
                                </div>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-8">
                            <Link to="/" className="text-gray-700 hover:text-[#0d559e] font-medium">
                                Home
                            </Link>
                            
                            <Link to="/about" className="text-gray-700 hover:text-[#0d559e] font-medium">
                                About Us
                            </Link>

                            <Link to="/research-support" className="text-gray-700 hover:text-[#0d559e] font-medium">
                                Research Support
                            </Link>
                            <Link to="/contact" className="text-gray-700 hover:text-[#0d559e] font-medium">
                                Contact Us
                            </Link>
                        </nav>

                        {/* Right Side Actions */}
                        <div className="hidden md:flex items-center space-x-4">
                            <Button variant="outline" size="sm" asChild>
                                <Link to="/projects">Online Application</Link>
                            </Button>

                            {/* Login/User Menu */}
                            {isAuthenticated ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="flex items-center">
                                            <User className="mr-2 h-4 w-4" />
                                            {user?.firstName} {user?.lastName}
                                            <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <div className="px-2 py-1.5 text-sm font-medium text-gray-900">
                                            {user?.role === "PI" ? "Principal Investigator" : user?.role}
                                        </div>
                                        <DropdownMenuSeparator />
                                        {user?.role === "PI" && (
                                            <DropdownMenuItem asChild>
                                                <Link to="/pi" className="flex items-center">
                                                    <BarChart3 className="mr-2 h-4 w-4" />
                                                    PI Dashboard
                                                </Link>
                                            </DropdownMenuItem>
                                        )}
                                        {(user?.role === "Admin" || user?.role === "Validator") && (
                                            <DropdownMenuItem asChild>
                                                <Link to="/admin/dashboard" className="flex items-center">
                                                    <Settings className="mr-2 h-4 w-4" />
                                                    Admin Dashboard
                                                </Link>
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Logout
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                /* Login Dropdown for non-authenticated users */
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="flex items-center">
                                            <LogIn className="mr-2 h-4 w-4" />
                                            Login
                                            <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuItem asChild>
                                            <Link to="/login" className="flex items-center">
                                                <User className="mr-2 h-4 w-4" />
                                                PI Login
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link to="/admin/login" className="flex items-center">
                                                <Settings className="mr-2 h-4 w-4" />
                                                Admin Login
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>

                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white border-t">
                        <div className="px-4 py-2 space-y-2">
                            <Link to="/" className="block py-2 text-gray-700 hover:text-blue-600">
                                Home
                            </Link>
                            <Link to="/about" className="block py-2 text-gray-700 hover:text-blue-600">
                                About Us
                            </Link>
                            <Link to="/research-support" className="block py-2 text-gray-700 hover:text-blue-600">
                                Research Support
                            </Link>
                            <Link to="/contact" className="block py-2 text-gray-700 hover:text-blue-600">
                                Contact Us
                            </Link>
                            
                            {/* Mobile Auth Section */}
                            <div className="pt-2 border-t">
                                {isAuthenticated ? (
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium text-gray-900">
                                            Welcome, {user?.firstName} {user?.lastName}
                                        </div>
                                        <div className="text-xs text-gray-600 mb-2">
                                            {user?.role === "PI" ? "Principal Investigator" : user?.role}
                                        </div>
                                        {user?.role === "PI" && (
                                            <Button variant="outline" size="sm" className="w-full mb-2" asChild>
                                                <Link to="/pi">PI Dashboard</Link>
                                            </Button>
                                        )}
                                        {(user?.role === "Admin" || user?.role === "Validator") && (
                                            <Button variant="outline" size="sm" className="w-full mb-2" asChild>
                                                <Link to="/admin/dashboard">Admin Dashboard</Link>
                                            </Button>
                                        )}
                                        <Button variant="ghost" size="sm" className="w-full text-red-600" onClick={handleLogout}>
                                            Logout
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Button variant="outline" size="sm" className="w-full mb-2" asChild>
                                            <Link to="/projects">Online Application</Link>
                                        </Button>
                                        <div className="text-sm font-medium text-gray-900 mb-2">Login Options</div>
                                        <Button variant="outline" size="sm" className="w-full mb-2" asChild>
                                            <Link to="/login">PI Login</Link>
                                        </Button>
                                        <Button variant="ghost" size="sm" className="w-full" asChild>
                                            <Link to="/admin/login">Admin Login</Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </header>
        </>
    )
}

export default Header