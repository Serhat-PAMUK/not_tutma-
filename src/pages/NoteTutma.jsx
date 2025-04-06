import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../context/NoteContext';
import {
  Box,
  Paper,
  IconButton,
  Toolbar,
  Typography,
  Button,
  Snackbar,
  Alert,
  Tooltip,
} from '@mui/material';
import { ChromePicker } from 'react-color';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatColorFill,
  FormatColorText,
  Save,
  ArrowBack,
} from '@mui/icons-material';
import Sidebar from '../components/HomePage/Sidebar';

const NoteTutma = () => {
  const navigate = useNavigate();
  const { addNote } = useNotes();
  const contentRef = useRef(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#000000');
  const [showAlert, setShowAlert] = useState(false);

  const handleFormat = (command) => {
    document.execCommand(command, false, null);
  };

  const handleBgColorChange = (color) => {
    setBgColor(color.hex);
    document.execCommand('backColor', false, color.hex);
    setShowBgColorPicker(false);
  };

  const handleTextColorChange = (color) => {
    setTextColor(color.hex);
    document.execCommand('foreColor', false, color.hex);
    setShowTextColorPicker(false);
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      setShowAlert(true);
      return;
    }

    addNote({
      id: Date.now(),
      title,
      content,
      date: new Date().toISOString(),
      bgColor,
      textColor,
    });

    navigate('/homepage');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Toolbar sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/homepage')}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Yeni Not
          </Typography>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
            sx={{
              bgcolor: '#0db548',
              '&:hover': {
                bgcolor: '#0a9e3d',
              },
            }}
          >
            Kaydet
          </Button>
        </Toolbar>

        <Box sx={{ p: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              bgcolor: bgColor,
              color: textColor,
              minHeight: 'calc(100vh - 200px)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            }}
          >
            <input
              type="text"
              placeholder="Başlık"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                fontSize: '24px',
                fontWeight: 'bold',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                color: 'inherit',
                marginBottom: '20px',
              }}
            />

            <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
              <Tooltip title="Kalın">
                <IconButton onClick={() => handleFormat('bold')}>
                  <FormatBold />
                </IconButton>
              </Tooltip>
              <Tooltip title="İtalik">
                <IconButton onClick={() => handleFormat('italic')}>
                  <FormatItalic />
                </IconButton>
              </Tooltip>
              <Tooltip title="Altı Çizili">
                <IconButton onClick={() => handleFormat('underline')}>
                  <FormatUnderlined />
                </IconButton>
              </Tooltip>
              <Tooltip title="Arkaplan Rengi">
                <IconButton onClick={() => setShowBgColorPicker(!showBgColorPicker)}>
                  <FormatColorFill />
                </IconButton>
              </Tooltip>
              <Tooltip title="Yazı Rengi">
                <IconButton onClick={() => setShowTextColorPicker(!showTextColorPicker)}>
                  <FormatColorText />
                </IconButton>
              </Tooltip>
            </Box>

            {showBgColorPicker && (
              <Box sx={{ position: 'absolute', zIndex: 2, mt: 1 }}>
                <Box
                  sx={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                  }}
                  onClick={() => setShowBgColorPicker(false)}
                />
                <ChromePicker color={bgColor} onChange={handleBgColorChange} />
              </Box>
            )}

            {showTextColorPicker && (
              <Box sx={{ position: 'absolute', zIndex: 2, mt: 1 }}>
                <Box
                  sx={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                  }}
                  onClick={() => setShowTextColorPicker(false)}
                />
                <ChromePicker color={textColor} onChange={handleTextColorChange} />
              </Box>
            )}

            <div
              ref={contentRef}
              contentEditable
              onInput={(e) => setContent(e.currentTarget.innerHTML)}
              style={{
                minHeight: 'calc(100vh - 300px)',
                outline: 'none',
                fontSize: '16px',
                lineHeight: '1.6',
              }}
            />
          </Paper>
        </Box>
      </Box>

      <Snackbar
        open={showAlert}
        autoHideDuration={3000}
        onClose={() => setShowAlert(false)}
      >
        <Alert severity="error" onClose={() => setShowAlert(false)}>
          Başlık ve içerik alanları boş bırakılamaz!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NoteTutma; 