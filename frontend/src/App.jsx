// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import LandingPage from './pages/Landing/LandingPage';
import StudentSignIn from './pages/Auth/StudentSignIn';
import StudentSignUp from './pages/Auth/StudentSignUp';
import SellerSignIn from './pages/Auth/SellerSignIn';
import SellerSignUp from './pages/Auth/SellerSignUp';
import OTPVerification from './pages/Auth/OTPVerification';
import StudentDashboard from './pages/Student/Dashboard';
import SellerDashboard from './pages/Seller/Dashboard';
import StudentProfile from './pages/Student/StudentProfile';
import SellerProfile from './pages/Seller/SellerProfile';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Student Routes */}
            <Route path="/student">
              <Route path="signin" element={<StudentSignIn />} />
              <Route path="signup" element={<StudentSignUp />} />
              <Route path="dashboard" element={
                <ProtectedRoute roles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } />
              <Route path="profile" element={
                <ProtectedRoute roles={['student']}>
                  <StudentProfile />
                </ProtectedRoute>
              } />
            </Route>

            {/* Seller Routes */}
            <Route path="/seller">
              <Route path="signin" element={<SellerSignIn />} />
              <Route path="signup" element={<SellerSignUp />} />
              <Route path="dashboard" element={
                <ProtectedRoute roles={['seller']}>
                  <SellerDashboard />
                </ProtectedRoute>
              } />
              <Route path="profile" element={
                <ProtectedRoute roles={['seller']}>
                  <SellerProfile />
                </ProtectedRoute>
              } />
            </Route>

            {/* Common Routes */}
            <Route path="/verify-otp" element={<OTPVerification />} />

            {/* Catch all undefined routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;