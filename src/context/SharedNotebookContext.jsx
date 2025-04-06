import React, { createContext, useContext, useState, useEffect } from 'react';

const SharedNotebookContext = createContext();

export const SharedNotebookProvider = ({ children }) => {
  const [notebooks, setNotebooks] = useState([]);
  const [activeNotebook, setActiveNotebook] = useState(null);

  useEffect(() => {
    // LocalStorage'dan not defterlerini yükle
    const savedNotebooks = localStorage.getItem('sharedNotebooks');
    if (savedNotebooks) {
      setNotebooks(JSON.parse(savedNotebooks));
    }
  }, []);

  useEffect(() => {
    // Not defterlerini LocalStorage'a kaydet
    localStorage.setItem('sharedNotebooks', JSON.stringify(notebooks));
  }, [notebooks]);

  const createNotebook = (title, owner) => {
    const newNotebook = {
      id: Date.now().toString(),
      title,
      content: '',
      owner,
      collaborators: [owner],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotebooks([...notebooks, newNotebook]);
    setActiveNotebook(newNotebook);
    return newNotebook;
  };

  const updateNotebook = (id, updates) => {
    setNotebooks(notebooks.map(notebook => 
      notebook.id === id 
        ? { ...notebook, ...updates, updatedAt: new Date().toISOString() }
        : notebook
    ));
  };

  const deleteNotebook = (id) => {
    setNotebooks(notebooks.filter(notebook => notebook.id !== id));
    if (activeNotebook?.id === id) {
      setActiveNotebook(null);
    }
  };

  const addCollaborator = (notebookId, email) => {
    setNotebooks(notebooks.map(notebook => {
      if (notebook.id === notebookId) {
        return {
          ...notebook,
          collaborators: [...new Set([...notebook.collaborators, email])],
          updatedAt: new Date().toISOString(),
        };
      }
      return notebook;
    }));
  };

  const removeCollaborator = (notebookId, email) => {
    setNotebooks(notebooks.map(notebook => {
      if (notebook.id === notebookId) {
        return {
          ...notebook,
          collaborators: notebook.collaborators.filter(c => c !== email),
          updatedAt: new Date().toISOString(),
        };
      }
      return notebook;
    }));
  };

  return (
    <SharedNotebookContext.Provider value={{
      notebooks,
      activeNotebook,
      setActiveNotebook,
      createNotebook,
      updateNotebook,
      deleteNotebook,
      addCollaborator,
      removeCollaborator,
    }}>
      {children}
    </SharedNotebookContext.Provider>
  );
};

export const useSharedNotebook = () => {
  const context = useContext(SharedNotebookContext);
  if (!context) {
    throw new Error('useSharedNotebook must be used within a SharedNotebookProvider');
  }
  return context;
}; 