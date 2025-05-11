import React, { useState } from 'react';
import { Box, Paper, IconButton, Typography } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

const ScratchPad = React.memo(({ note, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        position: 'relative',
        bgcolor: note.bgColor || '#ffffff',
        color: note.textColor || '#000000',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            {note.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              whiteSpace: 'pre-wrap',
              maxHeight: '100px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {note.content}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {new Date(note.created_at).toLocaleString('tr-TR')}
          </Typography>
        </Box>
        {isHovered && (
          <IconButton
            size="small"
            onClick={() => onDelete(note.id)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'error.main',
              '&:hover': {
                bgcolor: 'error.light',
                color: 'white',
              },
            }}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
    </Paper>
  );
});

export default ScratchPad; 