import React from "react"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { 
  Building, 
  Users, 
  Target, 
  Award, 
  Lightbulb, 
  Globe,
  TrendingUp,
  BookOpen
} from "lucide-react"

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0d559e] to-[#004d8c] py-16 pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About IIT Mandi iHub & HCi Foundation
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Empowering innovation and research excellence in the Himalayan region
            </p>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Foundation</h2>
              <p className="text-lg text-gray-600 mb-6">
                IIT Mandi iHub and HCi Foundation (iHub) is a Technology Innovation Hub (TIH).
                The Hub was incorporated on 24th September 2020.
                It is hosted at the Indian Institute of Technology (IIT) Mandi under India’s
                National Mission on Interdisciplinary Cyber-Physical Systems (NM-ICPS).
              </p>
              <p className="text-lg text-gray-600 mb-6">
                The iHub has been planned with the objective of making India a world leader
                in Human-Computer Interaction (HCi)-based research.
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="bg-[#0d559e]/10 text-[#0d559e] px-4 py-2">
                  <Building className="w-4 h-4 mr-2" />
                  Research Excellence
                </Badge>
                <Badge variant="secondary" className="bg-[#0d559e]/10 text-[#0d559e] px-4 py-2">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Innovation Hub
                </Badge>
                <Badge variant="secondary" className="bg-[#0d559e]/10 text-[#0d559e] px-4 py-2">
                  <Globe className="w-4 h-4 mr-2" />
                  Global Impact
                </Badge>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-[#0d559e] to-[#004d8c] rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Key Statistics</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">50+</div>
                    <div className="text-sm opacity-90">Active Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">200+</div>
                    <div className="text-sm opacity-90">Researchers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">15+</div>
                    <div className="text-sm opacity-90">Partner Institutions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">₹100Cr+</div>
                    <div className="text-sm opacity-90">Research Funding</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-[#0d559e] to-[#004d8c] text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <Target className="w-6 h-6 mr-3" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 leading-relaxed">
                  To accelerate innovation and entrepreneurship by providing world-class 
                  research infrastructure, fostering interdisciplinary collaboration, 
                  and translating cutting-edge research into practical solutions that 
                  address societal challenges and drive economic growth in the Himalayan region.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-[#0d559e] to-[#004d8c] text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <Lightbulb className="w-6 h-6 mr-3" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 leading-relaxed">
                  To become a globally recognized center of excellence in research and 
                  innovation, serving as a catalyst for technological advancement and 
                  sustainable development in the Himalayan region while contributing to 
                  India's position as a leader in science and technology.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide our work and shape our culture
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-[#0d559e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-[#0d559e]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Excellence</h3>
                <p className="text-gray-600">
                  Committed to maintaining the highest standards in research and innovation
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-[#0d559e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-[#0d559e]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Collaboration</h3>
                <p className="text-gray-600">
                  Fostering partnerships between academia, industry, and government
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-[#0d559e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-[#0d559e]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Innovation</h3>
                <p className="text-gray-600">
                  Encouraging creative thinking and breakthrough solutions
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-[#0d559e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-[#0d559e]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Impact</h3>
                <p className="text-gray-600">
                  Creating meaningful change through research and development
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Research Focus Areas */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Research Focus Areas</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our research spans across multiple domains to address complex challenges
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-[#0d559e]/10 rounded-lg flex items-center justify-center mb-4">
                  <Building className="w-6 h-6 text-[#0d559e]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Materials Science</h3>
                <p className="text-gray-600">
                  Advanced materials research for sustainable technologies and applications
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-[#0d559e]/10 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-[#0d559e]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Environmental Science</h3>
                <p className="text-gray-600">
                  Climate change mitigation and sustainable environmental solutions
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-[#0d559e]/10 rounded-lg flex items-center justify-center mb-4">
                  <Lightbulb className="w-6 h-6 text-[#0d559e]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Technology Innovation</h3>
                <p className="text-gray-600">
                  Cutting-edge technologies and digital transformation solutions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default AboutPage
