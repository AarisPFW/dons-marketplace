// src/pages/Auth/StudentSignIn.jsx
import React, { useState } from 'react';
import { 
  Typography, 
  TextField, 
  Button, 
  Link, 
  Box,
  Alert,
  Snackbar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthCard from '../../components/common/AuthCard';
import { authAPI } from '../../api/auth';
import { useAuth } from '../../contexts/AuthContext';

const StudentSignIn = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await authAPI.login({
      email: formData.email,
      password: formData.password,
      role: 'student'
    });

    // Success case
    localStorage.setItem('accessToken', response.data.access_token);
    localStorage.setItem('refreshToken', response.data.refresh_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    setUser(response.data.user);

    setAlert({
      show: true,
      message: 'Login successful!',
      severity: 'success'
    });

    setTimeout(() => {
      navigate('/student/dashboard');
    }, 1000);

  } catch (error) {
    // Handle different error cases
    let errorMessage = 'Invalid credentials';
    
    if (error.response?.status === 401) {
      errorMessage = 'Invalid email or password';
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (!error.response) {
      errorMessage = 'Network error. Please try again.';
    }

    setAlert({
      show: true,
      message: errorMessage,
      severity: 'error'
    });

    // Clear password on error
    setFormData(prev => ({
      ...prev,
      password: ''
    }));
  }

  setLoading(false);
};

  return (
    <AuthCard>
      <Typography variant="h4" gutterBottom color="primary" fontWeight="bold">
        Student Sign In
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome back! Please login to your account
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="PFW Email"
            variant="outlined"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            sx={{ mb: 2 }}
            required
            error={alert.severity === 'error' && alert.message.includes('email')}
          />
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            error={alert.severity === 'error' && alert.message.includes('password')}
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="secondary"
          size="large"
          fullWidth
          sx={{ mb: 2 }}
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>

        <Typography variant="body2" color="text.secondary">
          Don't have an account?{' '}
          <Link 
            href="/student/signup" 
            color="secondary"
            sx={{ textDecoration: 'none', fontWeight: 'medium' }}
          >
            Sign Up
          </Link>
        </Typography>
      </form>

      <Snackbar 
        open={alert.show} 
        autoHideDuration={6000} 
        onClose={() => setAlert({ ...alert, show: false })}
      >
        <Alert 
          severity={alert.severity} 
          onClose={() => setAlert({ ...alert, show: false })}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </AuthCard>
  );
};

export default StudentSignIn;