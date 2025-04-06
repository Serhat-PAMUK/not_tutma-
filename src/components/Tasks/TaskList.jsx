import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Typography,
  Paper,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useTasks } from '../../context/TaskContext';

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high':
      return 'error';
    case 'medium':
      return 'warning';
    case 'low':
      return 'success';
    default:
      return 'default';
  }
};

const getPriorityLabel = (priority) => {
  switch (priority) {
    case 'high':
      return 'Yüksek';
    case 'medium':
      return 'Orta';
    case 'low':
      return 'Düşük';
    default:
      return priority;
  }
};

const TaskList = ({ onEditTask }) => {
  const { tasks, deleteTask, updateTask } = useTasks();

  const handleDelete = (taskId) => {
    deleteTask(taskId);
  };

  const handleComplete = (taskId) => {
    updateTask(taskId, { completed: true });
  };

  const formatDate = (dueDate, customDate) => {
    if (customDate) return new Date(customDate).toLocaleDateString('tr-TR');
    switch (dueDate) {
      case 'today':
        return 'Bugün';
      case 'tomorrow':
        return 'Yarın';
      case 'recurring':
        return 'Tekrarlayan';
      default:
        return dueDate;
    }
  };

  if (tasks.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          Henüz görev eklenmemiş.
        </Typography>
      </Paper>
    );
  }

  return (
    <List>
      {tasks.map((task) => (
        <ListItem
          key={task.id}
          sx={{
            mb: 1,
            bgcolor: 'background.paper',
            borderRadius: 1,
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    textDecoration: task.completed ? 'line-through' : 'none',
                    color: task.completed ? 'text.secondary' : 'text.primary',
                  }}
                >
                  {task.name}
                </Typography>
                <Chip
                  label={getPriorityLabel(task.priority)}
                  color={getPriorityColor(task.priority)}
                  size="small"
                />
              </Box>
            }
            secondary={
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {task.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Bitiş: {formatDate(task.dueDate, task.customDate)}
                  </Typography>
                  {task.assignedTo && (
                    <Typography variant="caption" color="text.secondary">
                      • Atanan: {task.assignedTo}
                    </Typography>
                  )}
                </Box>
              </Box>
            }
          />
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              onClick={() => handleComplete(task.id)}
              sx={{ mr: 1 }}
            >
              <CheckCircleIcon
                color={task.completed ? 'success' : 'action'}
              />
            </IconButton>
            <IconButton
              edge="end"
              onClick={() => onEditTask(task)}
              sx={{ mr: 1 }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              edge="end"
              onClick={() => handleDelete(task.id)}
              sx={{ color: 'error.main' }}
            >
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

export default TaskList; 