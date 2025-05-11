import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';  // Supabase bağlantısını import ediyoruz.
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id);  // Kullanıcı ID'sine göre filtreliyoruz
      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Görevleri getirme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (task) => {
    try {
      const { title, description, dueDate, status, priority } = task;
  
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          title,
          description,
          due_date: dueDate,
          status,
          priority,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select();
  
      if (error) {
        console.error('Supabase Error:', error);  // Hata objesini tamamen yazdırıyoruz
        console.error('Error Details:', error.details);  // Hata detaylarını daha ayrıntılı görmek için
        console.error('Error Message:', error.message);  // Hata mesajını yazdırıyoruz
        return { data: null, error };
      }
  
      // Başarılı işlemde yeni görevi listeye ekle
      setTasks((prevTasks) => [...prevTasks, data[0]]);
      return { data, error: null };
  
    } catch (error) {
      console.error('Görev ekleme hatası:', error);  // Genel hata
      return { data: null, error };
    }
  };
  
  

  const updateTask = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select();
      if (error) throw error;
      setTasks(tasks.map((task) => task.id === id ? data[0] : task));
      return { data, error: null };
    } catch (error) {
      console.error('Görev güncelleme hatası:', error);
      return { data: null, error };
    }
  };

  const deleteTask = async (id) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
      if (error) throw error;
      setTasks(tasks.filter(task => task.id !== id));
      return { error: null };
    } catch (error) {
      console.error('Görev silme hatası:', error);
      return { error };
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, loading, addTask, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
