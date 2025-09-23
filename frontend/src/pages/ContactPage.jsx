import React, { useState } from "react"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send,
  MessageSquare,
  Users,
  Building,
  Globe
} from "lucide-react"

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    inquiryType: ""
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      inquiryType: ""
    })
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: "Address",
      details: [
        "North Campus, VPO Kamand",
        "Near Mind Tree School",
        "Himachal Pradesh 175005, India"
      ]
    },
    {
      icon: Phone,
      title: "Phone",
      details: [
        "+91-1905-237-XXX"
      ]
    },
    {
      icon: Mail,
      title: "Email",
      details: [
        "tih@ihubiitmandi.in"
        
      ]
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: [
        "Monday - Saturday: 9:00 AM - 5:30 PM",
        "Sunday: Closed"
      ]
    }
  ]

  const departments = [
    {
      name: "Research Support",
      email: "research@ihubiitmandi.in",
      phone: "+91-1905-237-001",
      description: "For research funding and project support inquiries"
    },
    {
      name: "Technical Support",
      email: "tech@ihubiitmandi.in",
      phone: "+91-1905-237-002",
      description: "For technical assistance and equipment access"
    },
    {
      name: "Administration",
      email: "admin@ihubiitmandi.in",
      phone: "+91-1905-237-003",
      description: "For general administrative inquiries"
    },
    
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-20">
        <div className="bg-gradient-to-r from-[#0d559e] to-[#004d8c] h-64 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto px-4">
              Get in touch with our team for research support, collaborations, and inquiries
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We're here to help with your research needs. Reach out to us through any of the following channels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <info.icon className="h-6 w-6 text-[#0d559e]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{info.title}</h3>
                  <div className="space-y-1">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-sm text-gray-600">{detail}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Departments */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Send us a Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="inquiryType">Inquiry Type</Label>
                        <Select value={formData.inquiryType} onValueChange={(value) => handleInputChange("inquiryType", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select inquiry type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="research">Research Support</SelectItem>
                            <SelectItem value="technical">Technical Support</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        rows={5}
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full bg-[#0d559e] hover:bg-[#004d8c]">
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Departments */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact by Department</h3>
              <div className="space-y-4">
                {departments.map((dept, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Building className="h-5 w-5 text-[#0d559e]" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold mb-2">{dept.name}</h4>
                          <p className="text-sm text-gray-600 mb-3">{dept.description}</p>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-gray-700">
                              <Mail className="h-4 w-4 mr-2" />
                              <a href={`mailto:${dept.email}`} className="hover:text-[#0d559e]">
                                {dept.email}
                              </a>
                            </div>
                            <div className="flex items-center text-sm text-gray-700">
                              <Phone className="h-4 w-4 mr-2" />
                              <a href={`tel:${dept.phone}`} className="hover:text-[#0d559e]">
                                {dept.phone}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Us</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Located in the beautiful campus of IIT Mandi, Himachal Pradesh
            </p>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="h-96 bg-gray-200 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-4" />
                  <p className="text-lg font-medium">Interactive Map</p>
                  <p className="text-sm">IIT Mandi North Campus, Kamand, HP</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Button variant="outline" size="lg">
              <Globe className="h-4 w-4 mr-2" />
              Get Directions
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default ContactPage
