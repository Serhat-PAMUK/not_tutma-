import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../../context/NoteContext';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  InputBase,
  Alert,
  Snackbar,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  Image as ImageIcon,
  Description as DocumentIcon,
  Link as LinkIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

const MainContent = () => {
  const navigate = useNavigate();
  const { notes, deleteNote } = useNotes();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  // Notları tarihe göre sırala ve arama filtresini uygula
  const filteredNotes = useMemo(() => {
    return notes
      .filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [notes, searchQuery]);

  // Not silme işleyicisi
  const handleDelete = useCallback((id) => {
    deleteNote(id);
    setShowAlert(true);
  }, [deleteNote]);

  // Örnek web klipleri ve dosyalar
  const recentFiles = [
    {
      id: 1,
      title: 'Tasarım Görseli',
      type: 'image',
      thumbnail: 'https://via.placeholder.com/150',
    },
    {
      id: 2,
      title: 'Proje Dokümanı',
      type: 'document',
    },
    {
      id: 3,
      title: 'Referans Link',
      type: 'link',
    },
  ];

  return (
    <Box
      sx={{
        flexGrow: 1,
        ml: '250px', // Sidebar genişliği kadar margin
        p: 3,
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      {/* Arama Çubuğu */}
      <Paper
        component="form"
        elevation={0}
        sx={{
          p: '2px 16px',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          mb: 4,
          borderRadius: 2,
          bgcolor: 'background.paper',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Notlarınızda arayın..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          inputProps={{ 'aria-label': 'search notes' }}
        />
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>

      {/* Son Notlar Bölümü */}
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 3, 
            fontWeight: 'bold',
            color: '#0db548',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          Son Notlar
        </Typography>
        
        {filteredNotes.length === 0 ? (
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              textAlign: 'center', 
              mt: 4,
              p: 4,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            }}
          >
            Henüz not eklenmemiş veya arama kriterine uygun not bulunamadı.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {filteredNotes.map((note) => (
              <Grid item xs={12} sm={6} md={4} key={note.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                      cursor: 'pointer',
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" gutterBottom sx={{ wordBreak: 'break-word' }}>
                        {note.title}
                      </Typography>
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/note/${note.id}`)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(note.id)}
                          sx={{ ml: 1, '&:hover': { color: 'error.main' } }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {note.content}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(note.created_at).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Son Yakalanan Dosyalar */}
      <Box>
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 3, 
            fontWeight: 'bold',
            color: '#0db548',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          Son Yakalanan
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            overflowX: 'auto',
            pb: 2,
            '&::-webkit-scrollbar': {
              height: 6,
            },
            '&::-webkit-scrollbar-track': {
              bgcolor: 'background.paper',
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: 'primary.main',
              borderRadius: 3,
            },
          }}
        >
          {recentFiles.map((file) => (
            <Paper
              key={file.id}
              elevation={0}
              sx={{
                minWidth: 200,
                maxWidth: 200,
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
                transition: 'transform 0.2s',
                bgcolor: 'background.paper',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              {file.type === 'image' && (
                <CardMedia
                  component="img"
                  height="100"
                  image={file.thumbnail}
                  alt={file.title}
                  sx={{ borderRadius: 1, objectFit: 'cover' }}
                />
              )}
              {file.type === 'document' && (
                <DocumentIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              )}
              {file.type === 'link' && (
                <LinkIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              )}
              <Typography variant="body2" align="center">
                {file.title}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>

      <Snackbar
        open={showAlert}
        autoHideDuration={3000}
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setShowAlert(false)} severity="success">
          Not başarıyla silindi
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default React.memo(MainContent); 