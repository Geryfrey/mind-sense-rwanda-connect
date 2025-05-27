
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Shield, Users, BarChart3, HeartHandshake } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Assessment",
      description: "Advanced machine learning algorithms provide accurate mental health screening and personalized recommendations."
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "Your mental health data is protected with enterprise-grade security and complete confidentiality."
    },
    {
      icon: Users,
      title: "Professional Network",
      description: "Connect with licensed mental health professionals and counselors in Rwanda."
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Monitor your mental wellness journey with detailed analytics and progress reports."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <HeartHandshake className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
              VARP
            </span>
          </div>
          <div className="space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate("/student")}
              className="border-purple-600 text-purple-600 hover:bg-purple-50"
            >
              Student Portal
            </Button>
            <Button
              onClick={() => navigate("/admin")}
              className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
            >
              Admin Portal
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Virtual Assessment & Referral Platform
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Supporting mental health for Rwandan university students through AI-powered assessment, 
            professional referrals, and comprehensive wellness resources.
          </p>
          <div className="space-x-4">
            <Button
              size="lg"
              onClick={() => navigate("/student")}
              className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-lg px-8 py-3"
            >
              Get Started as Student
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/admin")}
              className="border-purple-600 text-purple-600 hover:bg-purple-50 text-lg px-8 py-3"
            >
              Admin Access
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Mental Health Support
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our platform combines cutting-edge technology with human compassion to provide 
            the best mental health resources for university students.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center h-full">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-gray-600">Available Support</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">95%</div>
              <div className="text-gray-600">Assessment Accuracy</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">1000+</div>
              <div className="text-gray-600">Students Helped</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <HeartHandshake className="h-6 w-6 text-purple-400" />
                <span className="text-xl font-bold">VARP</span>
              </div>
              <p className="text-gray-400">
                Supporting mental health for Rwandan university students.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Assessment</li>
                <li>Resources</li>
                <li>Referrals</li>
                <li>Analytics</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Documentation</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400">
                <li>University Partners</li>
                <li>Mental Health Professionals</li>
                <li>Student Organizations</li>
                <li>Community</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 VARP. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
