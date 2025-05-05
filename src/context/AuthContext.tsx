
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
  login: (regNumber: string, password: string) => Promise<boolean>;
  register: (name: string, regNumber: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

// Create auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  register: async () => false,
  logout: () => {},
});

// Mock users database for demo purposes
const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    regNumber: "ADMIN001",
    role: "admin",
  },
  {
    id: "2", 
    name: "Student User",
    email: "student@example.com",
    regNumber: "R302/1234/2023",
    role: "student",
  },
];

// Mock credentials database for demo purposes
const mockCredentials: Record<string, { password: string; userId: string }> = {
  "ADMIN001": { password: "admin123", userId: "1" },
  "R302/1234/2023": { password: "student123", userId: "2" },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("varp_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (regNumber: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const credentials = mockCredentials[regNumber];
        
        if (credentials && credentials.password === password) {
          const foundUser = mockUsers.find(u => u.id === credentials.userId);
          if (foundUser) {
            setUser(foundUser);
            localStorage.setItem("varp_user", JSON.stringify(foundUser));
            
            // Navigate based on role
            if (foundUser.role === "admin") {
              navigate("/admin");
            } else {
              navigate("/student");
            }
            
            resolve(true);
            return;
          }
        }
        resolve(false);
      }, 800); // Simulate network delay
    });
  };

  // Register function
  const register = async (
    name: string,
    regNumber: string,
    email: string, 
    password: string, 
    role: UserRole
  ): Promise<boolean> => {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Check if regNumber is taken
        if (mockCredentials[regNumber]) {
          resolve(false);
          return;
        }

        // Generate new user ID
        const newId = `${mockUsers.length + 1}`;
        
        // Create new user
        const newUser: User = {
          id: newId,
          name,
          email,
          regNumber,
          role,
        };

        // Add user to mock database
        mockUsers.push(newUser);
        mockCredentials[regNumber] = { password, userId: newId };

        // Set current user and save to localStorage
        setUser(newUser);
        localStorage.setItem("varp_user", JSON.stringify(newUser));
        
        // Navigate based on role
        if (role === "admin") {
          navigate("/admin");
        } else {
          navigate("/student");
        }
        
        resolve(true);
      }, 800); // Simulate network delay
    });
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("varp_user");
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
