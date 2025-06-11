
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types/auth";

export const useAuthActions = (getUserProfile: (userId: string) => Promise<any>) => {
  const navigate = useNavigate();

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

  // Register function - prevents auto-login
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
          emailRedirectTo: `${window.location.origin}/login`,
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
        // Important: Sign out immediately after registration to prevent auto-login
        await supabase.auth.signOut();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  // Logout function
  const logout = async (setUser: (user: any) => void, setSession: (session: any) => void) => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return {
    login,
    register,
    logout
  };
};
