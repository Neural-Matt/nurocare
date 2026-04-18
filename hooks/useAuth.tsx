'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
const supabase = createClient();
import { Profile } from '@/types';
import { MOCK_PROFILE } from '@/lib/mock-data';

// When NEXT_PUBLIC_MOCK_AUTH=true, skip all Supabase calls and use local mock data
const IS_MOCK = process.env.NEXT_PUBLIC_MOCK_AUTH === 'true';

// Fake User object for mock mode
const MOCK_USER = {
  id: MOCK_PROFILE.id,
  email: 'demo@nurohealth.app',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: MOCK_PROFILE.created_at,
} as unknown as User;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(IS_MOCK ? MOCK_USER : null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(IS_MOCK ? MOCK_PROFILE : null);
  const [loading, setLoading] = useState(!IS_MOCK); // mock: start ready

  /** Fetch user profile from the profiles table */
  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (!error && data) setProfile(data as Profile);
  };

  const refreshProfile = async () => {
    if (IS_MOCK) return;
    if (user) await fetchProfile(user.id);
  };

  useEffect(() => {
    // Skip Supabase entirely in mock mode
    if (IS_MOCK) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    if (IS_MOCK) return { error: null };
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (data.user && !error) {
      await supabase.from('profiles').insert({ id: data.user.id, full_name: null, role: 'user' });
    }
    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    if (IS_MOCK) return { error: null };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    if (IS_MOCK) return;
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signUp, signIn, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
