
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { UserRole, User } from "@/types/auth";

interface RequireAuthProps {
  children: React.ReactNode | (({ user }: { user: User }) => React.ReactNode);
  allowedRoles?: UserRole[];
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ 
  children, 
  allowedRoles = ["student", "admin"] 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate("/login");
      } else if (user && !allowedRoles.includes(user.role)) {
        navigate("/");
      }
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, navigate]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (user && !allowedRoles.includes(user.role)) {
    return null;
  }

  if (typeof children === "function" && user) {
    return <>{children({ user })}</>;
  }

  return <>{children}</>;
};
