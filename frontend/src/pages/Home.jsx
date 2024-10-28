import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
} from '@mui/material';
import { Person, Store } from '@mui/icons-material';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: 'primary.main', py: 10 }}>
      <Container>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h1" sx={{ mb: 2, color: 'black' }}>
            Welcome to Don's Marketplace
          </Typography>
          <Typography variant="h6" sx={{ mb: 6, color: 'black' }}>
            The official marketplace for Purdue Fort Wayne students
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={5}>
              <Paper elevation={3} sx={{ p: 4 }}>
                <Person sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Student Login
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                  Browse and buy items from fellow students
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/login/student')}
                >
                  Login with PFW Email
                </Button>
              </Paper>
            </Grid>

            <Grid item xs={12} md={5}>
              <Paper elevation={3} sx={{ p: 4 }}>
                <Store sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Seller Login
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                  List and manage your items for sale
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/login/seller')}
                >
                  Seller Portal
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;