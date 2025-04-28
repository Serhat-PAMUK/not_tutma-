import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTasks } from '../utils/supabaseClient';
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
      const { data, error } = await getTasks(user.id);
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
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ ...task, user_id: user.id }])
        .select();
      if (error) throw error;
      setTasks([...tasks, data[0]]);
      return { data, error: null };
    } catch (error) {
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
      setTasks(tasks.map(task => task.id === id ? data[0] : task));
      return { data, error: null };
    } catch (error) {
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