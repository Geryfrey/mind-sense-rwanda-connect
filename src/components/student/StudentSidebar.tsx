
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Brain, 
  BarChart3, 
  BookOpen, 
  Calendar,
  Settings,
  LogOut,
  X,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

interface StudentSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const StudentSidebar: React.FC<StudentSidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems = [
    { path: "/student", icon: Home, label: "Home", exact: true },
    { path: "/student/check-mental-health", icon: Brain, label: "Check Mental Health" },
    { path: "/student/results", icon: BarChart3, label: "My Results" },
    { path: "/student/journal", icon: BookOpen, label: "Journal / Notes" },
    { path: "/student/resources", icon: BookOpen, label: "Self-Help Resources" },
    { path: "/student/appointments", icon: Calendar, label: "Appointments" },
    { path: "/student/settings", icon: Settings, label: "Settings" },
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Get user's first name for portal label
  const getPortalLabel = () => {
    const firstName = user?.firstName;
    return firstName ? `${firstName} Portal` : "Student Portal";
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out",
        "w-64 lg:w-72",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0 lg:static lg:z-auto"
      )}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-8 w-8 text-purple-600" />
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
                SWAP
              </h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* User info */}
          <div className="mt-4 p-3 bg-purple-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900">{getPortalLabel()}</p>
            <p className="text-xs text-gray-500">Student Wellness Assessment Platform</p>
            <span className="inline-block mt-1 text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800">
              Student
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive: navIsActive }) => cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200",
                    "hover:bg-purple-50 hover:text-purple-700",
                    (navIsActive || isActive(item.path, item.exact))
                      ? "bg-purple-100 text-purple-700 font-medium"
                      : "text-gray-600"
                  )}
                  onClick={() => {
                    // Close mobile menu on navigation
                    if (window.innerWidth < 1024) {
                      onToggle();
                    }
                  }}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </>
  );
};

export default StudentSidebar;
