
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  HeartHandshake, 
  CheckCircle, 
  ArrowRight, 
  Brain, 
  Users, 
  BookOpen, 
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  Sparkles
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <HeartHandshake className="h-6 w-6 text-purple-600 mr-2" />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">VARP</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#how-it-works" className="text-gray-700 hover:text-purple-600 transition-colors">How It Works</a>
            <a href="#features" className="text-gray-700 hover:text-purple-600 transition-colors">Features</a>
            <a href="#testimonials" className="text-gray-700 hover:text-purple-600 transition-colors">Testimonials</a>
            <a href="#blog" className="text-gray-700 hover:text-purple-600 transition-colors">Blog</a>
            <a href="#contact" className="text-gray-700 hover:text-purple-600 transition-colors">Contact</a>
          </nav>
          
          <div className="flex items-center space-x-3">
            <Link to="/login">
              <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">Login</Button>
            </Link>
            <Link to="/register" className="hidden md:block">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-block mb-4 px-3 py-1 rounded-full bg-purple-100 text-purple-800 font-medium text-sm">
            Mental Health Support for Rwandan Students
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            Virtual Assessment & <br className="hidden md:block" /> Referral Platform
          </h1>
          <p className="text-gray-700 text-xl md:text-2xl max-w-3xl mx-auto mb-8">
            AI-powered mental health assessment and support services for university students across Rwanda.
          </p>
          
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white px-8">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button size="lg" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50 px-8">
                Learn More
              </Button>
            </a>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-md border border-purple-100">
              <div className="font-bold text-3xl text-purple-600 mb-2">500+</div>
              <p className="text-gray-600">Students Supported</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-purple-100">
              <div className="font-bold text-3xl text-blue-500 mb-2">15+</div>
              <p className="text-gray-600">University Partners</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-purple-100">
              <div className="font-bold text-3xl text-indigo-500 mb-2">98%</div>
              <p className="text-gray-600">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Partners/Social Proof */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-gray-600 mb-10">Trusted by leading institutions in Rwanda</h2>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
            <div className="flex items-center text-gray-800 font-bold text-xl">
              <span className="text-purple-600 text-2xl mr-1">U</span>Rwanda
            </div>
            <div className="flex items-center text-gray-800 font-bold text-xl">
              <span className="text-blue-600 text-2xl mr-1">R</span>WIT
            </div>
            <div className="flex items-center text-gray-800 font-bold text-xl">
              <span className="text-indigo-600 text-2xl mr-1">M</span>Health
            </div>
            <div className="flex items-center text-gray-800 font-bold text-xl">
              <span className="text-purple-600 text-2xl mr-1">R</span>NCCI
            </div>
            <div className="flex items-center text-gray-800 font-bold text-xl">
              <span className="text-blue-600 text-2xl mr-1">K</span>HI
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section id="how-it-works" className="py-16 md:py-24 px-4 bg-gradient-to-br from-purple-50 to-blue-100">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">How VARP Works</h2>
            <p className="text-gray-700 text-lg">
              Our AI-powered platform provides personalized mental health support in just a few simple steps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md border border-purple-100 text-center">
              <div className="mb-6 bg-purple-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center">
                <Brain className="text-purple-600 h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Express Yourself</h3>
              <p className="text-gray-700">
                Share how you're feeling in your own words. Our AI understands your emotions and mental state.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md border border-purple-100 text-center">
              <div className="mb-6 bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center">
                <Sparkles className="text-blue-500 h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Get AI Assessment</h3>
              <p className="text-gray-700">
                Receive an instant assessment of your mental health state with personalized feedback.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md border border-purple-100 text-center">
              <div className="mb-6 bg-indigo-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center">
                <HeartHandshake className="text-indigo-500 h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Connect & Support</h3>
              <p className="text-gray-700">
                Get matched with relevant resources and professional support services near you.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 px-4 bg-white">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Platform Features</h2>
            <p className="text-gray-700 text-lg">
              Designed to provide comprehensive mental health support for Rwandan university students.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-purple-100">
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <div className="bg-purple-100 p-3 rounded-lg mr-4">
                    <Brain className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2">AI-Powered Assessment</h3>
                    <p className="text-gray-700">
                      Our advanced AI analyzes your emotional state from your own words, not generic questionnaires.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-purple-100">
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <HeartHandshake className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2">Personalized Referrals</h3>
                    <p className="text-gray-700">
                      Get matched with mental health services and resources specific to your needs.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-purple-100">
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                    <BookOpen className="h-6 w-6 text-indigo-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2">Educational Resources</h3>
                    <p className="text-gray-700">
                      Access a library of mental health articles, self-care tips, and wellness guidance.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-purple-100">
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <div className="bg-green-100 p-3 rounded-lg mr-4">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2">Privacy-Focused</h3>
                    <p className="text-gray-700">
                      Your mental health data is private and secure, with strict access controls.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section id="testimonials" className="py-16 md:py-24 px-4 bg-gradient-to-br from-indigo-50 to-purple-100">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Student Stories</h2>
            <p className="text-gray-700 text-lg">
              See how VARP is making a difference in students' lives across Rwanda.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold text-xl mr-4">
                  JN
                </div>
                <div>
                  <h4 className="font-bold">Jean Niyonzima</h4>
                  <p className="text-sm text-gray-600">University of Rwanda</p>
                </div>
              </div>
              <p className="text-gray-700">
                "VARP helped me understand my feelings during exam stress and connected me with a counselor who changed my perspective on mental health."
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-xl mr-4">
                  CM
                </div>
                <div>
                  <h4 className="font-bold">Claire Mutoni</h4>
                  <p className="text-sm text-gray-600">RWIT</p>
                </div>
              </div>
              <p className="text-gray-700">
                "I was struggling silently until I found VARP. The personalized resources helped me develop healthy coping mechanisms for anxiety."
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xl mr-4">
                  EK
                </div>
                <div>
                  <h4 className="font-bold">Eric Kwizera</h4>
                  <p className="text-sm text-gray-600">KHI</p>
                </div>
              </div>
              <p className="text-gray-700">
                "As a medical student, I was hesitant to seek help. VARP's private assessment gave me the confidence to address my burnout."
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Blog Section */}
      <section id="blog" className="py-16 md:py-24 px-4 bg-white">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Mental Health Blog</h2>
            <p className="text-gray-700 text-lg">
              Latest articles and resources on student mental health and wellness.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
                <Brain className="h-16 w-16 text-white" />
              </div>
              <CardContent className="pt-6">
                <h3 className="font-bold text-xl mb-2">Understanding Stress & Academic Pressure</h3>
                <p className="text-gray-700 mb-4">
                  Learn about common stressors for university students and effective coping strategies.
                </p>
                <Button variant="link" className="text-purple-600 p-0">
                  Read More
                </Button>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                <HeartHandshake className="h-16 w-16 text-white" />
              </div>
              <CardContent className="pt-6">
                <h3 className="font-bold text-xl mb-2">Building Supportive Communities</h3>
                <p className="text-gray-700 mb-4">
                  How peer support networks can strengthen mental health awareness on campus.
                </p>
                <Button variant="link" className="text-purple-600 p-0">
                  Read More
                </Button>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                <Sparkles className="h-16 w-16 text-white" />
              </div>
              <CardContent className="pt-6">
                <h3 className="font-bold text-xl mb-2">Self-Care Practices for Students</h3>
                <p className="text-gray-700 mb-4">
                  Simple daily habits that can improve your mental wellbeing during your studies.
                </p>
                <Button variant="link" className="text-purple-600 p-0">
                  Read More
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-12 text-center">
            <Button variant="outline" className="border-purple-600 text-purple-600">
              View All Articles
            </Button>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-24 px-4 bg-gradient-to-br from-purple-50 to-blue-100">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Get In Touch</h2>
            <p className="text-gray-700 text-lg">
              Questions about VARP? Want to partner with us? We'd love to hear from you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="bg-white p-8 rounded-xl shadow-md">
                <form>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-500">
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
            
            <div>
              <div className="bg-white p-8 rounded-xl shadow-md h-full">
                <h3 className="text-xl font-bold mb-6 text-gray-900">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-purple-100 p-2 rounded-lg mr-4">
                      <Mail className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Email</h4>
                      <p className="text-gray-700">contact@varp-rwanda.org</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-lg mr-4">
                      <Phone className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Phone</h4>
                      <p className="text-gray-700">+250 788 123 456</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-indigo-100 p-2 rounded-lg mr-4">
                      <MessageCircle className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Support</h4>
                      <p className="text-gray-700">Available 24/7 via email or phone</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="bg-purple-100 p-2 rounded-full text-purple-600 hover:bg-purple-200">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="#" className="bg-blue-100 p-2 rounded-full text-blue-600 hover:bg-blue-200">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                    <a href="#" className="bg-indigo-100 p-2 rounded-full text-indigo-600 hover:bg-indigo-200">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <HeartHandshake className="h-6 w-6 text-purple-400 mr-2" />
                <h3 className="text-xl font-bold">VARP</h3>
              </div>
              <p className="text-gray-400">
                Virtual Assessment & Referral Platform for Rwandan university students' mental health.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-purple-400">Home</a></li>
                <li><a href="#how-it-works" className="hover:text-purple-400">How It Works</a></li>
                <li><a href="#features" className="hover:text-purple-400">Features</a></li>
                <li><a href="#testimonials" className="hover:text-purple-400">Testimonials</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#blog" className="hover:text-purple-400">Blog</a></li>
                <li><a href="#" className="hover:text-purple-400">Student Support</a></li>
                <li><a href="#" className="hover:text-purple-400">Mental Health Tips</a></li>
                <li><a href="#" className="hover:text-purple-400">Partner Resources</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-purple-400">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-purple-400">Terms of Service</a></li>
                <li><a href="#" className="hover:text-purple-400">Data Protection</a></li>
                <li><a href="#" className="hover:text-purple-400">Cookies Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} VARP. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
