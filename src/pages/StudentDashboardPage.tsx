
import React, { useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useML } from "@/context/MLContext";
import AssessmentForm from "@/components/assessment/AssessmentForm";
import { LogOut, UserCircle, CheckCircle, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const StudentDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { loadModel, isModelLoaded } = useML();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
  useEffect(() => {
    // Load the ML model when the dashboard loads
    if (!isModelLoaded) {
      loadModel();
    }
  }, [loadModel, isModelLoaded]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle className="h-6 w-6 text-purple-600 mr-2" />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">VARP</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center text-sm">
              <UserCircle className="h-5 w-5 mr-1 text-gray-500" />
              <span className="font-medium">{user?.name}</span>
              <span className="ml-2 text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800 capitalize">
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
              <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800 capitalize">
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
          value="assessment"
          className="space-y-6"
        >
          <div className="bg-white p-1 rounded-lg shadow-sm">
            <TabsList className="w-full grid grid-cols-1">
              <TabsTrigger value="assessment" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span>Mental Health Assessment</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          {!isModelLoaded && (
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-purple-500 animate-pulse"></div>
                  <p className="text-sm text-gray-500">Loading ML model... Please wait</p>
                </div>
              </CardContent>
            </Card>
          )}
          
          <TabsContent value="assessment">
            <AssessmentForm />
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t mt-8">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-sm text-gray-500">
            Virtual Assessment & Referral Platform (VARP) - A mental health initiative for students
          </p>
        </div>
      </footer>
    </div>
  );
};

export default StudentDashboardPage;
