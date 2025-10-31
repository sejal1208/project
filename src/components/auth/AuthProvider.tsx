import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, API_BASE_URL } from '../../utils/supabase/client';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'patient' | 'doctor' | 'admin';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string, role: 'patient' | 'doctor' | 'admin') => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role: 'patient' | 'doctor' | 'admin') => Promise<void>;
  signOut: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        await loadUserProfile();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    try {
      // Check for stored user data
      const storedUser = localStorage.getItem('user_data');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          console.log('Restored user from localStorage:', userData);
          setUser(userData);
          setLoading(false);
          return;
        } catch (parseError) {
          console.error('Failed to parse stored user data:', parseError);
          localStorage.removeItem('user_data');
        }
      }

      // Check regular Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await loadUserProfile();
      }
    } catch (error) {
      console.error('Session check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async () => {
    try {
      const storedUser = localStorage.getItem('user_data');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      }
    } catch (error) {
      console.error('Load profile error:', error);
    }
  };

  const signIn = async (email: string, password: string, role: 'patient' | 'doctor' | 'admin') => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        // Map specific doctor emails to their doctor IDs
        let userId = data.user.id;
        let fullName = data.user.user_metadata?.fullName || email.split('@')[0];
        
        if (role === 'doctor') {
          if (email.toLowerCase().includes('ananda') || email === 'dr.ananda@soulcare.com') {
            userId = 'doctor_ananda_id';
            fullName = 'Dr. Ananda Sharma';
          } else if (email.toLowerCase().includes('priya') || email === 'dr.priya@soulcare.com') {
            userId = 'doctor_priya_id';
            fullName = 'Dr. Priya Meditation';
          }
        }
        
        const userData = {
          id: userId,
          email: data.user.email || email,
          fullName: fullName,
          role: role
        };
        
        setUser(userData);
        localStorage.setItem('user_data', JSON.stringify(userData));
      }
    } catch (error: any) {
      throw new Error(error.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: 'patient' | 'doctor' | 'admin') => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            fullName,
            role
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Map specific doctor emails to their doctor IDs
        let userId = data.user.id;
        let doctorFullName = fullName;
        
        if (role === 'doctor') {
          if (email.toLowerCase().includes('ananda') || email === 'dr.ananda@soulcare.com') {
            userId = 'doctor_ananda_id';
            doctorFullName = 'Dr. Ananda Sharma';
          } else if (email.toLowerCase().includes('priya') || email === 'dr.priya@soulcare.com') {
            userId = 'doctor_priya_id';
            doctorFullName = 'Dr. Priya Meditation';
          }
        }
        
        const userData = {
          id: userId,
          email: data.user.email || email,
          fullName: doctorFullName,
          role: role
        };
        
        setUser(userData);
        localStorage.setItem('user_data', JSON.stringify(userData));
      }
    } catch (error: any) {
      throw new Error(error.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };



  const signOut = async () => {
    setLoading(true);
    try {
      // Clear user data
      localStorage.removeItem('user_data');
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      setUser(null);
    } catch (error: any) {
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAccessToken = async (): Promise<string | null> => {
    try {
      // Fallback to Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        console.log('Using Supabase access token');
        return session.access_token;
      }

      // If we have a user but no token, generate a mock token for demo
      if (user) {
        const mockToken = `mock_token_${user.id}_${Date.now()}`;
        console.log('Generated new mock token for user');
        return mockToken;
      }

      console.log('No access token available');
      return null;
    } catch (error) {
      console.error('Get access token error:', error);
      return null;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    getAccessToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}