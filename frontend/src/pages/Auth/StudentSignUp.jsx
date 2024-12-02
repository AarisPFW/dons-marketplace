// src/pages/Auth/StudentSignUp.jsx
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
import AuthCard from '../../../components/common/AuthCard';

const StudentSignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate PFW email
    if (!formData.email.endsWith('@pfw.edu')) {
      setError('Please use your PFW email address (@pfw.edu)');
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Proceed to OTP verification
    navigate('/verify-otp', { state: { userType: 'student', email: formData.email } });
  };

  return (
    <AuthCard>
      <Typography variant="h4" gutterBottom color="primary" fontWeight="bold">
        Student Sign Up
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Create your account using your PFW email
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
            href="/student/signin" 
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

export default StudentSignUp;