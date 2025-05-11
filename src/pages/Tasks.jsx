import React, { useState } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import TaskModal from '../components/Tasks/TaskModal';
import TaskList from '../components/Tasks/TaskList';
import Sidebar from '../components/HomePage/Sidebar';

const Tasks = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setEditingTask(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: 3,
            mb: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: 'background.paper',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          }}
        >
          <Typography 
            variant="h4" 
            component="h1"
            sx={{ 
              fontWeight: 'bold',
              color: '#0db548',
            }}
          >
            Görevler
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenModal}
            sx={{
              bgcolor: '#0db548',
              '&:hover': {
                bgcolor: '#0a9e3d',
              },
            }}
          >
            Yeni Görev
          </Button>
        </Paper>

        <TaskList onEditTask={handleEditTask} />
      </Box>

      <TaskModal
        open={isModalOpen}
        onClose={handleCloseModal}
        task={editingTask}
      />
    </Box>
  );
};

export default Tasks;
