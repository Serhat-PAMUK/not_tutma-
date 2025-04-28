import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, signIn, signUp, signOut, getCurrentUser } from '../utils/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Mevcut oturumu kontrol et
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Oturum kontrolü hatası:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Auth state değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state değişti:', event, session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const { data, error } = await signIn(email, password);
      if (error) throw error;
      
      // Oturum bilgilerini kontrol et
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      
      setSession(session);
      setUser(session?.user ?? null);
      
      return { data, error: null };
    } catch (error) {
      console.error('Giriş hatası:', error);
      return { data: null, error };
    }
  };

  const register = async (email, password) => {
    try {
      const { data, error } = await signUp(email, password);
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Kayıt hatası:', error);
      return { data: null, error };
    }
  };

  const logout = async () => {
    try {
      const { error } = await signOut();
      if (error) throw error;
      setSession(null);
      setUser(null);
    } catch (error) {
      console.error('Çıkış hatası:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!session
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 