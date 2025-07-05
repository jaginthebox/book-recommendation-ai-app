import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Handle auth state changes and URL fragments
    const handleAuthStateChange = async () => {
      // Check for auth errors in URL
      const urlParams = new URLSearchParams(window.location.hash.substring(1));
      const error = urlParams.get('error');
      const errorDescription = urlParams.get('error_description');
      
      if (error) {
        console.error('Auth error from URL:', error, errorDescription);
        // Clear the error from URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Show user-friendly error message
        if (error === 'access_denied' && errorDescription?.includes('expired')) {
          alert('The email confirmation link has expired. Please request a new one by trying to sign in again.');
        }
      }
    };

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User'
        });
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User'
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
      
      // Handle specific auth events
      if (event === 'SIGNED_IN') {
        console.log('User signed in successfully');
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed');
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
      }
    });

    // Check for auth errors on component mount
    handleAuthStateChange();

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Provide more specific error messages
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid login credentials');
        }
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please check your email and click the confirmation link before signing in');
        }
        throw error;
      }

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.protocol}//${window.location.host}`,
          data: {
            name: name,
            full_name: name,
          },
        },
      });

      if (error) {
        // Provide more specific error messages
        if (error.message.includes('User already registered')) {
          throw new Error('User already registered');
        }
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please check your email and click the confirmation link to complete registration');
        }
        throw error;
      }

      if (data.user && data.session) {
        // User is immediately signed in (email confirmation disabled)
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name: name
        });
      } else if (data.user && !data.session) {
        // User created but needs email confirmation
        throw new Error('Registration successful! Please check your email and click the confirmation link to complete your account setup');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    login,
    register,
    logout
  };
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuthProvider();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};