import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  HeartHandshake, 
  ArrowRight, 
  Brain, 
  Users, 
  BookOpen, 
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
            Mental Health Support for Students
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            Virtual Assessment & <br className="hidden md:block" /> Referral Platform
          </h1>
          <p className="text-gray-700 text-xl md:text-2xl max-w-3xl mx-auto mb-8">
            AI-powered mental health assessment and support services for university students.
          </p>
          
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white px-8">
                Take Assessment
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
              Designed to provide comprehensive mental health support for university students.
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
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <HeartHandshake className="h-6 w-6 text-purple-400 mr-2" />
                <h3 className="text-xl font-bold">VARP</h3>
              </div>
              <p className="text-gray-400">
                Virtual Assessment & Referral Platform for university students' mental health.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-gray-400" />
                  <span className="text-gray-400">contact@varp.org</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-gray-400" />
                  <span className="text-gray-400">+123 456 7890</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-purple-400">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-purple-400">Terms of Service</a></li>
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
