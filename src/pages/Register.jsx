import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link as MuiLink,
  Alert,
  CircularProgress,
  Container,
} from '@mui/material';
import logo from '../assets/logo.png';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    if (!fullName.trim()) {
      setError('Lütfen kullanıcı adınızı girin');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await register(email, password, fullName);
      if (error) throw error;
      navigate('/homepage');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: 'background.paper',
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{
              width: 120,
              height: 120,
              mb: 3,
              objectFit: 'contain',
            }}
          />
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Kayıt Ol
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Kullanıcı Adı"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              margin="normal"
              required
              disabled={loading}
            />
            <TextField
              fullWidth
              label="E-posta"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Şifre"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Şifre Tekrar"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
              required
              disabled={loading}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Kayıt Ol'}
            </Button>
          </form>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <MuiLink component={Link} to="/login" variant="body2">
              Zaten hesabınız var mı? Giriş yapın
            </MuiLink>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register; 