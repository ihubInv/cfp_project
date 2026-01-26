import { Link } from "react-router-dom"
import { 
    MapPin, 
    Phone, 
    Mail, 
    Globe, 
    Facebook, 
    Twitter, 
    Linkedin, 
    Instagram,
    ExternalLink
} from "lucide-react"

const Footer = () => {
    return (
        <footer className="glass-footer border-t">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* About Section */}
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <img 
                                src="/iHub.png" 
                                alt="IIT Mandi iHub Logo" 
                                className="w-24 h-24 object-contain mr-3"
                            />
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Call for Proposals (CfP)</h3>
                                <p className="text-sm text-gray-500">Portal</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Connecting researchers, institutions, and innovations through cutting-edge research 
                            in frontier areas of Science and Engineering.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-[#0d559e] transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-[#0d559e] transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-[#0d559e] transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-[#0d559e] transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-sm text-gray-600 hover:text-[#0d559e] transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/projects" className="text-sm text-gray-600 hover:text-[#0d559e] transition-colors">
                                    Projects
                                </Link>
                            </li>
                            <li>
                                <Link to="/publications" className="text-sm text-gray-600 hover:text-[#0d559e] transition-colors">
                                    Publications
                                </Link>
                            </li>
                            <li>
                                <Link to="/equipment" className="text-sm text-gray-600 hover:text-[#0d559e] transition-colors">
                                    Equipment
                                </Link>
                            </li>
                            <li>
                                <Link to="/research-support" className="text-sm text-gray-600 hover:text-[#0d559e] transition-colors">
                                    Research Support
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900">Resources</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/about" className="text-sm text-gray-600 hover:text-[#0d559e] transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-sm text-gray-600 hover:text-[#0d559e] transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900">Contact Information</h4>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                                <MapPin className="h-5 w-5 text-[#0d559e] mt-0.5 flex-shrink-0" />
                                <div className="text-sm text-gray-600">
                                    <p>North Campus, VPO Kamand, Near Mind Tree School</p>
                                    <p>Himachal Pradesh 175005, India</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="h-5 w-5 text-[#0d559e] flex-shrink-0" />
                                <span className="text-sm text-gray-600">+91-1905-237-XXX</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Mail className="h-5 w-5 text-[#0d559e] flex-shrink-0" />
                                <span className="text-sm text-gray-600">tih@ihubiitmandi.in</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Globe className="h-5 w-5 text-[#0d559e] flex-shrink-0" />
                                <a href="https://www.iitmandi.ac.in" className="text-sm text-gray-600 hover:text-[#0d559e] transition-colors flex items-center">
                                    https://www.ihubiitmandi.in/
                                    <ExternalLink className="h-3 w-3 ml-1" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="glass-light border-t">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="text-sm text-gray-600">
                            © 2025 IIT Mandi iHub & HCi Foundation. All rights reserved.
                        </div>
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                            {/* <a href="#" className="hover:text-[#0d559e] transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-[#0d559e] transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-[#0d559e] transition-colors">Accessibility</a> */}
                        </div>
                        <div className="text-sm text-gray-500">
                            Designed & Developed by iHub Team 
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer