import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Chip,
  Divider,
} from '@mui/material';
import {
  Event as EventIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openDialog, setOpenDialog] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: new Date(),
  });

  // LocalStorage'dan etkinlikleri yükle
  useEffect(() => {
    const savedEvents = localStorage.getItem('events');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  // Etkinlikleri LocalStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const handleAddEvent = () => {
    if (newEvent.title.trim()) {
      setEvents([
        ...events,
        {
          ...newEvent,
          id: Date.now(),
        },
      ]);
      setOpenDialog(false);
      setNewEvent({
        title: '',
        description: '',
        date: new Date(),
      });
    }
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter((event) => event.id !== eventId));
  };

  // Yaklaşan etkinlikleri sırala
  const upcomingEvents = [...events]
    .filter((event) => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  // Seçili tarihteki etkinlikleri filtrele
  const selectedDateEvents = events.filter(
    (event) =>
      new Date(event.date).toDateString() === selectedDate.toDateString()
  );

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Takvim */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CalendarIcon sx={{ mr: 1, color: '#1976d2' }} />
              <Typography variant="h6">Takvim</Typography>
            </Box>
            
            <TextField
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              fullWidth
              sx={{ 
                mb: 2,
                '& input': {
                  fontSize: '1.1rem',
                  padding: '12px',
                },
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#1976d2',
                  },
                },
              }}
            />

            {/* Seçili Tarihteki Etkinlikler */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {selectedDate.toLocaleDateString('tr-TR')} Tarihli Etkinlikler
              </Typography>
              <List>
                {selectedDateEvents.map((event) => (
                  <ListItem
                    key={event.id}
                    sx={{
                      mb: 1,
                      borderRadius: 1,
                      backgroundColor: '#f5f5f5',
                    }}
                  >
                    <ListItemText
                      primary={event.title}
                      secondary={event.description}
                    />
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => handleDeleteEvent(event.id)}
                      sx={{ color: '#d32f2f' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </Box>

            {/* Yeni Etkinlik Ekleme Butonu */}
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              fullWidth
              onClick={() => setOpenDialog(true)}
              sx={{ mt: 2 }}
            >
              Yeni Etkinlik Ekle
            </Button>
          </Paper>
        </Grid>

        {/* Yaklaşan Etkinlikler */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EventIcon sx={{ mr: 1, color: '#1976d2' }} />
              <Typography variant="h6">Yaklaşan Etkinlikler</Typography>
            </Box>
            <List>
              {upcomingEvents.map((event) => (
                <ListItem
                  key={event.id}
                  sx={{
                    mb: 1,
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                >
                  <ListItemIcon>
                    <CalendarIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={event.title}
                    secondary={new Date(event.date).toLocaleDateString('tr-TR')}
                  />
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => handleDeleteEvent(event.id)}
                    sx={{ color: '#d32f2f' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Yeni Etkinlik Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Yeni Etkinlik Ekle</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Etkinlik Başlığı"
            fullWidth
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Açıklama"
            fullWidth
            multiline
            rows={3}
            value={newEvent.description}
            onChange={(e) =>
              setNewEvent({ ...newEvent, description: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Tarih"
            type="datetime-local"
            fullWidth
            value={new Date(newEvent.date).toISOString().slice(0, 16)}
            onChange={(e) => setNewEvent({ ...newEvent, date: new Date(e.target.value) })}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>İptal</Button>
          <Button onClick={handleAddEvent} variant="contained">
            Ekle
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EventsPage; 