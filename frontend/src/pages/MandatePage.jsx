import React from "react"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { 
  FileText, 
  Target, 
  Users, 
  Building, 
  Lightbulb,
  Globe,
  Award,
  BookOpen,
  TrendingUp,
  Shield,
  Heart
} from "lucide-react"

const MandatePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0d559e] to-[#004d8c] py-16 pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Our Mandate
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              The official charter and responsibilities that guide our operations
            </p>
          </div>
        </div>
      </section>

      {/* Mandate Overview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-xl border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-[#0d559e] to-[#004d8c] text-white p-8">
              <CardTitle className="flex items-center text-3xl">
                <FileText className="w-8 h-8 mr-4" />
                Official Mandate
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-gray-700 leading-relaxed mb-6">
                  IIT Mandi iHub & HCi Foundation operates under a comprehensive mandate 
                  established to promote research excellence, innovation, and technological 
                  advancement in the Himalayan region. Our mandate encompasses multiple 
                  dimensions of academic, industrial, and societal development.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  As a premier research institution, we are committed to fostering 
                  interdisciplinary collaboration, supporting entrepreneurship, and 
                  translating cutting-edge research into practical solutions that address 
                  regional and national challenges.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Core Mandates */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Core Mandates</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The fundamental responsibilities that define our purpose and scope
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-[#0d559e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-[#0d559e]" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">Research & Development</h3>
                <p className="text-gray-600 text-center">
                  Conduct cutting-edge research across multiple disciplines and establish 
                  world-class research infrastructure to advance scientific knowledge and 
                  technological capabilities.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-[#0d559e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-8 h-8 text-[#0d559e]" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">Innovation & Entrepreneurship</h3>
                <p className="text-gray-600 text-center">
                  Foster innovation culture, support startup ecosystems, and facilitate 
                  technology transfer from research to industry for economic development.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-[#0d559e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-[#0d559e]" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">Human Resource Development</h3>
                <p className="text-gray-600 text-center">
                  Train and develop skilled professionals, researchers, and entrepreneurs 
                  to meet the growing demands of the technology sector and research community.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-[#0d559e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-[#0d559e]" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">Regional Development</h3>
                <p className="text-gray-600 text-center">
                  Contribute to the socio-economic development of the Himalayan region 
                  through technology interventions and capacity building initiatives.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Specific Responsibilities */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Specific Responsibilities</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Detailed areas of focus and operational responsibilities
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card className="p-6">
                <CardContent className="pt-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-[#0d559e]/10 rounded-lg flex items-center justify-center mr-4">
                      <Building className="w-6 h-6 text-[#0d559e]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Infrastructure Development</h3>
                      <p className="text-gray-600 text-sm">
                        Establish and maintain state-of-the-art research facilities, 
                        laboratories, and technology centers to support advanced research activities.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardContent className="pt-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-[#0d559e]/10 rounded-lg flex items-center justify-center mr-4">
                      <Target className="w-6 h-6 text-[#0d559e]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Strategic Research Areas</h3>
                      <p className="text-gray-600 text-sm">
                        Focus on priority areas including materials science, environmental 
                        technologies, biotechnology, and information technology.
                      </p>
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
                      <h3 className="text-lg font-semibold mb-2">Technology Transfer</h3>
                      <p className="text-gray-600 text-sm">
                        Facilitate the commercialization of research outcomes and 
                        promote industry-academia collaboration for technology adoption.
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
                      <Award className="w-6 h-6 text-[#0d559e]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Quality Assurance</h3>
                      <p className="text-gray-600 text-sm">
                        Maintain highest standards of research quality, ethical practices, 
                        and academic excellence in all our programs and initiatives.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardContent className="pt-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-[#0d559e]/10 rounded-lg flex items-center justify-center mr-4">
                      <Shield className="w-6 h-6 text-[#0d559e]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Policy & Governance</h3>
                      <p className="text-gray-600 text-sm">
                        Develop and implement policies that promote innovation, 
                        ensure transparency, and maintain institutional integrity.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardContent className="pt-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-[#0d559e]/10 rounded-lg flex items-center justify-center mr-4">
                      <Heart className="w-6 h-6 text-[#0d559e]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Social Impact</h3>
                      <p className="text-gray-600 text-sm">
                        Address societal challenges through research and development, 
                        contributing to sustainable development and social welfare.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Regulatory Framework */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Regulatory Framework</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The legal and regulatory foundation that governs our operations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-[#0d559e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-[#0d559e]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Legal Framework</h3>
                <p className="text-gray-600">
                  Operate under the legal framework established by the Government of India 
                  and the Ministry of Education for research institutions.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-[#0d559e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-[#0d559e]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Compliance</h3>
                <p className="text-gray-600">
                  Ensure compliance with all applicable laws, regulations, and 
                  guidelines governing research institutions and technology transfer.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-[#0d559e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-[#0d559e]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Accountability</h3>
                <p className="text-gray-600">
                  Maintain transparency and accountability in all operations, 
                  reporting to stakeholders and regulatory authorities as required.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Performance Indicators */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Performance Indicators</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Metrics that measure our success in fulfilling our mandate
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-[#0d559e] mb-2">50+</div>
                <div className="text-sm text-gray-600">Active Research Projects</div>
              </CardContent>
            </Card>

            <Card className="p-6 text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-[#0d559e] mb-2">200+</div>
                <div className="text-sm text-gray-600">Research Publications</div>
              </CardContent>
            </Card>

            <Card className="p-6 text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-[#0d559e] mb-2">15+</div>
                <div className="text-sm text-gray-600">Industry Partnerships</div>
              </CardContent>
            </Card>

            <Card className="p-6 text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-[#0d559e] mb-2">₹100Cr+</div>
                <div className="text-sm text-gray-600">Research Funding</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default MandatePage
