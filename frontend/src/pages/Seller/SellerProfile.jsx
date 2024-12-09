// src/pages/Seller/SellerProfile.jsx
import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import ProfileLayout from '../../components/common/ProfileLayout';
import axiosInstance from '../../api/axios';
import { useAuth } from '../../contexts/AuthContext';

const SellerProfile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axiosInstance.get('/users/profile/', {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setProfileData(response.data);
      } catch (err) {
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchProfile();
  }, []);

  return (
    <ProfileLayout 
      userType="seller" 
      isLoading={loading}
      error={error}
    >
      {profileData && (
        <>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Name
          </Typography>
          <Typography variant="h6" gutterBottom>
            {profileData.username}
          </Typography>

          <Typography 
            variant="subtitle1" 
            color="text.secondary" 
            gutterBottom 
            sx={{ mt: 2 }}
          >
            Email
          </Typography>
          <Typography variant="h6" gutterBottom>
            {profileData.email}
          </Typography>

          <Typography 
            variant="subtitle1" 
            color="text.secondary" 
            gutterBottom 
            sx={{ mt: 2 }}
          >
            Phone Number
          </Typography>
          <Typography variant="h6">
            {profileData.phone_number}
          </Typography>
        </>
      )}
    </ProfileLayout>
  );
};

export default SellerProfile;