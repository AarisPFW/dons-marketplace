import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';

import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import StudentLogin from './pages/auth/StudentLogin';
import SellerLogin from './pages/auth/SellerLogin';
import ProductListing from './pages/marketplace/ProductListing';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login/student" element={<StudentLogin />} />
            <Route path="/login/seller" element={<SellerLogin />} />
            <Route path="/marketplace" element={<ProductListing />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;