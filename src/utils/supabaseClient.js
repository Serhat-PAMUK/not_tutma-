import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cwgjjcvkcpuofewjczgt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3Z2pqY3ZrY3B1b2Zld2pjemd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MDA0NDAsImV4cCI6MjA2MTA3NjQ0MH0.EooEHenXxWvQL-LJULgwLgi0Ivm-oZWox6GnODXxAnk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth işlemleri için yardımcı fonksiyonlar
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Veritabanı işlemleri için yardımcı fonksiyonlar
export const getNotes = async (userId) => {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', userId);
  return { data, error };
};

export const getTasks = async (userId) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId);
  return { data, error };
};

export const getEvents = async (userId) => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', userId);
  return { data, error };
};

export const getSharedNotebooks = async (userId) => {
  const { data, error } = await supabase
    .from('shared_notebooks')
    .select(`
      *,
      notebook_collaborators (
        user_id,
        role
      )
    `)
    .eq('owner_id', userId);
  return { data, error };
};

export const getNotebookContent = async (notebookId) => {
  const { data, error } = await supabase
    .from('notebook_content')
    .select('*')
    .eq('notebook_id', notebookId);
  return { data, error };
};

// CRUD işlemleri için yardımcı fonksiyonlar
export const createNote = async (note) => {
  const { data, error } = await supabase
    .from('notes')
    .insert([note])
    .select();
  return { data, error };
};

export const updateNote = async (id, updates) => {
  const { data, error } = await supabase
    .from('notes')
    .update(updates)
    .eq('id', id)
    .select();
  return { data, error };
};

export const deleteNote = async (id) => {
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id);
  return { error };
};

// Benzer CRUD işlemleri tasks, events ve shared_notebooks için de oluşturulabilir 