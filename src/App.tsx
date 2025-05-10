import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, RequireAuth } from "@/context/AuthContext";
import { MLProvider } from "@/context/MLContext";

// Pages
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import StudentDashboardPage from "./pages/StudentDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import NotFound from "./pages/NotFound";
import UnauthorizedPage from "./pages/UnauthorizedPage";

// Create a client
const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <MLProvider>
              <Routes>
                {/* Landing Page */}
                <Route path="/" element={<LandingPage />} />
                
                {/* Auth Routes */}
                <Route path="/login" element={<AuthPage />} />
                <Route path="/register" element={<AuthPage />} />
                
                {/* Student Dashboard Routes */}
                <Route path="/student" element={
                  <RequireAuth allowedRoles={["student"]}>
                    <StudentDashboardPage />
                  </RequireAuth>
                } />
                <Route path="/student/history" element={
                  <RequireAuth allowedRoles={["student"]}>
                    <StudentDashboardPage />
                  </RequireAuth>
                } />
                <Route path="/student/referrals" element={
                  <RequireAuth allowedRoles={["student"]}>
                    <StudentDashboardPage />
                  </RequireAuth>
                } />
                <Route path="/student/resources" element={
                  <RequireAuth allowedRoles={["student"]}>
                    <StudentDashboardPage />
                  </RequireAuth>
                } />
                
                {/* Admin Dashboard Routes */}
                <Route path="/admin" element={
                  <RequireAuth allowedRoles={["admin"]}>
                    <AdminDashboardPage />
                  </RequireAuth>
                } />
                
                {/* Legacy routes - redirect to new structure */}
                <Route path="/dashboard" element={
                  <RequireAuth>
                    {({ user }) => user?.role === "admin" ? 
                      <Navigate to="/admin" replace /> : 
                      <Navigate to="/student" replace />
                    }
                  </RequireAuth>
                } />
                <Route path="/dashboard/*" element={
                  <RequireAuth>
                    {({ user }) => user?.role === "admin" ? 
                      <Navigate to="/admin" replace /> : 
                      <Navigate to="/student" replace />
                    }
                  </RequireAuth>
                } />
                
                {/* Other Routes */}
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MLProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
