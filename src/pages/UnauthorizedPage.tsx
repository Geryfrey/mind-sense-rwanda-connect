
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4 p-6 max-w-md">
        <div className="mx-auto w-16 h-16 bg-red-50 flex items-center justify-center rounded-full">
          <ShieldAlert className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Unauthorized Access</h1>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page. Please contact an administrator if you believe this is an error.
        </p>
        <div className="space-y-2">
          <Button className="w-full" onClick={() => navigate("/dashboard")}>
            Return to Dashboard
          </Button>
          <Button variant="outline" className="w-full" onClick={() => navigate("/login")}>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
