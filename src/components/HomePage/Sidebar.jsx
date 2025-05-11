import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNotes } from '../../context/NoteContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { supabase } from '../../utils/supabaseClient';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Divider,
  Collapse,
  TextField,
  ListItemButton,
  Avatar,
  Paper,
  Switch,
} from '@mui/material';
import {
  Home,
  NoteAdd,
  Task,
  Menu as MenuIcon,
  ExpandLess,
  ExpandMore,
  Delete,
  Search as SearchIcon,
  Person,
  Assignment,
  Group as GroupIcon,
  Event as EventIcon,
  DarkMode,
  LightMode,
} from '@mui/icons-material';

const drawerWidth = 240;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { notes, deleteNote } = useNotes();
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [userProfile, setUserProfile] = useState(null);
  const [open, setOpen] = useState(true);
  const [showRecentNotes, setShowRecentNotes] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Kullanıcı profili getirme hatası:', error);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Çıkış hatası:', error);
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const menuItems = [
    { text: 'Ana Sayfa', icon: <Home />, path: '/homepage', color: '#1976d2' },
    { text: 'Not Ekle', icon: <NoteAdd />, path: '/note-tutma', color: '#2e7d32' },
    { text: 'Görevler', icon: <Task />, path: '/tasks', color: '#ed6c02' },
    { text: 'Etkinlikler', icon: <EventIcon />, path: '/events', color: '#9c27b0' },
    { text: 'Paylaşımlı Not Defteri', icon: <GroupIcon />, path: '/shared-notebook/new', color: '#673ab7' },
  ];

  const darkModeListItem = (
    <ListItem>
      <ListItemIcon>
        {darkMode ? <LightMode /> : <DarkMode />}
      </ListItemIcon>
      <ListItemText primary={darkMode ? "Açık Mod" : "Karanlık Mod"} />
      <Switch
        checked={darkMode}
        onChange={toggleDarkMode}
        color="primary"
      />
    </ListItem>
  );

  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      {/* Kullanıcı Profili */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          mb: 2, 
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          color: 'white'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            sx={{ 
              width: 56, 
              height: 56, 
              bgcolor: 'white',
              color: '#2196F3'
            }}
          >
            <Person sx={{ fontSize: 40 }} />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {userProfile?.full_name || 'Kullanıcı'}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {user?.email || 'kullanici@email.com'}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path}
            sx={{
              mb: 1,
              borderRadius: 2,
              '&.Mui-selected': {
                backgroundColor: item.color,
                color: 'white',
                '&:hover': {
                  backgroundColor: item.color,
                },
                '& .MuiListItemIcon-root': {
                  color: 'white',
                },
              },
              '&:hover': {
                backgroundColor: `${item.color}20`,
              },
            }}
          >
            <ListItemIcon sx={{ color: item.color }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />

      <List>
        <ListItem>
          <TextField
            size="small"
            placeholder="Notlarda ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            fullWidth
          />
        </ListItem>

        <ListItemButton 
          onClick={() => setShowRecentNotes(!showRecentNotes)}
          sx={{
            borderRadius: 2,
            mb: 1,
            '&:hover': {
              backgroundColor: '#1976d220',
            },
          }}
        >
          <ListItemText primary="Son Notlar" />
          {showRecentNotes ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={showRecentNotes} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {filteredNotes.slice(0, 5).map((note) => (
              <ListItem
                key={note.id}
                sx={{
                  pl: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 1,
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                }}
              >
                <Box
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flex: 1,
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate(`/note/${note.id}`)}
                >
                  <Typography variant="body2" noWrap>
                    {note.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {new Date(note.created_at).toLocaleDateString('tr-TR')}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => deleteNote(note.id)}
                  sx={{ 
                    ml: 1,
                    color: '#d32f2f',
                    '&:hover': {
                      backgroundColor: '#d32f2f20',
                    },
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Collapse>

        {darkModeListItem}

        <ListItem>
          <ListItemButton onClick={handleLogout}>
            <ListItemText primary="Çıkış Yap" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ mr: 2, display: { sm: 'none' } }}
      >
        <MenuIcon />
      </IconButton>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

export default React.memo(Sidebar); 