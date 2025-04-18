
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useML } from "@/context/MLContext";
import AssessmentForm from "@/components/assessment/AssessmentForm";
import AssessmentHistory from "@/components/assessment/AssessmentHistory";
import ReferralsPage from "@/components/referrals/ReferralsPage";
import ResourcesPage from "@/components/resources/ResourcesPage";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { LogOut, UserCircle, CheckCircle, BarChart2, History, HeartHandshake, BookOpen, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { loadModel, isModelLoaded } = useML();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
  useEffect(() => {
    // Load the ML model when the dashboard loads
    if (!isModelLoaded) {
      loadModel();
    }
  }, [loadModel, isModelLoaded]);
  
  // Get active tab from URL or default to assessment
  const getActiveTabFromUrl = () => {
    const path = location.pathname;
    if (path.includes('/dashboard/history')) return 'history';
    if (path.includes('/dashboard/referrals')) return 'referrals';
    if (path.includes('/dashboard/resources')) return 'resources';
    if (path.includes('/dashboard/admin') && user?.role === 'admin') return 'admin';
    return 'assessment';
  };
  
  const [activeTab, setActiveTab] = React.useState(getActiveTabFromUrl());
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Update URL based on selected tab
    switch (value) {
      case 'history':
        navigate('/dashboard/history');
        break;
      case 'referrals':
        navigate('/dashboard/referrals');
        break;
      case 'resources':
        navigate('/dashboard/resources');
        break;
      case 'admin':
        navigate('/dashboard/admin');
        break;
      default:
        navigate('/dashboard');
    }
    
    // Close mobile menu after navigation
    setIsMobileMenuOpen(false);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <HeartHandshake className="h-6 w-6 text-blue-500 mr-2" />
            <h1 className="text-xl font-bold text-gray-900">VARP</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center text-sm">
              <UserCircle className="h-5 w-5 mr-1 text-gray-500" />
              <span className="font-medium">{user?.name}</span>
              <span className="ml-2 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 capitalize">
                {user?.role}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
          
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg px-4 py-3 space-y-2">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center text-sm">
                <UserCircle className="h-5 w-5 mr-1 text-gray-500" />
                <span className="font-medium">{user?.name}</span>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 capitalize">
                {user?.role}
              </span>
            </div>
            <Button variant="outline" size="sm" className="w-full" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        )}
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-6 md:py-8">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="space-y-6"
        >
          <div className="bg-white p-1 rounded-lg shadow-sm">
            <TabsList className="w-full grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              <TabsTrigger value="assessment" className="data-[state=active]:bg-blue-50">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Assessment</span>
                <span className="md:hidden">Assess</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-blue-50">
                <History className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">History</span>
                <span className="md:hidden">History</span>
              </TabsTrigger>
              <TabsTrigger value="referrals" className="data-[state=active]:bg-blue-50">
                <HeartHandshake className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Referrals</span>
                <span className="md:hidden">Refer</span>
              </TabsTrigger>
              <TabsTrigger value="resources" className="data-[state=active]:bg-blue-50">
                <BookOpen className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Resources</span>
                <span className="md:hidden">Learn</span>
              </TabsTrigger>
              {user?.role === 'admin' && (
                <TabsTrigger value="admin" className="data-[state=active]:bg-blue-50">
                  <BarChart2 className="h-4 w-4 mr-2" />
                  <span className="hidden md:inline">Admin</span>
                  <span className="md:hidden">Admin</span>
                </TabsTrigger>
              )}
            </TabsList>
          </div>
          
          {!isModelLoaded && (
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse"></div>
                  <p className="text-sm text-gray-500">Loading ML model... Please wait</p>
                </div>
              </CardContent>
            </Card>
          )}
          
          <TabsContent value="assessment">
            <AssessmentForm />
          </TabsContent>
          
          <TabsContent value="history">
            <AssessmentHistory />
          </TabsContent>
          
          <TabsContent value="referrals">
            <ReferralsPage />
          </TabsContent>
          
          <TabsContent value="resources">
            <ResourcesPage />
          </TabsContent>
          
          {user?.role === 'admin' && (
            <TabsContent value="admin">
              <AdminDashboard />
            </TabsContent>
          )}
        </Tabs>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t mt-8">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-sm text-gray-500">
            Virtual Assessment & Referral Platform (VARP) - A mental health initiative for Rwandan students
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;
