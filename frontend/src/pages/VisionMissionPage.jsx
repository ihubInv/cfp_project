import React from "react"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { 
  Target, 
  Lightbulb, 
  Eye, 
  Rocket, 
  Globe,
  Users,
  Award,
  TrendingUp,
  BookOpen,
  Heart
} from "lucide-react"

const VisionMissionPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0d559e] to-[#004d8c] py-16 pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Vision & Mission
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Our guiding principles that drive innovation and excellence
            </p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-xl border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-[#0d559e] to-[#004d8c] text-white p-8">
              <CardTitle className="flex items-center text-3xl">
                <Eye className="w-8 h-8 mr-4" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-xl text-gray-700 leading-relaxed mb-6">
                    To become a globally recognized center of excellence in research and 
                    innovation, serving as a catalyst for technological advancement and 
                    sustainable development in the Himalayan region while contributing to 
                    India's position as a leader in science and technology.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="secondary" className="bg-[#0d559e]/10 text-[#0d559e] px-4 py-2">
                      <Globe className="w-4 h-4 mr-2" />
                      Global Recognition
                    </Badge>
                    <Badge variant="secondary" className="bg-[#0d559e]/10 text-[#0d559e] px-4 py-2">
                      <Rocket className="w-4 h-4 mr-2" />
                      Innovation Catalyst
                    </Badge>
                    <Badge variant="secondary" className="bg-[#0d559e]/10 text-[#0d559e] px-4 py-2">
                      <Award className="w-4 h-4 mr-2" />
                      Excellence Center
                    </Badge>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-[#0d559e]/5 to-[#004d8c]/5 rounded-2xl p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Vision Pillars</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-[#0d559e] rounded-full flex items-center justify-center mr-3 mt-1">
                        <span className="text-white font-bold text-sm">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Research Excellence</h4>
                        <p className="text-gray-600 text-sm">World-class research infrastructure and capabilities</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-[#0d559e] rounded-full flex items-center justify-center mr-3 mt-1">
                        <span className="text-white font-bold text-sm">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Innovation Leadership</h4>
                        <p className="text-gray-600 text-sm">Pioneering breakthrough technologies and solutions</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-[#0d559e] rounded-full flex items-center justify-center mr-3 mt-1">
                        <span className="text-white font-bold text-sm">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Regional Impact</h4>
                        <p className="text-gray-600 text-sm">Transforming the Himalayan region through technology</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-xl border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-[#0d559e] to-[#004d8c] text-white p-8">
              <CardTitle className="flex items-center text-3xl">
                <Target className="w-8 h-8 mr-4" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="bg-gradient-to-br from-[#0d559e]/5 to-[#004d8c]/5 rounded-2xl p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Mission Objectives</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-[#0d559e] rounded-full flex items-center justify-center mr-3 mt-1">
                        <BookOpen className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Research Infrastructure</h4>
                        <p className="text-gray-600 text-sm">Provide world-class research facilities and resources</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-[#0d559e] rounded-full flex items-center justify-center mr-3 mt-1">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Collaboration</h4>
                        <p className="text-gray-600 text-sm">Foster interdisciplinary partnerships and teamwork</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-[#0d559e] rounded-full flex items-center justify-center mr-3 mt-1">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Innovation Translation</h4>
                        <p className="text-gray-600 text-sm">Convert research into practical solutions</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-[#0d559e] rounded-full flex items-center justify-center mr-3 mt-1">
                        <Heart className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Societal Impact</h4>
                        <p className="text-gray-600 text-sm">Address challenges and drive economic growth</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xl text-gray-700 leading-relaxed mb-6">
                    To accelerate innovation and entrepreneurship by providing world-class 
                    research infrastructure, fostering interdisciplinary collaboration, 
                    and translating cutting-edge research into practical solutions that 
                    address societal challenges and drive economic growth in the Himalayan region.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="secondary" className="bg-[#0d559e]/10 text-[#0d559e] px-4 py-2">
                      <Lightbulb className="w-4 h-4 mr-2" />
                      Innovation Acceleration
                    </Badge>
                    <Badge variant="secondary" className="bg-[#0d559e]/10 text-[#0d559e] px-4 py-2">
                      <Rocket className="w-4 h-4 mr-2" />
                      Entrepreneurship
                    </Badge>
                    <Badge variant="secondary" className="bg-[#0d559e]/10 text-[#0d559e] px-4 py-2">
                      <Globe className="w-4 h-4 mr-2" />
                      Regional Development
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Strategic Goals */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Strategic Goals</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our roadmap to achieving our vision and mission
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-[#0d559e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-[#0d559e]" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">Research Excellence</h3>
                <p className="text-gray-600 text-center">
                  Establish world-class research facilities and attract top-tier researchers
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-[#0d559e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-[#0d559e]" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">Talent Development</h3>
                <p className="text-gray-600 text-center">
                  Nurture the next generation of scientists and innovators
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-[#0d559e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Rocket className="w-8 h-8 text-[#0d559e]" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">Innovation Translation</h3>
                <p className="text-gray-600 text-center">
                  Bridge the gap between research and real-world applications
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-[#0d559e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-[#0d559e]" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">Global Partnerships</h3>
                <p className="text-gray-600 text-center">
                  Build strategic alliances with international institutions
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-[#0d559e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-[#0d559e]" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">Economic Impact</h3>
                <p className="text-gray-600 text-center">
                  Drive regional economic growth through technology transfer
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-[#0d559e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-[#0d559e]" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">Recognition</h3>
                <p className="text-gray-600 text-center">
                  Achieve national and international recognition for our work
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide our actions and decisions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-[#0d559e]/10 rounded-lg flex items-center justify-center mr-4">
                  <Heart className="w-6 h-6 text-[#0d559e]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Integrity</h3>
                  <p className="text-gray-600">
                    We maintain the highest ethical standards in all our research and operations
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 bg-[#0d559e]/10 rounded-lg flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-[#0d559e]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Collaboration</h3>
                  <p className="text-gray-600">
                    We believe in the power of teamwork and interdisciplinary cooperation
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 bg-[#0d559e]/10 rounded-lg flex items-center justify-center mr-4">
                  <Lightbulb className="w-6 h-6 text-[#0d559e]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                  <p className="text-gray-600">
                    We encourage creative thinking and breakthrough solutions
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-[#0d559e]/10 rounded-lg flex items-center justify-center mr-4">
                  <Award className="w-6 h-6 text-[#0d559e]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Excellence</h3>
                  <p className="text-gray-600">
                    We strive for the highest quality in everything we do
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 bg-[#0d559e]/10 rounded-lg flex items-center justify-center mr-4">
                  <Globe className="w-6 h-6 text-[#0d559e]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Sustainability</h3>
                  <p className="text-gray-600">
                    We are committed to environmentally responsible research and development
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-12 h-12 bg-[#0d559e]/10 rounded-lg flex items-center justify-center mr-4">
                  <Target className="w-6 h-6 text-[#0d559e]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Impact</h3>
                  <p className="text-gray-600">
                    We focus on creating meaningful change for society and the environment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default VisionMissionPage
