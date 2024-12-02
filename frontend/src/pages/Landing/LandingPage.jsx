import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Paper,
  styled 
} from '@mui/material';
import { Shield, ShoppingBag, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeatureIcon = styled(Box)(({ theme }) => ({
  width: 64,
  height: 64,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.secondary.light,
  marginBottom: theme.spacing(2),
  margin: '0 auto',
}));

const StepNumber = styled(Typography)(({ theme }) => ({
  color: theme.palette.secondary.main,
  fontSize: '1.5rem',
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
}));

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <Box>
      {/* Hero Section */}
      {/* Hero Section */}
      <Box sx={{ 
        background: '#f5f5f5',
        py: 8 
      }}>
        <Container>
          <Box textAlign="center" mb={6}>
            <Typography variant="h1" gutterBottom>
              Dons Marketplace
            </Typography>
            <Typography variant="h5" color="text.secondary">
                Buy and Sell Within Purdue Fort Wayne Community!
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent="center" sx={{ px: 2 }}>
            {/* Student Card */}
            <Grid item xs={12} sm={6} md={4}>
                <Paper 
                elevation={3}
                sx={{ 
                    p: 4, 
                    height: '320px', // Fixed height for both cards
                    textAlign: 'center',
                    transition: 'transform 0.2s',
                    borderRadius: '16px', // More rounded edges
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    '&:hover': {
                    transform: 'translateY(-5px)',
                    cursor: 'pointer'
                    }
                }}
                >
                <Box>
                    <Users size={40} style={{ marginBottom: '16px' }} />
                    <Typography variant="h3" gutterBottom>
                    Student Login
                    </Typography>
                    <Typography color="text.secondary" paragraph>
                    Find and purchase items from your campus community
                    </Typography>
                </Box>
                <Button 
                    variant="contained" 
                    color="secondary" 
                    fullWidth
                    size="large"
                    sx={{ borderRadius: '8px' }}
                    onClick={() => navigate('/student/signin')}
                >
                    Login as Student
                </Button>
                </Paper>
            </Grid>

            {/* Seller Card */}
            <Grid item xs={12} sm={6} md={4}>
                <Paper 
                elevation={3}
                sx={{ 
                    p: 4, 
                    height: '320px',
                    textAlign: 'center',
                    transition: 'transform 0.2s',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    '&:hover': {
                    transform: 'translateY(-5px)',
                    cursor: 'pointer'
                    }
                }}
                >
                <Box>
                    <ShoppingBag size={40} style={{ marginBottom: '16px' }} />
                    <Typography variant="h3" gutterBottom>
                    Seller Login
                    </Typography>
                    <Typography color="text.secondary" paragraph>
                    List and manage your items for sale
                    </Typography>
                </Box>
                <Button 
                    variant="contained" 
                    color="secondary"
                    fullWidth
                    size="large"
                    sx={{ borderRadius: '8px' }}
                    onClick={() => navigate('/seller/signin')}
                >
                    Login as Seller
                </Button>
                </Paper>
            </Grid>
            </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {[
            { icon: Shield, title: 'Secure Platform', description: 'Exclusive access for students with college email verification' },
            { icon: ShoppingBag, title: 'Easy Trading', description: 'List items quickly and connect with buyers on campus' },
            { icon: Users, title: 'Community First', description: 'Trade with fellow students in a trusted environment' },
          ].map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper elevation={0} sx={{ p: 3, textAlign: 'center' }}>
                <FeatureIcon sx={{mb: 1.5}}>
                  <feature.icon size={32} color="black" />
                </FeatureIcon>
                <Typography variant="h3" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container>
          <Typography variant="h2" textAlign="center" gutterBottom sx={{ mb: 6 }}>
            How It Works
          </Typography>
          <Grid container spacing={4}>
            {[
              { step: '1', title: 'Sign Up', description: 'Register with your college email' },
              { step: '2', title: 'Browse Items', description: 'Explore listings from your peers' },
              { step: '3', title: 'Connect', description: 'Message sellers securely' },
              { step: '4', title: 'Trade', description: 'Meet on campus and complete the sale' },
            ].map((step, index) => (
              <Grid item xs={12} md={3} key={index} textAlign="center">
                <StepNumber>{step.step}</StepNumber>
                <Typography variant="h3" gutterBottom>
                  {step.title}
                </Typography>
                <Typography color="text.secondary">
                  {step.description}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
        <Container>
          <Box textAlign="center">
            <Typography variant="h2" gutterBottom>
              Ready to Join Your Campus Marketplace?
            </Typography>
            <Typography variant="h5" sx={{ mb: 4 }}>
              Start buying and selling with your college community today
            </Typography>
            <Button 
              variant="contained" 
              color="secondary"
              size="large"
              onClick={() => navigate('/student/signup')}
            >
              Join Now
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;