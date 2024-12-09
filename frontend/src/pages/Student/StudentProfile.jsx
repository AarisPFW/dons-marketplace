// src/pages/Student/StudentProfile.jsx
import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import ProfileLayout from '../../components/common/ProfileLayout';
import axiosInstance from '../../api/axios';
import { useAuth } from '../../contexts/AuthContext';

const StudentProfile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/users/profile/');
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
      userType="student" 
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
          <Typography variant="h6">
            {profileData.email}
          </Typography>
        </>
      )}
    </ProfileLayout>
  );
};

export default StudentProfile;