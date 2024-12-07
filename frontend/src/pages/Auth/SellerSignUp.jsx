// src/pages/Auth/SellerSignUp.jsx
import React, { useState } from 'react';
import { 
  Typography, 
  TextField, 
  Button, 
  Link,
  Box,
  Alert 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthCard from '../../components/common/AuthCard';
import PhoneInput from '../../components/common/PhoneInput';

const SellerSignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  // US Phone number validation function
  const isValidUSPhone = (phone) => {
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate phone number
    if (!isValidUSPhone(formData.phone)) {
      setError('Please enter a valid US phone number');
      return;
    }

    // Proceed to OTP verification
    navigate('/verify-otp', { 
      state: { 
        userType: 'seller', 
        email: formData.email,
        phone: formData.phone 
      } 
    });
  };

  return (
    <AuthCard>
      <Typography variant="h4" gutterBottom color="primary" fontWeight="bold">
        Seller Sign Up
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Create your seller account
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
            label="Full Name"
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            sx={{ mb: 2 }}
            required
          />
          <PhoneInput
            fullWidth
            label="Phone Number"
            variant="outlined"
            value={formData.phone}
            onChange={(value) => setFormData({ ...formData, phone: value })}
            sx={{ mb: 2 }}
            required
            helperText="US phone number"
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
          sx={{ 
            mb: 2,
            borderRadius: '8px',
            py: 1.5
          }}
        >
          Sign Up
        </Button>

        <Typography variant="body2" color="text.secondary">
          Already have an account?{' '}
          <Link 
            href="/seller/signin" 
            color="secondary"
            sx={{ textDecoration: 'none', fontWeight: 'medium' }}
          >
            Sign In
          </Link>
        </Typography>
      </form>
    </AuthCard>
  );
};

export default SellerSignUp;