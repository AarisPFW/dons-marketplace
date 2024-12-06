import React from 'react';
import { Paper, Box } from '@mui/material';

const AuthCard = ({ children }) => {
  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: (theme) => `linear-gradient(180deg, ${theme.palette.grey[100]} 0%, ${theme.palette.accent.white} 100%)`
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: '400px',
          borderRadius: '16px',
          textAlign: 'center'
        }}
      >
        {children}
      </Paper>
    </Box>
  );
};

export default AuthCard;