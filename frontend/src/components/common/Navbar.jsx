import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Badge,
} from '@mui/material';
import {
  ShoppingCart,
  Notifications,
  Person,
  Favorite
} from '@mui/icons-material';

const Navbar = () => {
  return (
    <AppBar position="static" color="secondary">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ 
            flexGrow: 1, 
            textDecoration: 'none', 
            color: 'primary.main',
            fontWeight: 'bold' 
          }}
        >
          Don's Marketplace
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <IconButton color="inherit">
            <Favorite />
          </IconButton>
          
          <IconButton color="inherit">
            <Badge badgeContent={2} color="primary">
              <ShoppingCart />
            </Badge>
          </IconButton>
          
          <IconButton color="inherit">
            <Badge variant="dot" color="error">
              <Notifications />
            </Badge>
          </IconButton>
          
          <IconButton color="inherit">
            <Person />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;