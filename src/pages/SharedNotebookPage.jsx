import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  Fade,
  ToggleButton,
  ToggleButtonGroup,
  Select,
  FormControl,
  InputLabel,
  MenuItem as MuiMenuItem,
  useTheme,
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Share as ShareIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  PersonAdd as PersonAddIcon,
  Group as GroupIcon,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatColorText,
  FormatColorFill,
  FormatSize,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useSharedNotebook } from '../context/SharedNotebookContext';

const fontFamilies = [
  { label: 'Arial', value: 'Arial' },
  { label: 'Times New Roman', value: 'Times New Roman' },
  { label: 'Helvetica', value: 'Helvetica' },
  { label: 'Verdana', value: 'Verdana' },
  { label: 'Georgia', value: 'Georgia' },
];

const fontSizes = [
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: '10', value: '10' },
  { label: '11', value: '11' },
  { label: '12', value: '12' },
  { label: '14', value: '14' },
  { label: '16', value: '16' },
  { label: '18', value: '18' },
  { label: '20', value: '20' },
  { label: '24', value: '24' },
  { label: '30', value: '30' },
  { label: '36', value: '36' },
  { label: '48', value: '48' },
  { label: '60', value: '60' },
  { label: '72', value: '72' },
];

const colors = [
  { label: 'Siyah', value: '#000000' },
  { label: 'Kırmızı', value: '#FF0000' },
  { label: 'Yeşil', value: '#00FF00' },
  { label: 'Mavi', value: '#0000FF' },
  { label: 'Sarı', value: '#FFFF00' },
  { label: 'Mor', value: '#800080' },
  { label: 'Turkuaz', value: '#00FFFF' },
  { label: 'Pembe', value: '#FFC0CB' },
];

const SharedNotebookPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  const {
    notebooks,
    activeNotebook,
    setActiveNotebook,
    createNotebook,
    updateNotebook,
    deleteNotebook,
    addCollaborator,
    removeCollaborator,
  } = useSharedNotebook();

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [shareUrl, setShareUrl] = useState('');
  const [newNotebookDialog, setNewNotebookDialog] = useState(false);
  const [newNotebookTitle, setNewNotebookTitle] = useState('');
  const [inviteDialog, setInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [formatting, setFormatting] = useState({
    bold: false,
    italic: false,
    underline: false,
    textColor: '#000000',
    backgroundColor: '#FFFFFF',
    fontSize: '14',
    fontFamily: 'Arial',
    alignment: 'left',
  });

  useEffect(() => {
    if (id === 'new') {
      setNewNotebookDialog(true);
    } else if (id) {
      const notebook = notebooks.find(n => n.id === id);
      if (notebook) {
        setActiveNotebook(notebook);
        setShareUrl(`${window.location.origin}/shared-notebook/${notebook.id}`);
      } else {
        navigate('/shared-notebook/new');
      }
    }
  }, [id, notebooks, setActiveNotebook, navigate]);

  const handleCreateNotebook = () => {
    if (newNotebookTitle.trim()) {
      const notebook = createNotebook(newNotebookTitle, user.email);
      setNewNotebookDialog(false);
      setNewNotebookTitle('');
      navigate(`/shared-notebook/${notebook.id}`);
    }
  };

  const handleSave = async () => {
    if (!activeNotebook) return;
    setLoading(true);
    try {
      updateNotebook(activeNotebook.id, {
        title: activeNotebook.title,
        content: activeNotebook.content,
      });
      setSnackbar({
        open: true,
        message: 'Not defteri başarıyla kaydedildi',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Kaydetme sırasında bir hata oluştu',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setSnackbar({
      open: true,
      message: 'Paylaşım linki kopyalandı',
      severity: 'success',
    });
  };

  const handleInvite = () => {
    if (inviteEmail.trim() && activeNotebook) {
      addCollaborator(activeNotebook.id, inviteEmail);
      setInviteDialog(false);
      setInviteEmail('');
      setSnackbar({
        open: true,
        message: 'Davet gönderildi',
        severity: 'success',
      });
    }
  };

  const handleRemoveCollaborator = (email) => {
    if (activeNotebook) {
      removeCollaborator(activeNotebook.id, email);
      setSnackbar({
        open: true,
        message: 'İşbirlikçi kaldırıldı',
        severity: 'success',
      });
    }
  };

  const handleDeleteNotebook = () => {
    if (activeNotebook) {
      deleteNotebook(activeNotebook.id);
      navigate('/shared-notebook/new');
    }
  };

  const handleFormatChange = (format, value) => {
    setFormatting(prev => ({
      ...prev,
      [format]: value
    }));
  };

  const getTextStyle = () => ({
    fontWeight: formatting.bold ? 'bold' : 'normal',
    fontStyle: formatting.italic ? 'italic' : 'normal',
    textDecoration: formatting.underline ? 'underline' : 'none',
    color: formatting.textColor,
    backgroundColor: formatting.backgroundColor,
    fontSize: `${formatting.fontSize}px`,
    fontFamily: formatting.fontFamily,
    textAlign: formatting.alignment,
  });

  if (!activeNotebook && id !== 'new') {
    return null;
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar 
        position="static" 
        sx={{ 
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {activeNotebook?.title || 'Yeni Not Defteri'}
          </Typography>
          <Tooltip title="Paylaşım Linkini Kopyala">
            <IconButton onClick={handleCopyLink} color="primary">
              <CopyIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="İşbirlikçi Davet Et">
            <IconButton onClick={() => setInviteDialog(true)} color="primary">
              <PersonAddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Kaydet">
            <IconButton onClick={handleSave} color="primary" disabled={loading}>
              <SaveIcon />
            </IconButton>
          </Tooltip>
          <IconButton
            onClick={(e) => setAnchorEl(e.currentTarget)}
            color="primary"
          >
            <MoreVertIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Metin Biçimlendirme Araç Çubuğu */}
      <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          <ToggleButtonGroup
            size="small"
            value={formatting.bold}
            onChange={() => handleFormatChange('bold', !formatting.bold)}
            sx={{
              '& .MuiToggleButton-root': {
                borderRadius: '4px !important',
                border: `1px solid ${theme.palette.divider}`,
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                },
              },
            }}
          >
            <ToggleButton value={true}>
              <FormatBold />
            </ToggleButton>
          </ToggleButtonGroup>

          <ToggleButtonGroup
            size="small"
            value={formatting.italic}
            onChange={() => handleFormatChange('italic', !formatting.italic)}
            sx={{
              '& .MuiToggleButton-root': {
                borderRadius: '4px !important',
                border: `1px solid ${theme.palette.divider}`,
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                },
              },
            }}
          >
            <ToggleButton value={true}>
              <FormatItalic />
            </ToggleButton>
          </ToggleButtonGroup>

          <ToggleButtonGroup
            size="small"
            value={formatting.underline}
            onChange={() => handleFormatChange('underline', !formatting.underline)}
            sx={{
              '& .MuiToggleButton-root': {
                borderRadius: '4px !important',
                border: `1px solid ${theme.palette.divider}`,
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                },
              },
            }}
          >
            <ToggleButton value={true}>
              <FormatUnderlined />
            </ToggleButton>
          </ToggleButtonGroup>

          <Divider orientation="vertical" flexItem />

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Yazı Tipi</InputLabel>
            <Select
              value={formatting.fontFamily}
              label="Yazı Tipi"
              onChange={(e) => handleFormatChange('fontFamily', e.target.value)}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.divider,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              {fontFamilies.map((font) => (
                <MuiMenuItem key={font.value} value={font.value} sx={{ fontFamily: font.value }}>
                  {font.label}
                </MuiMenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Boyut</InputLabel>
            <Select
              value={formatting.fontSize}
              label="Boyut"
              onChange={(e) => handleFormatChange('fontSize', e.target.value)}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.divider,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              {fontSizes.map((size) => (
                <MuiMenuItem key={size.value} value={size.value}>
                  {size.label}
                </MuiMenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Renk</InputLabel>
            <Select
              value={formatting.textColor}
              label="Renk"
              onChange={(e) => handleFormatChange('textColor', e.target.value)}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.divider,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              {colors.map((color) => (
                <MuiMenuItem key={color.value} value={color.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        backgroundColor: color.value,
                        borderRadius: '4px',
                        border: `1px solid ${theme.palette.divider}`,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      }}
                    />
                    {color.label}
                  </Box>
                </MuiMenuItem>
              ))}
            </Select>
          </FormControl>

          <Divider orientation="vertical" flexItem />

          <ToggleButtonGroup
            size="small"
            value={formatting.alignment}
            onChange={(e) => handleFormatChange('alignment', e.target.value)}
            sx={{
              '& .MuiToggleButton-root': {
                borderRadius: '4px !important',
                border: `1px solid ${theme.palette.divider}`,
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                },
              },
            }}
          >
            <ToggleButton value="left">
              <FormatAlignLeft />
            </ToggleButton>
            <ToggleButton value="center">
              <FormatAlignCenter />
            </ToggleButton>
            <ToggleButton value="right">
              <FormatAlignRight />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sol Panel - Not Defteri Listesi */}
        <Paper 
          sx={{ 
            width: 250, 
            borderRight: 1, 
            borderColor: 'divider',
            bgcolor: 'background.paper',
            color: 'text.primary'
          }}
        >
          <List>
            {notebooks.map((notebook) => (
              <ListItem
                key={notebook.id}
                button
                selected={activeNotebook?.id === notebook.id}
                onClick={() => navigate(`/shared-notebook/${notebook.id}`)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    },
                  },
                }}
              >
                <ListItemText primary={notebook.title} />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNotebook(notebook.id);
                    }}
                    sx={{ color: theme.palette.error.main }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Orta Panel - Editör */}
        <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
          <Paper 
            sx={{ 
              height: '100%', 
              p: 2,
              bgcolor: 'background.paper',
              color: 'text.primary'
            }}
          >
            <TextField
              multiline
              fullWidth
              value={activeNotebook?.content || ''}
              onChange={(e) => setActiveNotebook({ ...activeNotebook, content: e.target.value })}
              variant="outlined"
              placeholder="Notlarınızı buraya yazın..."
              sx={{
                flex: 1,
                '& .MuiInputBase-root': {
                  height: '100%',
                  bgcolor: 'background.paper',
                  '& textarea': {
                    height: '100% !important',
                    ...getTextStyle(),
                    padding: '16px',
                    lineHeight: 1.6,
                    color: 'text.primary',
                  },
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                },
              }}
            />
          </Paper>
        </Box>

        {/* Sağ Panel - Paylaşım Ayarları */}
        <Paper 
          sx={{ 
            width: 300, 
            borderLeft: 1, 
            borderColor: 'divider',
            bgcolor: 'background.paper',
            color: 'text.primary',
            p: 2
          }}
        >
          <Typography variant="subtitle1" gutterBottom>
            İşbirlikçiler
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {activeNotebook?.collaborators?.map((email) => (
              <Chip
                key={email}
                label={email}
                onDelete={() => handleRemoveCollaborator(email)}
                color={email === activeNotebook.owner ? 'primary' : 'default'}
                variant={email === activeNotebook.owner ? 'filled' : 'outlined'}
                sx={{
                  '&.MuiChip-filled': {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                  },
                  '&.MuiChip-outlined': {
                    borderColor: theme.palette.divider,
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />
            ))}
          </Box>
          <Button
            startIcon={<PersonAddIcon />}
            variant="outlined"
            fullWidth
            onClick={() => setInviteDialog(true)}
          >
            İşbirlikçi Ekle
          </Button>
        </Paper>
      </Box>

      {/* Yeni Not Defteri Dialog */}
      <Dialog open={newNotebookDialog} onClose={() => setNewNotebookDialog(false)}>
        <DialogTitle>Yeni Not Defteri Oluştur</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Not Defteri Başlığı"
            fullWidth
            value={newNotebookTitle}
            onChange={(e) => setNewNotebookTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewNotebookDialog(false)}>İptal</Button>
          <Button onClick={handleCreateNotebook} variant="contained">
            Oluştur
          </Button>
        </DialogActions>
      </Dialog>

      {/* Davet Dialog */}
      <Dialog open={inviteDialog} onClose={() => setInviteDialog(false)}>
        <DialogTitle>İşbirlikçi Davet Et</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="E-posta Adresi"
            type="email"
            fullWidth
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInviteDialog(false)}>İptal</Button>
          <Button onClick={handleInvite} variant="contained">
            Davet Et
          </Button>
        </DialogActions>
      </Dialog>

      {/* Menü */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={() => {
          setNewNotebookDialog(true);
          setAnchorEl(null);
        }}>
          <AddIcon sx={{ mr: 1 }} /> Yeni Not Defteri
        </MenuItem>
        <MenuItem onClick={() => {
          handleDeleteNotebook();
          setAnchorEl(null);
        }}>
          <DeleteIcon sx={{ mr: 1 }} /> Not Defterini Sil
        </MenuItem>
      </Menu>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SharedNotebookPage; 