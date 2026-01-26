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
    <div className="min-h-screen bg-white">
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
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Technology Innovation Hub</h2>
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

      {/* Sectors Addressed in Human-Computer Interaction */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The sectors addressed in Human-Computer Interaction</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-[#0d559e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-[#0d559e]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Assistive Technologies</h3>
                <p className="text-gray-600">
                  Developing innovative solutions to enhance accessibility and improve quality of life for individuals with disabilities through advanced human-computer interaction interfaces.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-[#0d559e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="w-8 h-8 text-[#0d559e]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Device-Led Technologies</h3>
                <p className="text-gray-600">
                  Creating intelligent devices and IoT solutions that seamlessly integrate with human behavior patterns and enhance daily interactions through smart technology.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-[#0d559e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-8 h-8 text-[#0d559e]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Experience Technologies</h3>
                <p className="text-gray-600">
                  Designing immersive user experiences through virtual reality, augmented reality, and mixed reality technologies that transform how humans interact with digital environments.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-[#0d559e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-[#0d559e]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Generative AI Technologies</h3>
                <p className="text-gray-600">
                  Advancing AI-powered interfaces that understand natural language, generate creative content, and provide intelligent assistance through conversational and multimodal interactions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Primary Activities of iHub */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Primary activities of iHub</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-[#0d559e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-[#0d559e]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Research & Technology Development</h3>
                <p className="text-gray-600">
                  Conducting cutting-edge research in HCi domains, developing innovative technologies, and creating solutions that bridge the gap between academic research and real-world applications.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-[#0d559e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-[#0d559e]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Skill Development</h3>
                <p className="text-gray-600">
                  Offering comprehensive training programs, workshops, and certification courses to develop expertise in emerging technologies and prepare professionals for the future workforce.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-[#0d559e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-[#0d559e]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Incubation & Acceleration</h3>
                <p className="text-gray-600">
                  Supporting startups and entrepreneurs by providing mentorship, funding opportunities, infrastructure, and business development services to accelerate innovation and commercialization.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-[#0d559e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-[#0d559e]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Collaboration</h3>
                <p className="text-gray-600">
                  Building strategic partnerships with industry leaders, academic institutions, government agencies, and international organizations to foster innovation and knowledge exchange.
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
