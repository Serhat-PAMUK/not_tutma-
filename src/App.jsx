import React, { useState, useEffect, Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import { NoteProvider } from './context/NoteContext';
import { TaskProvider } from './context/TaskContext';
import { SharedNotebookProvider } from './context/SharedNotebookContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
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

// Hataları yakalamak için bir hata sınırı bileşeni
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uygulama hatası:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Bir şeyler yanlış gitti.</h2>
          <p>Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              padding: '10px 20px',
              background: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            Sayfayı Yenile
          </button>
          {process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: '20px', textAlign: 'left' }}>
              <summary>Hata Detayları</summary>
              <pre>{this.state.error && this.state.error.toString()}</pre>
              <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Sayfa yüklendiğinde loading durumunu kaldır
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return null; // veya bir loading spinner
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

// Ana uygulama içeriğini ayrı bir bileşene çıkarıyoruz
function AppContent() {
  const { darkMode } = useTheme();
  
  // MUI temasını oluşturuyoruz
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

  return (
    <MuiThemeProvider theme={theme}>
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
    </MuiThemeProvider>
  );
}

export default App;
