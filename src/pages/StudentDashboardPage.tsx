
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useML } from "@/context/MLContext";
import StudentSidebar from "@/components/student/StudentSidebar";
import AssessmentForm from "@/components/assessment/AssessmentForm";
import AssessmentHistory from "@/components/assessment/AssessmentHistory";
import ReferralsPage from "@/components/referrals/ReferralsPage";
import ResourcesPage from "@/components/resources/ResourcesPage";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Student dashboard pages
const StudentHome: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
        <p className="text-gray-600 mt-2">Monitor your mental health and access support resources</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-2">Quick Assessment</h3>
            <p className="text-gray-600 text-sm mb-4">Take a quick mental health check</p>
            <Button className="w-full">Start Assessment</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-2">Recent Results</h3>
            <p className="text-gray-600 text-sm mb-4">View your latest assessment results</p>
            <Button variant="outline" className="w-full">View Results</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-2">Resources</h3>
            <p className="text-gray-600 text-sm mb-4">Access mental health resources</p>
            <Button variant="outline" className="w-full">Browse Resources</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const StudentJournal: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">Journal / Notes</h1>
    <Card>
      <CardContent className="p-6">
        <p className="text-gray-600">Journal functionality coming soon...</p>
      </CardContent>
    </Card>
  </div>
);

const StudentAppointments: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
    <Card>
      <CardContent className="p-6">
        <p className="text-gray-600">Appointment booking functionality coming soon...</p>
      </CardContent>
    </Card>
  </div>
);

const StudentSettings: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
    <Card>
      <CardContent className="p-6">
        <p className="text-gray-600">Settings panel coming soon...</p>
      </CardContent>
    </Card>
  </div>
);

const StudentDashboardPage: React.FC = () => {
  const { loadModel, isModelLoaded } = useML();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  useEffect(() => {
    // Load the ML model when the dashboard loads
    if (!isModelLoaded) {
      loadModel();
    }
  }, [loadModel, isModelLoaded]);
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <StudentSidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)} 
      />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-72">
        {/* Mobile header */}
        <header className="lg:hidden bg-white shadow-sm border-b border-gray-200 p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </header>
        
        {/* Content area */}
        <main className="flex-1 overflow-auto p-6">
          {!isModelLoaded && (
            <Card className="mb-6">
              <CardContent className="py-4">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-purple-500 animate-pulse"></div>
                  <p className="text-sm text-gray-500">Loading ML model... Please wait</p>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Routes>
            <Route path="/" element={<StudentHome />} />
            <Route path="/check-mental-health" element={<AssessmentForm />} />
            <Route path="/results" element={<AssessmentHistory />} />
            <Route path="/journal" element={<StudentJournal />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/appointments" element={<StudentAppointments />} />
            <Route path="/settings" element={<StudentSettings />} />
            {/* Legacy routes */}
            <Route path="/history" element={<Navigate to="/student/results" replace />} />
            <Route path="/referrals" element={<ReferralsPage />} />
            <Route path="*" element={<Navigate to="/student" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
