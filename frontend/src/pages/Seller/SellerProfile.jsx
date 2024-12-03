// src/pages/Seller/Profile.jsx
import React from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  Avatar,
  Divider
} from '@mui/material';
import Navbar from '../../../components/common/Navbar';
import { UserCircle } from 'lucide-react';

const SellerProfile = () => {
  // This would come from your auth context/state management in a real app
  const userDetails = {
    name: "Jane Doe",
    email: "jane.doe@example.com"
  };

  return (
    <Box>
      <Navbar />
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
            Seller Profile
          </Typography>
          
          <Divider sx={{ width: '100%', my: 3 }} />

          <Box sx={{ width: '100%', maxWidth: 400 }}>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Name
            </Typography>
            <Typography variant="h6" gutterBottom>
              {userDetails.name}
            </Typography>

            <Typography 
              variant="subtitle1" 
              color="text.secondary" 
              gutterBottom 
              sx={{ mt: 2 }}
            >
              Email
            </Typography>
            <Typography variant="h6">
              {userDetails.email}
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default SellerProfile;