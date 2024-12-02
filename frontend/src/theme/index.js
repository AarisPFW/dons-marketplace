// src/theme/index.js
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#000000', // PFW Black
      light: '#212121',
      dark: '#000000',
    },
    secondary: {
      main: '#CFB991', // PFW Gold
      light: '#D4C4A6',
      dark: '#BFA76F',
    },
    accent: {
      blue: '#0066B3', // PFW Blue
      white: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
  },
});