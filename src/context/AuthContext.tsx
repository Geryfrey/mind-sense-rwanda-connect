
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";

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
  logout: () => Promise<void>;
}

// Create auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Helper function to get user profile from Supabase
  const getUserProfile = async (userId: string): Promise<User | null> => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }

      return {
        id: profile.user_id,
        name: profile.name,
        email: profile.email,
        regNumber: profile.reg_number || undefined,
        role: profile.role as UserRole,
      };
    } catch (error) {
      console.error("Error in getUserProfile:", error);
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        setSession(session);
        
        if (session?.user) {
          // Use setTimeout to prevent auth callback deadlock
          setTimeout(async () => {
            const profile = await getUserProfile(session.user.id);
            setUser(profile);
            setIsLoading(false);
          }, 0);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        getUserProfile(session.user.id).then((profile) => {
          setUser(profile);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Login function
  const login = async (identifier: string, password: string, loginType = "student"): Promise<boolean> => {
    try {
      console.log("Login attempt:", { identifier, loginType });
      
      // For student login, we need to find the email by registration number
      let email = identifier;
      
      if (loginType === "student") {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('email')
          .eq('reg_number', identifier)
          .eq('role', 'student')
          .single();
          
        if (error || !profile) {
          console.error("Student not found:", error);
          return false;
        }
        email = profile.email;
        console.log("Found student email:", email);
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error("Login error:", error);
        return false;
      }

      if (data.user) {
        const profile = await getUserProfile(data.user.id);
        if (profile && profile.role === loginType) {
          // Navigation will be handled by auth state change
          return true;
        }
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            reg_number: role === "student" ? regNumber : null,
          }
        }
      });

      if (error) {
        console.error("Registration error:", error);
        return false;
      }

      if (data.user) {
        // Navigation will be handled by auth state change
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Navigate based on user role when user state changes
  useEffect(() => {
    if (user && !isLoading) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/student");
      }
    }
  }, [user, isLoading, navigate]);

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
