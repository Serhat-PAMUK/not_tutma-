import React, { createContext, useContext, useState, useEffect } from 'react';
import { getNotes, createNote, updateNote, deleteNote } from '../utils/supabaseClient';
import { useAuth } from './AuthContext';

const NoteContext = createContext();

export const NoteProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    try {
      const { data, error } = await getNotes(user.id);
      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Notları getirme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (note) => {
    try {
      const { data, error } = await createNote({
        ...note,
        user_id: user.id
      });
      if (error) throw error;
      setNotes([...notes, data[0]]);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const editNote = async (id, updates) => {
    try {
      const { data, error } = await updateNote(id, updates);
      if (error) throw error;
      setNotes(notes.map(note => note.id === id ? data[0] : note));
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const removeNote = async (id) => {
    try {
      const { error } = await deleteNote(id);
      if (error) throw error;
      setNotes(notes.filter(note => note.id !== id));
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  return (
    <NoteContext.Provider value={{ notes, loading, addNote, editNote, removeNote }}>
      {children}
    </NoteContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error('useNotes must be used within a NoteProvider');
  }
  return context;
}; 