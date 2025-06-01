
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";

// User types
export type UserRole = "student" | "admin";

export interface User {
  id: string;
  regNumber?: string;
  email?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
}

// Context type definition
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string, loginType: UserRole) => Promise<boolean>;
  register: (identifier: string, password: string, role: UserRole, firstName?: string, lastName?: string) => Promise<boolean>;
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
        .select('user_id, reg_number, email, role, first_name, last_name')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }

      const displayName = profile.first_name && profile.last_name 
        ? `${profile.first_name} ${profile.last_name}`
        : profile.reg_number || profile.email || "User";

      return {
        id: profile.user_id,
        regNumber: profile.reg_number || undefined,
        email: profile.email || undefined,
        name: displayName,
        firstName: profile.first_name || undefined,
        lastName: profile.last_name || undefined,
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
  const login = async (identifier: string, password: string, loginType: UserRole): Promise<boolean> => {
    try {
      console.log("Login attempt:", { identifier, loginType });
      
      let email = identifier;
      
      // For student login, convert reg number to email format
      if (loginType === "student") {
        // Validate registration number (9 digits starting with '2')
        if (!/^2\d{8}$/.test(identifier)) {
          console.error("Invalid registration number format");
          return false;
        }
        email = `${identifier}@ur.ac.rw`;
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
    identifier: string,
    password: string, 
    role: UserRole,
    firstName?: string,
    lastName?: string
  ): Promise<boolean> => {
    try {
      let email = identifier;
      let regNumber: string | undefined;
      
      // For student signup, convert reg number to email format
      if (role === "student") {
        // Validate registration number (9 digits starting with '2')
        if (!/^2\d{8}$/.test(identifier)) {
          console.error("Invalid registration number format");
          return false;
        }
        email = `${identifier}@ur.ac.rw`;
        regNumber = identifier;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            reg_number: regNumber,
            first_name: firstName,
            last_name: lastName,
          }
        }
      });

      if (error) {
        console.error("Registration error:", error);
        return false;
      }

      if (data.user) {
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
      navigate("/");
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
