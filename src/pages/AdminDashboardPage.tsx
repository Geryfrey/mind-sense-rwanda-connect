
import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Admin dashboard pages
const AdminStudents: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">Manage Students</h1>
    <Card>
      <CardContent className="p-6">
        <p className="text-gray-600">Student management functionality coming soon...</p>
      </CardContent>
    </Card>
  </div>
);

const AdminPredictions: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">Predictions Log</h1>
    <Card>
      <CardContent className="p-6">
        <p className="text-gray-600">Predictions log functionality coming soon...</p>
      </CardContent>
    </Card>
  </div>
);

const AdminAnalytics: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
    <Card>
      <CardContent className="p-6">
        <p className="text-gray-600">Analytics functionality coming soon...</p>
      </CardContent>
    </Card>
  </div>
);

const AdminReports: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">Export Reports</h1>
    <Card>
      <CardContent className="p-6">
        <p className="text-gray-600">Report export functionality coming soon...</p>
      </CardContent>
    </Card>
  </div>
);

const AdminModelFeedback: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">Model Feedback</h1>
    <Card>
      <CardContent className="p-6">
        <p className="text-gray-600">Model feedback functionality coming soon...</p>
      </CardContent>
    </Card>
  </div>
);

const AdminSettings: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
    <Card>
      <CardContent className="p-6">
        <p className="text-gray-600">Admin settings functionality coming soon...</p>
      </CardContent>
    </Card>
  </div>
);

const AdminDashboardPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar 
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
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/students" element={<AdminStudents />} />
            <Route path="/predictions" element={<AdminPredictions />} />
            <Route path="/analytics" element={<AdminAnalytics />} />
            <Route path="/reports" element={<AdminReports />} />
            <Route path="/model-feedback" element={<AdminModelFeedback />} />
            <Route path="/settings" element={<AdminSettings />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
