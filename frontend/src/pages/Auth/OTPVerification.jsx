// src/pages/Auth/OTPVerification.jsx
import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Alert,
  Snackbar
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../../api/auth';
import AuthCard from '../../components/common/AuthCard';
import { useAuth } from '../../contexts/AuthContext';

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });

  // Get data passed from signup
  const { email, role, password, username } = location.state || {};

  useEffect(() => {
    // Redirect if no email in state
    if (!email) {
      navigate('/student/signup');
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.verifyOTP({
        email,
        otp,
        password,
        username
      });

      // Set user data and tokens
      localStorage.setItem('accessToken', response.data.access_token);
      localStorage.setItem('refreshToken', response.data.refresh_token);
      setUser(response.data.user);

      setAlert({
        show: true,
        message: 'Email verified successfully!',
        severity: 'success'
      });

      // Redirect based on role
      setTimeout(() => {
        navigate(role === 'student' ? '/student/dashboard' : '/seller/dashboard');
      }, 1500);

    } catch (error) {
      setAlert({
        show: true,
        message: error.response?.data?.error || 'Verification failed',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      await authAPI.sendOTP({ email, role });
      setAlert({
        show: true,
        message: 'OTP resent successfully',
        severity: 'success'
      });
    } catch (error) {
      setAlert({
        show: true,
        message: error.response?.data?.error || 'Failed to resend OTP',
        severity: 'error'
      });
    }
  };

  return (
    <AuthCard>
      <Typography variant="h4" gutterBottom color="primary" fontWeight="bold">
        Verify Email
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Enter the verification code sent to {email}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Enter OTP"
            variant="outlined"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            sx={{ mb: 2 }}
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
          {loading ? 'Verifying...' : 'Verify Email'}
        </Button>

        <Button
          variant="text"
          color="primary"
          onClick={handleResendOTP}
          fullWidth
        >
          Resend OTP
        </Button>
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

export default OTPVerification;