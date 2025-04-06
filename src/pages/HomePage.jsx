import React, { useState, useCallback, useContext } from 'react';
import { Box, useTheme } from '@mui/material';
import Sidebar from '../components/HomePage/Sidebar';
import MainContent from '../components/HomePage/MainContent';
import ScratchPad from '../components/HomePage/ScratchPad';
import { useNotes } from '../context/NoteContext';
import { ThemeContext } from '../App';

const HomePage = () => {
  const { darkMode } = useContext(ThemeContext);
  const { notes, deleteNote } = useNotes();
  const theme = useTheme();

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
      {notes.length > 0 && (
        <Box 
          sx={{ 
            width: '300px', 
            p: 2, 
            borderLeft: 1, 
            borderColor: 'divider',
            bgcolor: 'background.paper'
          }}
        >
          <ScratchPad note={notes[0]} onDelete={deleteNote} />
        </Box>
      )}
    </Box>
  );
};

export default HomePage; 