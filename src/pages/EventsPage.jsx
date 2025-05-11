import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
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
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Event as EventIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { supabase } from '../utils/supabaseClient';

const EventsPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openDialog, setOpenDialog] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startDate: new Date().toISOString().slice(0, 16),
    endDate: new Date().toISOString().slice(0, 16),
    location: '',
  });
  const [error, setError] = useState(null);

  // Etkinlikleri al
  useEffect(() => {
    const fetchEvents = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('user_id', user.id)
          .order('start_date', { ascending: true });

        if (error) {
          console.error('Etkinlikleri alırken hata:', error);
          setError('Etkinlikler yüklenirken bir hata oluştu');
        } else {
          setEvents(data);
        }
      }
    };
    fetchEvents();
  }, [user]);

  // Etkinlik ekleme işlemi
  const handleAddEvent = async () => {
    if (!user) {
      setError('Kullanıcı oturumu bulunamadı');
      return;
    }
  
    if (
      !newEvent.title.trim() ||
      !newEvent.description.trim() ||
      !newEvent.location.trim()
    ) {
      setError('Lütfen tüm alanları doldurun');
      return;
    }
  
    try {
      // Tarih kontrolü
      const startDate = new Date(newEvent.startDate);
      const endDate = new Date(newEvent.endDate);
  
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        setError('Geçersiz tarih formatı');
        return;
      }
  
      if (endDate < startDate) {
        setError('Bitiş tarihi başlangıç tarihinden önce olamaz');
        return;
      }
  
      const { data, error } = await supabase
        .from('events')
        .insert([
          {
            user_id: user.id,
            title: newEvent.title.trim(),
            description: newEvent.description.trim(),
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            location: newEvent.location.trim(),
          },
        ])
        .select(); // inserted veriyi döndürmek için bu şart
  
      if (error) {
        console.error('Etkinlik eklenirken hata oluştu:', error);
        setError('Etkinlik eklenirken bir hata oluştu: ' + error.message);
      } else if (data && data.length > 0) {
        console.log('Etkinlik başarıyla eklendi:', data[0]);
        setEvents([...events, data[0]]);
        setOpenDialog(false);
        setNewEvent({
          title: '',
          description: '',
          startDate: new Date().toISOString().slice(0, 16),
          endDate: new Date().toISOString().slice(0, 16),
          location: '',
        });
      } else {
        console.warn('Etkinlik başarıyla eklendi ama dönen veri yok.');
      }
    } catch (error) {
      console.error('Veritabanına bağlanırken bir hata oluştu:', error);
      setError('Veritabanına bağlanırken bir hata oluştu');
    }
  };
  
  // Etkinlik silme işlemi
  const handleDeleteEvent = async (eventId) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) {
        console.error('Etkinlik silerken hata:', error);
        setError('Etkinlik silinirken bir hata oluştu');
      } else {
        setEvents(events.filter((event) => event.id !== eventId));
      }
    } catch (error) {
      console.error('Etkinlik silme hatası:', error);
      setError('Etkinlik silinirken bir hata oluştu');
    }
  };

  // Seçili tarihteki etkinlikleri filtrele
  const selectedDateEvents = events.filter(
    (event) => new Date(event.start_date).toDateString() === selectedDate.toDateString()
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
              sx={{ mb: 2 }}
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
              {events
                .filter((event) => new Date(event.start_date) >= new Date())
                .map((event) => (
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
                      secondary={new Date(event.start_date).toLocaleDateString('tr-TR')}
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
            label="Başlangıç Tarihi"
            type="datetime-local"
            fullWidth
            value={newEvent.startDate}
            onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            label="Bitiş Tarihi"
            type="datetime-local"
            fullWidth
            value={newEvent.endDate}
            onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            label="Konum"
            fullWidth
            value={newEvent.location}
            onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>İptal</Button>
          <Button onClick={handleAddEvent} variant="contained">
            Ekle
          </Button>
        </DialogActions>
      </Dialog>

      {/* Hata Mesajı */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EventsPage;
