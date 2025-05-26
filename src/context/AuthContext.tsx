
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

// Mock users for demo - using a Map for better performance
const mockUsersMap = new Map<string, User & { password: string }>();

// Initialize with some default users
const defaultUsers = [
  {
    id: "1",
    name: "Test Student",
    email: "220014748@example.com",
    regNumber: "220014748",
    role: "student" as UserRole,
    password: "password123"
  },
  {
    id: "2",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin" as UserRole,
    password: "password123"
  }
];

// Populate the map
defaultUsers.forEach(user => {
  if (user.role === "student" && user.regNumber) {
    mockUsersMap.set(`student:${user.regNumber}`, user);
  } else {
    mockUsersMap.set(`admin:${user.email}`, user);
  }
});

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
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (identifier: string, password: string, loginType = "student"): Promise<boolean> => {
    try {
      console.log("Attempting login with:", { identifier, loginType });
      
      const key = `${loginType}:${identifier}`;
      const storedUser = mockUsersMap.get(key);
      
      if (storedUser && storedUser.password === password) {
        const { password: _, ...userWithoutPassword } = storedUser;
        setUser(userWithoutPassword);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        
        // Navigate based on role
        if (userWithoutPassword.role === "admin") {
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

  // Register function
  const register = async (
    name: string,
    regNumber: string, 
    email: string, 
    password: string, 
    role: UserRole
  ): Promise<boolean> => {
    try {
      const key = role === "student" ? `student:${regNumber}` : `admin:${email}`;
      
      // Check if user already exists
      if (mockUsersMap.has(key)) {
        console.error("User already exists");
        return false;
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        regNumber: role === "student" ? regNumber : undefined,
        role,
        password
      };
      
      // Add to mock users map
      mockUsersMap.set(key, newUser);
      
      // Log in the new user
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
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
