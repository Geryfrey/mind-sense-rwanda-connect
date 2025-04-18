
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, RequireAuth } from "@/context/AuthContext";
import { MLProvider } from "@/context/MLContext";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import NotFound from "./pages/NotFound";
import UnauthorizedPage from "./pages/UnauthorizedPage";

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
              <Route path="/login" element={<AuthPage />} />
              <Route path="/register" element={<AuthPage />} />
              
              <Route path="/dashboard" element={
                <RequireAuth>
                  <DashboardPage />
                </RequireAuth>
              } />
              <Route path="/dashboard/history" element={
                <RequireAuth>
                  <DashboardPage />
                </RequireAuth>
              } />
              <Route path="/dashboard/referrals" element={
                <RequireAuth>
                  <DashboardPage />
                </RequireAuth>
              } />
              <Route path="/dashboard/resources" element={
                <RequireAuth>
                  <DashboardPage />
                </RequireAuth>
              } />
              <Route path="/dashboard/admin" element={
                <RequireAuth allowedRoles={["admin"]}>
                  <DashboardPage />
                </RequireAuth>
              } />
              
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MLProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
