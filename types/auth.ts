import type { User } from '@supabase/supabase-js';

/**
 * User role types
 */
export type UserRole = 'customer' | 'admin';

/**
 * User with role information
 */
export interface UserWithRole extends User {
  role?: UserRole;
}

/**
 * Authentication state
 */
export interface AuthState {
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Signup credentials
 */
export interface SignupCredentials {
  email: string;
  password: string;
  fullName?: string;
}

/**
 * Password reset request
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * Password update request
 */
export interface PasswordUpdateRequest {
  password: string;
}

/**
 * User profile data
 */
export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  shipping_address: any | null;
  billing_address: any | null;
  created_at: string;
  updated_at: string;
}

/**
 * User role data from database
 */
export interface UserRoleData {
  user_id: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

/**
 * Auth context type for React
 */
export interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  signUp: (credentials: SignupCredentials) => Promise<void>;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
}
