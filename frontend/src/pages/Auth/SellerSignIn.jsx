// src/pages/Auth/SellerSignIn.jsx
import React, { useState } from 'react';
import { 
  Typography, 
  TextField, 
  Button, 
  Link,
  Box 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthCard from '../../../components/common/AuthCard';

const SellerSignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add validation and API call here
    navigate('/seller/dashboard');
  };

  return (
    <AuthCard>
      <Typography variant="h4" gutterBottom color="primary" fontWeight="bold">
        Seller Sign In
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome back! Access your seller dashboard
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
          Sign In
        </Button>

        <Typography variant="body2" color="text.secondary">
          Don't have an account?{' '}
          <Link 
            href="/seller/signup" 
            color="secondary"
            sx={{ textDecoration: 'none', fontWeight: 'medium' }}
          >
            Sign Up
          </Link>
        </Typography>
      </form>
    </AuthCard>
  );
};

export default SellerSignIn;