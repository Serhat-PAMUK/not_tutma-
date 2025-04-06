import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useTasks } from '../../context/TaskContext';

const TaskModal = ({ open, onClose }) => {
  const { addTask } = useTasks();
  const [task, setTask] = useState({
    name: '',
    description: '',
    dueDate: 'today',
    customDate: '',
    reminder: '1hour',
    customReminder: '',
    assignedTo: '',
    priority: 'medium',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask(task);
    onClose();
    setTask({
      name: '',
      description: '',
      dueDate: 'today',
      customDate: '',
      reminder: '1hour',
      customReminder: '',
      assignedTo: '',
      priority: 'medium',
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        <Typography variant="h6">Yeni Görev Oluştur</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Görev Adı"
              name="name"
              value={task.name}
              onChange={handleChange}
              required
              fullWidth
            />

            <TextField
              label="Açıklama"
              name="description"
              value={task.description}
              onChange={handleChange}
              multiline
              rows={3}
              placeholder="Bu görev hakkında detaylı bilgi..."
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Bitiş Tarihi</InputLabel>
              <Select
                name="dueDate"
                value={task.dueDate}
                onChange={handleChange}
                label="Bitiş Tarihi"
              >
                <MenuItem value="today">Bugün</MenuItem>
                <MenuItem value="tomorrow">Yarın</MenuItem>
                <MenuItem value="custom">Özel Tarih</MenuItem>
                <MenuItem value="recurring">Tekrarlayan</MenuItem>
              </Select>
            </FormControl>

            {task.dueDate === 'custom' && (
              <TextField
                type="date"
                name="customDate"
                value={task.customDate}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            )}

            <FormControl fullWidth>
              <InputLabel>Hatırlatıcı</InputLabel>
              <Select
                name="reminder"
                value={task.reminder}
                onChange={handleChange}
                label="Hatırlatıcı"
              >
                <MenuItem value="1hour">1 Saat Sonra</MenuItem>
                <MenuItem value="4hours">4 Saat Sonra</MenuItem>
                <MenuItem value="custom">Özel Zaman</MenuItem>
              </Select>
            </FormControl>

            {task.reminder === 'custom' && (
              <TextField
                type="time"
                name="customReminder"
                value={task.customReminder}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            )}

            <TextField
              label="Atanan Kişi"
              name="assignedTo"
              value={task.assignedTo}
              onChange={handleChange}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Öncelik</InputLabel>
              <Select
                name="priority"
                value={task.priority}
                onChange={handleChange}
                label="Öncelik"
              >
                <MenuItem value="low">Düşük</MenuItem>
                <MenuItem value="medium">Orta</MenuItem>
                <MenuItem value="high">Yüksek</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={onClose}>İptal</Button>
          <Button 
            variant="contained" 
            type="submit"
            disabled={!task.name}
          >
            Kaydet
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskModal; 