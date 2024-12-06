// src/pages/Auth/OTPVerification.jsx
import React, { useState } from 'react';
import { 
  Typography, 
  TextField, 
  Button, 
  Box,
  Alert 
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthCard from '../../components/common/AuthCard';

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  
  const { userType, email } = location.state || {};

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // For now, check if OTP is '0000'
    if (otp === '0000') {
      navigate(`/${userType}/dashboard`);
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  return (
    <AuthCard>
      <Typography variant="h4" gutterBottom color="primary" fontWeight="bold">
        Verify Email
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Enter the OTP sent to {email}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Enter OTP"
            variant="outlined"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            sx={{ mb: 2 }}
            required
            helperText="For testing, use 0000"
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="secondary"
          size="large"
          fullWidth
          sx={{ 
            mb: 2,
            borderRadius: '8px',
            py: 1.5
          }}
        >
          Verify OTP
        </Button>
      </form>
    </AuthCard>
  );
};

export default OTPVerification;