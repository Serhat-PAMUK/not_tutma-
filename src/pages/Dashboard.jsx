import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
} from '@mui/material';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          sx={{
            p: 4,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            Hoş Geldiniz!
          </Typography>
          <Typography variant="body1" gutterBottom>
            {user?.email}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogout}
            sx={{ mt: 3 }}
          >
            Çıkış Yap
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard; 