
import React from "react";
import { useAuth } from "@/context/AuthContext";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { LogOut, UserCircle, HeartHandshake, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <HeartHandshake className="h-6 w-6 text-indigo-600 mr-2" />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">VARP Admin</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center text-sm">
              <UserCircle className="h-5 w-5 mr-1 text-gray-500" />
              <span className="font-medium">{user?.name}</span>
              <span className="ml-2 text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 capitalize">
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
              <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 capitalize">
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
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
          </div>
          
          <AdminDashboard />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t mt-8">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-sm text-gray-500">
            VARP Admin Portal - Management dashboard for the Virtual Assessment & Referral Platform
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboardPage;
