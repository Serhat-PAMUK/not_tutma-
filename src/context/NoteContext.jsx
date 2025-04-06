import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const NoteContext = createContext(null);

export const NoteProvider = ({ children }) => {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Notları localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  // Not ekleme
  const addNote = useCallback((note) => {
    setNotes(prevNotes => [{
      ...note,
      id: Date.now(),
      date: new Date().toISOString(),
    }, ...prevNotes]);
  }, []);

  // Not silme
  const deleteNote = useCallback((noteId) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
  }, []);

  // Not güncelleme
  const updateNote = useCallback((noteId, updatedContent) => {
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === noteId
          ? { ...note, ...updatedContent, lastModified: new Date().toISOString() }
          : note
      )
    );
  }, []);

  // Sidebar durumunu değiştirme
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  return (
    <NoteContext.Provider
      value={{
        notes,
        isSidebarOpen,
        addNote,
        deleteNote,
        updateNote,
        toggleSidebar,
      }}
    >
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