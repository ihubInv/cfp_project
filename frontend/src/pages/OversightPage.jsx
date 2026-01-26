import React from "react"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { 
  Shield, 
  Eye, 
  CheckCircle, 
  AlertTriangle, 
  FileText,
  Users,
  Building,
  Globe,
  Award,
  TrendingUp,
  Lock,
  Scale
} from "lucide-react"

const OversightPage = () => {
  const oversightMechanisms = [
    {
      title: "Internal Audit",
      description: "Regular internal audits to ensure compliance and efficiency",
      frequency: "Quarterly",
      responsible: "Internal Audit Committee",
      status: "Active"
    },
    {
      title: "External Review",
      description: "Independent external reviews by qualified professionals",
      frequency: "Annually",
      responsible: "External Auditors",
      status: "Active"
    },
    {
      title: "Board Oversight",
      description: "Board-level monitoring and governance oversight",
      frequency: "Monthly",
      responsible: "Board of Directors",
      status: "Active"
    },
    {
      title: "Regulatory Compliance",
      description: "Compliance with government regulations and guidelines",
      frequency: "Continuous",
      responsible: "Compliance Officer",
      status: "Active"
    }
  ]

  const complianceAreas = [
    {
      area: "Financial Management",
      description: "Proper financial controls and reporting",
      status: "Compliant",
      lastReview: "2024-01-15"
    },
    {
      area: "Research Ethics",
      description: "Ethical conduct in research activities",
      status: "Compliant",
      lastReview: "2024-02-20"
    },
    {
      area: "Data Protection",
      description: "Protection of sensitive data and privacy",
      status: "Compliant",
      lastReview: "2024-01-30"
    },
    {
      area: "Human Resources",
      description: "Fair employment practices and policies",
      status: "Compliant",
      lastReview: "2024-02-10"
    },
    {
      area: "Environmental Safety",
      description: "Environmental protection and safety measures",
      status: "Compliant",
      lastReview: "2024-02-05"
    },
    {
      area: "Intellectual Property",
      description: "Protection and management of IP rights",
      status: "Compliant",
      lastReview: "2024-01-25"
    }
  ]

  const riskAreas = [
    {
      risk: "Financial Risk",
      level: "Low",
      mitigation: "Regular financial monitoring and controls",
      status: "Under Control"
    },
    {
      risk: "Operational Risk",
      level: "Low",
      mitigation: "Standardized procedures and training",
      status: "Under Control"
    },
    {
      risk: "Reputational Risk",
      level: "Low",
      mitigation: "Transparent communication and quality assurance",
      status: "Under Control"
    },
    {
      risk: "Regulatory Risk",
      level: "Low",
      mitigation: "Continuous compliance monitoring",
      status: "Under Control"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0d559e] to-[#004d8c] py-16 pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Oversight & Governance
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Ensuring transparency, accountability, and excellence in all our operations
            </p>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-xl border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-[#0d559e] to-[#004d8c] text-white p-8">
              <CardTitle className="flex items-center text-3xl">
                <Shield className="w-8 h-8 mr-4" />
                Oversight Framework
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <p className="text-xl text-gray-700 leading-relaxed mb-6">
                    IIT Mandi iHub & HCi Foundation maintains a comprehensive oversight 
                    framework to ensure transparency, accountability, and compliance with 
                    all applicable regulations and best practices.
                  </p>
                  <p className="text-lg text-gray-600 leading-relaxed mb-6">
                    Our oversight mechanisms include regular audits, compliance monitoring, 
                    risk management, and stakeholder reporting to maintain the highest 
                    standards of governance and operational excellence.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="secondary" className="bg-[#0d559e]/10 text-[#0d559e] px-4 py-2">
                      <Shield className="w-4 h-4 mr-2" />
                      Transparency
                    </Badge>
                    <Badge variant="secondary" className="bg-[#0d559e]/10 text-[#0d559e] px-4 py-2">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Accountability
                    </Badge>
                    <Badge variant="secondary" className="bg-[#0d559e]/10 text-[#0d559e] px-4 py-2">
                      <Scale className="w-4 h-4 mr-2" />
                      Compliance
                    </Badge>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-[#0d559e]/5 to-[#004d8c]/5 rounded-2xl p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Oversight Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Audit Frequency</span>
                      <span className="font-semibold text-[#0d559e]">Quarterly</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Compliance Rate</span>
                      <span className="font-semibold text-green-600">100%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Risk Level</span>
                      <span className="font-semibold text-green-600">Low</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Last Review</span>
                      <span className="font-semibold text-[#0d559e]">Feb 2024</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Oversight Mechanisms */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Oversight Mechanisms</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Multi-layered approach to ensure comprehensive oversight
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {oversightMechanisms.map((mechanism, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-[#0d559e]/10 rounded-lg flex items-center justify-center mr-4">
                      <Eye className="w-6 h-6 text-[#0d559e]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{mechanism.title}</h3>
                      <p className="text-gray-600 mb-4">{mechanism.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-900">Frequency</p>
                          <p className="text-gray-600">{mechanism.frequency}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Responsible</p>
                          <p className="text-gray-600">{mechanism.responsible}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          {mechanism.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Areas */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Compliance Areas</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Key areas of regulatory and operational compliance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complianceAreas.map((area, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-[#0d559e]/10 rounded-lg flex items-center justify-center mr-4">
                      <FileText className="w-6 h-6 text-[#0d559e]" />
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {area.status}
                    </Badge>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2">{area.area}</h3>
                  <p className="text-gray-600 text-sm mb-4">{area.description}</p>
                  
                  <div className="text-sm text-gray-500">
                    Last Review: {area.lastReview}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Risk Management */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Risk Management</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Proactive identification and mitigation of potential risks
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {riskAreas.map((risk, index) => (
              <Card key={index} className="p-6">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-[#0d559e]/10 rounded-lg flex items-center justify-center mr-4">
                      <AlertTriangle className="w-6 h-6 text-[#0d559e]" />
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {risk.level} Risk
                    </Badge>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2">{risk.risk}</h3>
                  <p className="text-gray-600 text-sm mb-4">{risk.mitigation}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Status</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {risk.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Governance Structure */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Governance Structure</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Clear hierarchy and accountability framework
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-[#0d559e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-[#0d559e]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Board of Directors</h3>
                <p className="text-gray-600 text-sm">
                  Strategic oversight and policy formulation
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-[#0d559e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="w-8 h-8 text-[#0d559e]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Management Team</h3>
                <p className="text-gray-600 text-sm">
                  Day-to-day operations and implementation
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-[#0d559e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-[#0d559e]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Audit Committee</h3>
                <p className="text-gray-600 text-sm">
                  Financial oversight and risk management
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-[#0d559e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-[#0d559e]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Stakeholders</h3>
                <p className="text-gray-600 text-sm">
                  External oversight and accountability
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Reporting & Transparency */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Reporting & Transparency</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Regular reporting and transparent communication with stakeholders
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#0d559e]/10 rounded-lg flex items-center justify-center mr-4">
                    <FileText className="w-6 h-6 text-[#0d559e]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Annual Reports</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Comprehensive annual reports covering all aspects of our operations, 
                      financial performance, and strategic achievements.
                    </p>
                    <Badge variant="secondary" className="bg-[#0d559e]/10 text-[#0d559e]">
                      Published Annually
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#0d559e]/10 rounded-lg flex items-center justify-center mr-4">
                    <TrendingUp className="w-6 h-6 text-[#0d559e]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Performance Metrics</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Regular reporting of key performance indicators, research outcomes, 
                      and institutional achievements.
                    </p>
                    <Badge variant="secondary" className="bg-[#0d559e]/10 text-[#0d559e]">
                      Quarterly Updates
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#0d559e]/10 rounded-lg flex items-center justify-center mr-4">
                    <Lock className="w-6 h-6 text-[#0d559e]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Financial Transparency</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Detailed financial statements, budget allocations, and expenditure 
                      reports available for public review.
                    </p>
                    <Badge variant="secondary" className="bg-[#0d559e]/10 text-[#0d559e]">
                      Public Access
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#0d559e]/10 rounded-lg flex items-center justify-center mr-4">
                    <Award className="w-6 h-6 text-[#0d559e]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Compliance Reports</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Regular compliance reports and audit findings shared with 
                      regulatory authorities and stakeholders.
                    </p>
                    <Badge variant="secondary" className="bg-[#0d559e]/10 text-[#0d559e]">
                      Regular Updates
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default OversightPage
