import React from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import ScratchPad from './ScratchPad';

const HomePage = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <MainContent />
      </Box>
      <ScratchPad />
    </Box>
  );
};

export default HomePage; 
