import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNotes } from '../context/NoteContext';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Divider,
  Container,
} from '@mui/material';
import { ArrowBack, Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const NoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notes, deleteNote } = useNotes();
  const [note, setNote] = useState(null);

  useEffect(() => {
    const foundNote = notes.find(n => n.id === id);
    if (foundNote) {
      setNote(foundNote);
    } else {
      navigate('/homepage');
    }
  }, [id, notes, navigate]);

  const handleDelete = () => {
    if (window.confirm('Bu notu silmek istediğinizden emin misiniz?')) {
      deleteNote(id);
      navigate('/homepage');
    }
  };

  const handleEdit = () => {
    navigate(`/note-tutma/${id}`);
  };

  if (!note) {
    return null;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => navigate('/homepage')} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1">
            {note.title}
          </Typography>
          <Box sx={{ ml: 'auto' }}>
            <IconButton onClick={handleEdit} color="primary">
              <Edit />
            </IconButton>
            <IconButton onClick={handleDelete} color="error">
              <Delete />
            </IconButton>
          </Box>
        </Box>

        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {note.content}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="caption" color="text.secondary">
            Son güncelleme: {new Date(note.created_at).toLocaleString('tr-TR')}
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default NoteDetail; 