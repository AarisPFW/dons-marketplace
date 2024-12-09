// src/api/auth.js
import axios from './axios';

export const authAPI = {
  signup: (data) => axios.post('/users/auth/signup/', data),
  login: (data) => axios.post('/users/auth/login/', data),
  sendOTP: (data) => axios.post('/users/auth/send-otp/', data),
  verifyOTP: (data) => axios.post('/users/auth/verify-otp/', data),
  logout: () => axios.post('/users/auth/logout/'),
  refreshToken: (refreshToken) => 
    axios.post('/users/auth/refresh-token/', { refresh_token: refreshToken })
};