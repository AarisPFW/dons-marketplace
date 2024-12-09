// src/pages/Auth/StudentSignUp.jsx
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
import axiosInstance from '../../api/axios';
import { useAuth } from '../../contexts/AuthContext';

const StudentSignUp = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setAlert({
        show: true,
        message: "Passwords don't match",
        severity: 'error'
      });
      setLoading(false);
      return;
    }

    if (!formData.email.endsWith('@pfw.edu')) {
      setAlert({
        show: true,
        message: 'Please use your PFW email address',
        severity: 'error'
      });
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post('/users/auth/signup/', {
        email: formData.email,
        password: formData.password,
        username: formData.username,
        role: 'student'
      });

      setAlert({
        show: true,
        message: 'Registration successful! Please check your email for OTP.',
        severity: 'success'
      });

      // Navigate to OTP verification with necessary data
      navigate('/verify-otp', { 
        state: { 
          email: formData.email,
          role: 'student',
          password: formData.password,
          username: formData.username
        } 
      });
    } catch (error) {
      setAlert({
        show: true,
        message: error.response?.data?.message || 'Registration failed',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard>
      <Typography variant="h4" gutterBottom color="primary" fontWeight="bold">
        Student Sign Up
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            label="PFW Email"
            variant="outlined"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            sx={{ mb: 2 }}
            required
            helperText="Must be a valid @pfw.edu email"
          />
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            label="Confirm Password"
            variant="outlined"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
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
          {loading ? 'Signing Up...' : 'Sign Up'}
        </Button>

        <Typography variant="body2" color="text.secondary">
          Already have an account?{' '}
          <Link 
            href="/student/signin" 
            color="secondary"
            sx={{ textDecoration: 'none', fontWeight: 'medium' }}
          >
            Sign In
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

export default StudentSignUp;