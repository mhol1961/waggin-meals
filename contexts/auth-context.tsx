'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthClient } from '@/lib/supabase/auth-client';
import type { User } from '@supabase/supabase-js';
import type { AuthContextType, LoginCredentials, SignupCredentials, UserRole } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = getAuthClient();

  // Fetch user role from API (uses service role to bypass RLS)
  async function fetchUserRole(userId: string): Promise<UserRole | null> {
    try {
      // Get current session to send auth token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error('No session available');
        return 'customer';
      }

      // Call API endpoint with auth token
      const response = await fetch('/api/auth/get-role', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        console.error('Error fetching user role:', response.status);
        return 'customer';
      }

      const { role } = await response.json();
      return role as UserRole;
    } catch (error) {
      console.error('Error fetching user role:', error);
      return 'customer';
    }
  }

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchUserRole(session.user.id).then(setRole);
      }

      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        const userRole = await fetchUserRole(session.user.id);
        setRole(userRole);
      } else {
        setRole(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sign up new user
  async function signUp(credentials: SignupCredentials) {
    const { email, password, fullName } = credentials;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      throw error;
    }

    if (data.user) {
      // User profile and role are created automatically via database trigger
      const userRole = await fetchUserRole(data.user.id);
      setRole(userRole);
    }
  }

  // Sign in existing user
  async function signIn(credentials: LoginCredentials) {
    const { email, password } = credentials;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    if (data.user) {
      const userRole = await fetchUserRole(data.user.id);
      setRole(userRole);
    }
  }

  // Sign in with Google OAuth
  async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      throw error;
    }

    return data;
  }

  // Sign out
  async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    setUser(null);
    setRole(null);
    router.push('/');
  }

  // Request password reset
  async function resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      throw error;
    }
  }

  // Update password
  async function updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      throw error;
    }
  }

  const value: AuthContextType = {
    user,
    role,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

// Helper hooks
export function useUser() {
  const { user } = useAuth();
  return user;
}

export function useIsAuthenticated() {
  const { user } = useAuth();
  return user !== null;
}

export function useIsAdmin() {
  const { role } = useAuth();
  return role === 'admin';
}
