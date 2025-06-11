
import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Brain, BarChart3, BookOpen, Users, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-8 w-8 text-purple-600" />
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
                SWAP
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Student Wellness Assessment Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Supporting mental health for Rwandan university students through AI-powered assessments, 
            personalized resources, and professional referrals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Start Your Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Login to Continue
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How SWAP Supports You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Brain className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>AI Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Advanced AI analyzes your responses to provide personalized mental health insights
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Progress Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Monitor your mental wellness journey with detailed analytics and trends
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Self-Help Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Access curated mental health resources, exercises, and coping strategies
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>Professional Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Connect with qualified counselors and mental health professionals
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Privacy & Security */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Shield className="h-16 w-16 text-purple-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-6">Your Privacy is Our Priority</h2>
          <p className="text-lg text-gray-600 mb-8">
            All your data is encrypted and securely stored. We follow strict privacy guidelines 
            to ensure your mental health journey remains confidential and protected.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">Encrypted Data</h3>
              <p className="text-gray-600 text-sm">All information is encrypted end-to-end</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">Confidential</h3>
              <p className="text-gray-600 text-sm">Your assessments remain private and secure</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">GDPR Compliant</h3>
              <p className="text-gray-600 text-sm">Following international privacy standards</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Wellness Journey?</h2>
          <p className="text-xl mb-8">
            Join thousands of students taking control of their mental health
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary">
              Create Your Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <CheckCircle className="h-6 w-6 text-purple-400" />
            <span className="text-lg font-semibold">SWAP</span>
          </div>
          <p className="text-gray-400">
            Student Wellness Assessment Platform - Supporting mental health in Rwandan universities
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
