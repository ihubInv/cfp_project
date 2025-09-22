import React from "react"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { 
  Users, 
  Crown, 
  Award, 
  Building, 
  GraduationCap,
  Briefcase,
  Globe,
  Mail,
  Phone,
  MapPin
} from "lucide-react"

const BoardPage = () => {
  const boardMembers = [
    {
      name: "Prof. Ajit K. Chaturvedi",
      position: "Chairman",
      role: "Director, IIT Mandi",
      expertise: "Computer Science & Engineering",
      education: "Ph.D. from IIT Delhi",
      experience: "25+ years in academia and research",
      email: "director@iitmandi.ac.in",
      phone: "+91-1905-237-900",
      location: "IIT Mandi, Himachal Pradesh"
    },
    {
      name: "Dr. Rajesh Kumar",
      position: "Vice Chairman",
      role: "Professor, Materials Science",
      expertise: "Materials Engineering",
      education: "Ph.D. from IISc Bangalore",
      experience: "20+ years in materials research",
      email: "rajesh.kumar@iitmandi.ac.in",
      phone: "+91-9876543210",
      location: "IIT Mandi, Himachal Pradesh"
    },
    {
      name: "Dr. Sunita Verma",
      position: "Board Member",
      role: "Professor, Physics",
      expertise: "Condensed Matter Physics",
      education: "Ph.D. from TIFR Mumbai",
      experience: "18+ years in physics research",
      email: "sunita.verma@iitmandi.ac.in",
      phone: "+91-9876543213",
      location: "IIT Mandi, Himachal Pradesh"
    },
    {
      name: "Dr. Vikram Singh",
      position: "Board Member",
      role: "Professor, Chemistry",
      expertise: "Organic Chemistry",
      education: "Ph.D. from IIT Bombay",
      experience: "15+ years in chemistry research",
      email: "vikram.singh@iitmandi.ac.in",
      phone: "+91-9876543214",
      location: "IIT Mandi, Himachal Pradesh"
    },
    {
      name: "Dr. Priya Sharma",
      position: "Board Member",
      role: "Professor, Mathematics",
      expertise: "Applied Mathematics",
      education: "Ph.D. from IIT Kanpur",
      experience: "16+ years in mathematics research",
      email: "priya.sharma@iitmandi.ac.in",
      phone: "+91-9876543211",
      location: "IIT Mandi, Himachal Pradesh"
    },
    {
      name: "Mr. Ramesh Agarwal",
      position: "Industry Representative",
      role: "CEO, TechCorp Solutions",
      expertise: "Technology Entrepreneurship",
      education: "MBA from IIM Ahmedabad",
      experience: "20+ years in technology industry",
      email: "ramesh.agarwal@techcorp.com",
      phone: "+91-9876543215",
      location: "New Delhi, India"
    }
  ]

  const committees = [
    {
      name: "Research Committee",
      chair: "Dr. Rajesh Kumar",
      members: ["Dr. Sunita Verma", "Dr. Vikram Singh", "Dr. Priya Sharma"],
      purpose: "Oversee research activities and strategic planning"
    },
    {
      name: "Finance Committee",
      chair: "Dr. Priya Sharma",
      members: ["Mr. Ramesh Agarwal", "Dr. Rajesh Kumar"],
      purpose: "Manage financial resources and budget allocation"
    },
    {
      name: "Industry Relations Committee",
      chair: "Mr. Ramesh Agarwal",
      members: ["Dr. Rajesh Kumar", "Dr. Sunita Verma"],
      purpose: "Foster industry partnerships and technology transfer"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0d559e] to-[#004d8c] py-16 pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Board of Directors
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Leadership team guiding our vision and strategic direction
            </p>
          </div>
        </div>
      </section>

      {/* Board Overview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-xl border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-[#0d559e] to-[#004d8c] text-white p-8">
              <CardTitle className="flex items-center text-3xl">
                <Crown className="w-8 h-8 mr-4" />
                Board Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <p className="text-xl text-gray-700 leading-relaxed mb-6">
                    The Board of Directors of IIT Mandi iHub & HCi Foundation comprises 
                    distinguished academicians, industry leaders, and research experts 
                    who bring together diverse expertise and experience to guide our 
                    strategic direction and ensure excellence in all our endeavors.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="secondary" className="bg-[#0d559e]/10 text-[#0d559e] px-4 py-2">
                      <Users className="w-4 h-4 mr-2" />
                      Diverse Expertise
                    </Badge>
                    <Badge variant="secondary" className="bg-[#0d559e]/10 text-[#0d559e] px-4 py-2">
                      <Award className="w-4 h-4 mr-2" />
                      Industry Experience
                    </Badge>
                    <Badge variant="secondary" className="bg-[#0d559e]/10 text-[#0d559e] px-4 py-2">
                      <Globe className="w-4 h-4 mr-2" />
                      Global Perspective
                    </Badge>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-[#0d559e]/5 to-[#004d8c]/5 rounded-2xl p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Board Composition</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Academic Members</span>
                      <span className="font-semibold text-[#0d559e]">5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Industry Representatives</span>
                      <span className="font-semibold text-[#0d559e]">1</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Total Board Members</span>
                      <span className="font-semibold text-[#0d559e]">6</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Average Experience</span>
                      <span className="font-semibold text-[#0d559e]">18+ years</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Board Members */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Board Members</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet our distinguished board members who guide our strategic direction
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {boardMembers.map((member, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-[#0d559e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-10 h-10 text-[#0d559e]" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                    <Badge variant="secondary" className="bg-[#0d559e]/10 text-[#0d559e] mb-3">
                      {member.position}
                    </Badge>
                    <p className="text-gray-600 text-sm mb-4">{member.role}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <GraduationCap className="w-4 h-4 text-[#0d559e] mr-2 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Expertise</p>
                        <p className="text-sm text-gray-600">{member.expertise}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Award className="w-4 h-4 text-[#0d559e] mr-2 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Education</p>
                        <p className="text-sm text-gray-600">{member.education}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Briefcase className="w-4 h-4 text-[#0d559e] mr-2 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Experience</p>
                        <p className="text-sm text-gray-600">{member.experience}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Mail className="w-4 h-4 text-[#0d559e] mr-2 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Email</p>
                        <p className="text-sm text-gray-600">{member.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Phone className="w-4 h-4 text-[#0d559e] mr-2 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Phone</p>
                        <p className="text-sm text-gray-600">{member.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 text-[#0d559e] mr-2 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Location</p>
                        <p className="text-sm text-gray-600">{member.location}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Committees */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Board Committees</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Specialized committees that focus on specific areas of governance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {committees.map((committee, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-[#0d559e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Building className="w-8 h-8 text-[#0d559e]" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{committee.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{committee.purpose}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-2">Chair</p>
                      <p className="text-sm text-gray-600">{committee.chair}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-2">Members</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {committee.members.map((member, idx) => (
                          <li key={idx} className="flex items-center">
                            <span className="w-2 h-2 bg-[#0d559e] rounded-full mr-2"></span>
                            {member}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Board Responsibilities */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Board Responsibilities</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Key areas of governance and oversight
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card className="p-6">
                <CardContent className="pt-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-[#0d559e]/10 rounded-lg flex items-center justify-center mr-4">
                      <Award className="w-6 h-6 text-[#0d559e]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Strategic Planning</h3>
                      <p className="text-gray-600 text-sm">
                        Develop and approve long-term strategic plans, research priorities, 
                        and institutional goals to ensure sustainable growth and excellence.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardContent className="pt-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-[#0d559e]/10 rounded-lg flex items-center justify-center mr-4">
                      <Building className="w-6 h-6 text-[#0d559e]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Governance</h3>
                      <p className="text-gray-600 text-sm">
                        Ensure compliance with regulations, maintain ethical standards, 
                        and oversee institutional policies and procedures.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardContent className="pt-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-[#0d559e]/10 rounded-lg flex items-center justify-center mr-4">
                      <Globe className="w-6 h-6 text-[#0d559e]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Resource Management</h3>
                      <p className="text-gray-600 text-sm">
                        Oversee financial management, resource allocation, and ensure 
                        efficient utilization of institutional assets and funding.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-6">
                <CardContent className="pt-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-[#0d559e]/10 rounded-lg flex items-center justify-center mr-4">
                      <Users className="w-6 h-6 text-[#0d559e]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Leadership Development</h3>
                      <p className="text-gray-600 text-sm">
                        Recruit, evaluate, and support senior leadership to ensure 
                        effective management and organizational development.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardContent className="pt-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-[#0d559e]/10 rounded-lg flex items-center justify-center mr-4">
                      <Briefcase className="w-6 h-6 text-[#0d559e]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Stakeholder Relations</h3>
                      <p className="text-gray-600 text-sm">
                        Maintain relationships with government agencies, industry partners, 
                        and academic institutions to foster collaboration and support.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardContent className="pt-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-[#0d559e]/10 rounded-lg flex items-center justify-center mr-4">
                      <Crown className="w-6 h-6 text-[#0d559e]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Performance Monitoring</h3>
                      <p className="text-gray-600 text-sm">
                        Monitor institutional performance, evaluate outcomes, and ensure 
                        accountability in achieving strategic objectives.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default BoardPage
