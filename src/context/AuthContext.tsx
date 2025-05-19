
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// User types
export type UserRole = "student" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  regNumber?: string;
  role: UserRole;
}

// Context type definition
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string, loginType?: string) => Promise<boolean>;
  register: (name: string, regNumber: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

// Mock users for demo
const mockUsers: User[] = [
  {
    id: "1",
    name: "Test Student",
    email: "220014748@example.com",
    regNumber: "220014748",
    role: "student"
  },
  {
    id: "2",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin"
  }
];

// Create auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  register: async () => false,
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Check if user is already logged in from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // Login function - now just checks against mock users
  const login = async (identifier: string, password: string, loginType = "student"): Promise<boolean> => {
    try {
      // Simple mock authentication logic
      let user;
      
      if (loginType === "student") {
        // For students, use registration number
        user = mockUsers.find(u => u.regNumber === identifier);
      } else {
        // For admins, use email
        user = mockUsers.find(u => u.email === identifier);
      }
      
      // In a real app, you would check the password
      // Here we just accept "password123" for all users
      if (user && password === "password123") {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Navigate based on role
        if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/student");
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // Register function - now just adds to local storage
  const register = async (
    name: string,
    regNumber: string, 
    email: string, 
    password: string, 
    role: UserRole
  ): Promise<boolean> => {
    try {
      // Check if user already exists
      if (role === "student") {
        const exists = mockUsers.some(u => u.regNumber === regNumber);
        if (exists) {
          console.error("Registration number already in use");
          return false;
        }
      } else {
        const exists = mockUsers.some(u => u.email === email);
        if (exists) {
          console.error("Email already in use");
          return false;
        }
      }
      
      // Create new user
      const newUser: User = {
        id: Date.now().toString(), // Simple unique ID
        name,
        email,
        regNumber: role === "student" ? regNumber : undefined,
        role
      };
      
      // Add to mock users array (in a real app, this would be saved to a database)
      mockUsers.push(newUser);
      
      // Log in the new user
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      // Navigate based on role
      if (newUser.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/student");
      }
      
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

// Route guard for protected routes
export const RequireAuth: React.FC<{
  children: React.ReactNode | (({ user }: { user: User }) => React.ReactNode);
  allowedRoles?: UserRole[];
}> = ({ children, allowedRoles = ["student", "admin"] }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate("/login");
      } else if (user && !allowedRoles.includes(user.role)) {
        navigate("/unauthorized");
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
