// src/components/common/ProfileLayout.jsx
import React from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  Avatar,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { UserCircle } from 'lucide-react';
import Navbar from './Navbar';

const ProfileLayout = ({ userType, isLoading, error, children }) => {
  if (isLoading) {
    return (
      <Box>
        <Navbar userType={userType} />
        <Container sx={{ py: 4, textAlign: 'center' }}>
          <CircularProgress />
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Navbar userType={userType} />
        <Container>
          <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box>
      <Navbar userType={userType} />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Avatar 
            sx={{ 
              width: 100, 
              height: 100, 
              mb: 2,
              bgcolor: 'secondary.main'
            }}
          >
            <UserCircle size={50} />
          </Avatar>

          <Typography variant="h4" gutterBottom>
            {userType === 'student' ? 'Student Profile' : 'Seller Profile'}
          </Typography>
          
          <Divider sx={{ width: '100%', my: 3 }} />

          <Box sx={{ width: '100%', maxWidth: 400 }}>
            {children}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ProfileLayout;