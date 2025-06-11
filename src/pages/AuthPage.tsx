
import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { useAuth } from "@/context/AuthContext";

const AuthPage: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  
  // Determine if we're on login or register page
  const isLoginPage = location.pathname === "/login";
  
  // If already authenticated, redirect to appropriate dashboard
  if (isAuthenticated && user) {
    if (user.role === "admin") {
      return <Navigate to="/admin" />;
    } else {
      return <Navigate to="/student" />;
    }
  }
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-50 to-purple-50 p-4">
      <div className="w-full max-w-md text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Virtual Assessment & Referral Platform
        </h1>
        <p className="text-gray-600">
          Supporting mental health for Rwandan university students
        </p>
      </div>
      
      {isLoginPage ? <LoginForm /> : <RegisterForm />}
    </div>
  );
};

export default AuthPage;
