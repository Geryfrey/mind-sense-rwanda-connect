
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";

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

// Create auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  register: async () => false,
  logout: () => {},
});

// Map Supabase User to our User type
const mapSupabaseUser = async (supabaseUser: SupabaseUser): Promise<User | null> => {
  if (!supabaseUser) return null;
  
  // Fetch the user's profile from our profiles table
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', supabaseUser.id)
    .single();
  
  if (error || !profile) {
    console.error("Error fetching user profile:", error);
    return null;
  }
  
  return {
    id: supabaseUser.id,
    name: profile.name || supabaseUser.email?.split('@')[0] || 'User',
    email: supabaseUser.email || '',
    regNumber: supabaseUser.user_metadata.regNumber,
    role: profile.role as UserRole
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const initializeAuth = async () => {
      // Set up the auth state change listener first
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_OUT') {
            setUser(null);
            navigate('/login');
            return;
          }
          
          if (session?.user) {
            const mappedUser = await mapSupabaseUser(session.user);
            setUser(mappedUser);
          } else {
            setUser(null);
          }
          
          setIsLoading(false);
        }
      );

      // Then check for an existing session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const mappedUser = await mapSupabaseUser(session.user);
        setUser(mappedUser);
      }
      
      setIsLoading(false);
      
      return () => {
        authListener.subscription.unsubscribe();
      };
    };
    
    initializeAuth();
  }, [navigate]);

  // Login function
  const login = async (identifier: string, password: string, loginType = "student"): Promise<boolean> => {
    try {
      let email;
      
      // Determine login method based on account type
      if (loginType === "student") {
        // For students, we use registration number
        email = `${identifier}@example.com`; // Using the registration number as email
      } else {
        // For admins, use the email directly
        email = identifier;
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Login error:", error.message);
        return false;
      }
      
      // User login successful
      if (data.user) {
        const mappedUser = await mapSupabaseUser(data.user);
        
        if (!mappedUser) {
          return false;
        }
        
        setUser(mappedUser);
        
        // Navigate based on role
        if (mappedUser.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/student");
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Login exception:", error);
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
      // For students, we use registration number as part of the email
      // For admins, we use their actual email
      const authEmail = role === "student" ? `${regNumber}@example.com` : email;
      
      // Register the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: authEmail,
        password,
        options: {
          data: {
            name,
            regNumber: role === "student" ? regNumber : "",
            role
          }
        }
      });
      
      if (error) {
        console.error("Registration error:", error.message);
        return false;
      }
      
      if (data.user) {
        // Our trigger will automatically create the profile
        // Wait a moment for the trigger to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mappedUser = await mapSupabaseUser(data.user);
        
        if (!mappedUser) {
          return false;
        }
        
        setUser(mappedUser);
        
        // Navigate based on role
        if (mappedUser.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/student");
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Registration exception:", error);
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
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
