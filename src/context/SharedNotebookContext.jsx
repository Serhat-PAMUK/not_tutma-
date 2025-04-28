import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, getSharedNotebooks, getNotebookContent } from '../utils/supabaseClient';
import { useAuth } from './AuthContext';

const SharedNotebookContext = createContext();

export const SharedNotebookProvider = ({ children }) => {
  const [notebooks, setNotebooks] = useState([]);
  const [activeNotebook, setActiveNotebook] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchNotebooks();
    }
  }, [user]);

  const fetchNotebooks = async () => {
    try {
      const { data, error } = await getSharedNotebooks(user.id);
      if (error) throw error;
      setNotebooks(data || []);
    } catch (error) {
      console.error('Not defterlerini getirme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNotebook = async (title) => {
    try {
      // Önce not defterini oluştur
      const { data: notebookData, error: notebookError } = await supabase
        .from('shared_notebooks')
        .insert([{
          title,
          owner_id: user.id
        }])
        .select()
        .single();

      if (notebookError) throw notebookError;

      // Sonra işbirlikçi olarak kendisini ekle
      const { error: collaboratorError } = await supabase
        .from('notebook_collaborators')
        .insert([{
          notebook_id: notebookData.id,
          user_id: user.id,
          role: 'owner'
        }]);

      if (collaboratorError) throw collaboratorError;

      // Not defteri içeriğini oluştur
      const { error: contentError } = await supabase
        .from('notebook_content')
        .insert([{
          notebook_id: notebookData.id,
          user_id: user.id,
          content: ''
        }]);

      if (contentError) throw contentError;

      setNotebooks([...notebooks, notebookData]);
      return { data: notebookData, error: null };
    } catch (error) {
      console.error('Not defteri oluşturma hatası:', error);
      return { data: null, error };
    }
  };

  const updateNotebook = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('shared_notebooks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      setNotebooks(notebooks.map(notebook => notebook.id === id ? data : notebook));
      return { data, error: null };
    } catch (error) {
      console.error('Not defteri güncelleme hatası:', error);
      return { data: null, error };
    }
  };

  const deleteNotebook = async (id) => {
    try {
      // Önce işbirlikçileri sil
      const { error: collaboratorError } = await supabase
        .from('notebook_collaborators')
        .delete()
        .eq('notebook_id', id);

      if (collaboratorError) throw collaboratorError;

      // Sonra içeriği sil
      const { error: contentError } = await supabase
        .from('notebook_content')
        .delete()
        .eq('notebook_id', id);

      if (contentError) throw contentError;

      // En son not defterini sil
      const { error: notebookError } = await supabase
        .from('shared_notebooks')
        .delete()
        .eq('id', id);

      if (notebookError) throw notebookError;

      setNotebooks(notebooks.filter(notebook => notebook.id !== id));
      return { error: null };
    } catch (error) {
      console.error('Not defteri silme hatası:', error);
      return { error };
    }
  };

  const addCollaborator = async (notebookId, email) => {
    try {
      // Önce kullanıcıyı bul
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (userError) throw userError;

      // İşbirlikçi olarak ekle
      const { data, error } = await supabase
        .from('notebook_collaborators')
        .insert([{
          notebook_id: notebookId,
          user_id: userData.id,
          role: 'collaborator'
        }])
        .select();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('İşbirlikçi ekleme hatası:', error);
      return { data: null, error };
    }
  };

  const removeCollaborator = async (notebookId, userId) => {
    try {
      const { error } = await supabase
        .from('notebook_collaborators')
        .delete()
        .eq('notebook_id', notebookId)
        .eq('user_id', userId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('İşbirlikçi silme hatası:', error);
      return { error };
    }
  };

  const fetchNotebookContent = async (notebookId) => {
    try {
      const { data, error } = await getNotebookContent(notebookId);
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Not defteri içeriği getirme hatası:', error);
      return { data: null, error };
    }
  };

  return (
    <SharedNotebookContext.Provider value={{
      notebooks,
      activeNotebook,
      setActiveNotebook,
      loading,
      createNotebook,
      updateNotebook,
      deleteNotebook,
      addCollaborator,
      removeCollaborator,
      fetchNotebookContent
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