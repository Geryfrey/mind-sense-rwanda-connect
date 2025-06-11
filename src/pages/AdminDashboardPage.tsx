
import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Admin dashboard pages - simplified components for now
const StudentsManagement: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">Manage Students</h1>
    <Card>
      <CardHeader>
        <CardTitle>Student Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Student management functionality will be implemented here.</p>
      </CardContent>
    </Card>
  </div>
);

const PredictionsLog: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">Predictions Log</h1>
    <Card>
      <CardHeader>
        <CardTitle>AI Predictions History</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Mental health predictions and assessments log will be displayed here.</p>
      </CardContent>
    </Card>
  </div>
);

const Analytics: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
    <Card>
      <CardHeader>
        <CardTitle>System Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Detailed analytics and insights will be shown here.</p>
      </CardContent>
    </Card>
  </div>
);

const Reports: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">Export Reports</h1>
    <Card>
      <CardHeader>
        <CardTitle>Generate Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Report generation and export functionality will be available here.</p>
      </CardContent>
    </Card>
  </div>
);

const ModelFeedback: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">Model Feedback</h1>
    <Card>
      <CardHeader>
        <CardTitle>AI Model Training & Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Model performance metrics and feedback management will be implemented here.</p>
      </CardContent>
    </Card>
  </div>
);

const AdminSettings: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Administrative settings and configuration options will be available here.</p>
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
      
      {/* Main content area with proper spacing */}
      <div className="flex-1 flex flex-col">
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
            <Route path="/students" element={<StudentsManagement />} />
            <Route path="/predictions" element={<PredictionsLog />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/model-feedback" element={<ModelFeedback />} />
            <Route path="/settings" element={<AdminSettings />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
