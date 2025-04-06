import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Link,
  CircularProgress,
} from '@mui/material';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!email) {
      setAlertMessage('Lütfen e-posta adresinizi girin.');
      setAlertSeverity('error');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setAlertMessage('Geçerli bir e-posta adresi girin.');
      setAlertSeverity('error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowAlert(false);
    
    if (!validateForm()) {
      setShowAlert(true);
      return;
    }

    setLoading(true);
    try {
      // API çağrısı simülasyonu
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === 'test@test.com') {
        setAlertMessage('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.');
        setAlertSeverity('success');
        setEmail('');
      } else {
        setAlertMessage('Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı.');
        setAlertSeverity('error');
      }
    } catch (error) {
      setAlertMessage('Bir hata oluştu. Lütfen tekrar deneyin.');
      setAlertSeverity('error');
    } finally {
      setLoading(false);
      setShowAlert(true);
    }
  };

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        backgroundColor: '#1976d2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'hidden'
      }}
    >
      <Container 
        component="main" 
        maxWidth="xs"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%'
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              mb: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h4" gutterBottom>
              Şifremi Unuttum
            </Typography>
          </Box>
          <Typography variant="body1" textAlign="center" sx={{ mb: 3 }}>
            E-posta adresinizi girin, şifre sıfırlama bağlantısını gönderelim.
          </Typography>

          {showAlert && (
            <Alert 
              severity={alertSeverity} 
              sx={{ width: '100%', mb: 2 }}
              onClose={() => setShowAlert(false)}
            >
              {alertMessage}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-posta Adresi"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Şifre Sıfırlama Bağlantısı Gönder'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link
                href="#"
                variant="body2"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/login');
                }}
                sx={{ cursor: 'pointer' }}
              >
                Giriş sayfasına dön
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPassword; 