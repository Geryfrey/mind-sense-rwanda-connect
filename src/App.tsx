
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MLProvider } from "@/context/MLContext";
import { AuthProvider } from "@/context/AuthContext";
import { RequireAuth } from "@/components/auth/RequireAuth";

// Pages
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import StudentDashboardPage from "./pages/StudentDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import NotFound from "./pages/NotFound";

// Create a client
const queryClient = new QueryClient();

const App = () => (
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
              
              {/* Protected Student Dashboard Routes */}
              <Route 
                path="/student/*" 
                element={
                  <RequireAuth allowedRoles={["student"]}>
                    <StudentDashboardPage />
                  </RequireAuth>
                } 
              />
              
              {/* Protected Admin Dashboard Routes */}
              <Route 
                path="/admin/*" 
                element={
                  <RequireAuth allowedRoles={["admin"]}>
                    <AdminDashboardPage />
                  </RequireAuth>
                } 
              />
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MLProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
