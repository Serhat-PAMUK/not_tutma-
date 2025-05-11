import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import Sidebar from '../components/HomePage/Sidebar';
import MainContent from '../components/HomePage/MainContent';
import ScratchPad from '../components/HomePage/ScratchPad';
import { useNotes } from '../context/NoteContext';
import { useTheme } from '../context/ThemeContext';

const HomePage = () => {
  const { darkMode } = useTheme();
  const { notes, loading } = useNotes();

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
      }}
    >
      {/* Sol Panel - Sidebar */}
      <Sidebar />

      {/* Orta Panel - Ana İçerik */}
      <MainContent />

      {/* Sağ Panel - Scratch Pad */}
      <Box 
        sx={{ 
          width: '300px', 
          p: 2, 
          borderLeft: 1, 
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : notes && notes.length > 0 ? (
          <ScratchPad note={notes[0]} onDelete={() => {}} />
        ) : (
          <Box sx={{ textAlign: 'center', my: 4 }}>
            <Typography color="text.secondary">
              Henüz not eklenmemiş veya notlar yüklenirken bir hata oluştu.
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1, fontSize: '0.875rem' }}>
              Not eklemek için "Not Ekle" seçeneğini kullanabilirsiniz.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage; 