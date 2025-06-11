
import { useState, useEffect } from "react";
import { Session, AuthChangeEvent } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "@/types/auth";

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
      async (event: AuthChangeEvent, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        setSession(session);
        
        if (session?.user && event !== 'SIGNED_UP') {
          // Only auto-login for events other than SIGNED_UP
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

  return {
    user,
    session,
    isLoading,
    setUser,
    setSession,
    getUserProfile
  };
};
