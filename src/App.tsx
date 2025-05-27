
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MLProvider } from "@/context/MLContext";

// Pages
import LandingPage from "./pages/LandingPage";
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
        <MLProvider>
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Student Dashboard Routes */}
            <Route path="/student/*" element={<StudentDashboardPage />} />
            
            {/* Admin Dashboard Routes */}
            <Route path="/admin/*" element={<AdminDashboardPage />} />
            
            {/* Legacy routes - redirect to dashboards */}
            <Route path="/dashboard" element={<StudentDashboardPage />} />
            <Route path="/dashboard/*" element={<StudentDashboardPage />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MLProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
