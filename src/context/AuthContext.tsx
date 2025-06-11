
import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContextType } from "@/types/auth";
import { useAuthState } from "@/hooks/useAuthState";
import { useAuthActions } from "@/hooks/useAuthActions";

// Create auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { user, session, isLoading, setUser, setSession, getUserProfile } = useAuthState();
  const { login, register, logout: logoutAction } = useAuthActions(getUserProfile);

  // Wrap logout to pass state setters
  const logout = async () => {
    await logoutAction(setUser, setSession);
  };

  // Navigate based on user role when user state changes
  useEffect(() => {
    if (user && !isLoading && session) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/student");
      }
    }
  }, [user, isLoading, session, navigate]);

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

export default AuthProvider;
