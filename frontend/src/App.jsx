// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';

// Pages
import LandingPage from './pages/Landing/LandingPage';
import StudentSignIn from './pages/Auth/StuentSignIn';
import StudentSignUp from './pages/Auth/StudentSignUp';
import SellerSignIn from './pages/Auth/SellerSignIn';
import SellerSignUp from './pages/Auth/SellerSignUp';
import OTPVerification from './pages/Auth/OTPVerification';
import StudentDashboard from './pages/Student/Dashboard';
import SellerDashboard from './pages/Seller/Dashboard';
import Profile from './pages/Student/StudentProfile';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Student Routes */}
          <Route path="/student">
            <Route path="signin" element={<StudentSignIn />} />
            <Route path="signup" element={<StudentSignUp />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Seller Routes */}
          <Route path="/seller">
            <Route path="signin" element={<SellerSignIn />} />
            <Route path="signup" element={<SellerSignUp />} />
            <Route path="dashboard" element={<SellerDashboard />} />
          </Route>

          {/* Common Routes */}
          <Route path="/verify-otp" element={<OTPVerification />} />

          {/* Catch all undefined routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;