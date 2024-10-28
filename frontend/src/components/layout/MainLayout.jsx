import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from '../common/Navbar';

const MainLayout = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Navbar />
      <Box component="main">
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;