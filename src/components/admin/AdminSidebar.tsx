
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Users, 
  FileText, 
  BarChart3, 
  Download,
  Brain,
  Settings,
  LogOut,
  X,
  HeartHandshake
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();

  const menuItems = [
    { path: "/admin", icon: Home, label: "Dashboard", exact: true },
    { path: "/admin/students", icon: Users, label: "Manage Students" },
    { path: "/admin/predictions", icon: FileText, label: "Predictions Log" },
    { path: "/admin/analytics", icon: BarChart3, label: "Analytics" },
    { path: "/admin/reports", icon: Download, label: "Export Reports" },
    { path: "/admin/model-feedback", icon: Brain, label: "Model Feedback" },
    { path: "/admin/settings", icon: Settings, label: "Settings" },
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    window.location.href = "/";
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
              <HeartHandshake className="h-8 w-8 text-indigo-600" />
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
                SWAP Admin
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
          <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900">Admin Portal</p>
            <p className="text-xs text-gray-500">System Administrator</p>
            <span className="inline-block mt-1 text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-800">
              Administrator
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
                    "hover:bg-indigo-50 hover:text-indigo-700",
                    (navIsActive || isActive(item.path, item.exact))
                      ? "bg-indigo-100 text-indigo-700 font-medium"
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
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            <span>Back to Home</span>
          </Button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
