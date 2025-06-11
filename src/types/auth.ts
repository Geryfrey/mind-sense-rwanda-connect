
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

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string, loginType: UserRole) => Promise<boolean>;
  register: (identifier: string, password: string, role: UserRole, firstName?: string, lastName?: string) => Promise<boolean>;
  logout: () => Promise<void>;
}
