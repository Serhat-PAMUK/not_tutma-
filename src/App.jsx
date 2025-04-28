import React, { createContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import { NoteProvider } from './context/NoteContext';
import { TaskProvider } from './context/TaskContext';
import { SharedNotebookProvider } from './context/SharedNotebookContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import HomePage from './pages/HomePage';
import NoteTutma from './pages/NoteTutma';
import Tasks from './pages/Tasks';
import SharedNotebookPage from './pages/SharedNotebookPage';
import EventsPage from './pages/EventsPage';
import ProtectedRoute from './components/ProtectedRoute';
import NoteDetail from './pages/NoteDetail';
import './index.css';

export const ThemeContext = createContext();

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Sayfa yüklendiğinde loading durumunu kaldır
    setIsLoading(false);
  }, []);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  });

  if (isLoading) {
    return null; // veya bir loading spinner
  }

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <NoteProvider>
            <TaskProvider>
              <SharedNotebookProvider>
                <Router>
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route
                      path="/homepage"
                      element={
                        <ProtectedRoute>
                          <HomePage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/note-tutma"
                      element={
                        <ProtectedRoute>
                          <NoteTutma />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/tasks"
                      element={
                        <ProtectedRoute>
                          <Tasks />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/shared-notebook/:id"
                      element={
                        <ProtectedRoute>
                          <SharedNotebookPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/events"
                      element={
                        <ProtectedRoute>
                          <EventsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/note/:id" element={<NoteDetail />} />
                    <Route path="/" element={<Navigate to="/login" replace />} />
                  </Routes>
                </Router>
              </SharedNotebookProvider>
            </TaskProvider>
          </NoteProvider>
        </AuthProvider>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;
