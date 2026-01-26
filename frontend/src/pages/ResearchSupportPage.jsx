import React from "react"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { 
  BookOpen, 
  Microscope, 
  Users, 
  Award, 
  FileText, 
  DollarSign,
  Target,
  TrendingUp,
  Globe,
  Lightbulb,
  CheckCircle
} from "lucide-react"

const ResearchSupportPage = () => {
  const supportServices = [
    {
      title: "Research Funding",
      description: "Comprehensive funding opportunities for cutting-edge research projects",
      icon: DollarSign,
      features: [
        "SERB Funding Programs",
        "DST Research Grants",
        "Industry Collaborations",
        "International Partnerships"
      ]
    },
    {
      title: "Equipment Access",
      description: "State-of-the-art research equipment and facilities",
      icon: Microscope,
      features: [
        "Advanced Laboratory Equipment",
        "Computing Resources",
        "Specialized Instruments",
        "Shared Facility Access"
      ]
    },
    {
      title: "Mentorship Program",
      description: "Expert guidance and mentorship for researchers",
      icon: Users,
      features: [
        "Senior Researcher Mentorship",
        "Industry Expert Guidance",
        "Peer Collaboration",
        "Career Development Support"
      ]
    },
    {
      title: "Publication Support",
      description: "Assistance with research publication and dissemination",
      icon: BookOpen,
      features: [
        "Manuscript Preparation",
        "Journal Selection",
        "Peer Review Process",
        "Open Access Publishing"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-20">
        <div className="bg-gradient-to-r from-[#0d559e] to-[#004d8c] h-64 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Research Support
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto px-4">
              Empowering researchers with comprehensive support services and funding opportunities
            </p>
          </div>
        </div>
      </section>

      {/* Support Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Support Services</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We provide comprehensive support to researchers at every stage of their journey, 
              from initial concept to final publication and commercialization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {supportServices.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <service.icon className="h-8 w-8 text-[#0d559e]" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <p className="text-gray-600 mt-1">{service.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Process</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Simple steps to apply for research support and funding
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Submit Proposal", description: "Submit your research proposal through our online portal" },
              { step: "02", title: "Review Process", description: "Expert panel reviews your proposal and provides feedback" },
              { step: "03", title: "Approval", description: "Successful proposals receive funding approval and support" },
              { step: "04", title: "Implementation", description: "Begin your research with full support and guidance" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[#0d559e] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="bg-[#0d559e] hover:bg-[#004d8c]">
              Start Your Application
            </Button>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-[#0d559e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need Help with Your Research?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Our research support team is here to help you succeed. Contact us for personalized assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" className="bg-white text-[#0d559e] hover:bg-gray-100">
              Contact Support Team
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-[#0d559e]">
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default ResearchSupportPage
