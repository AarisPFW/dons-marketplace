// src/components/common/PhoneInput.jsx
import React from 'react';
import { TextField } from '@mui/material';

const PhoneInput = ({ value, onChange, ...props }) => {
  const formatPhoneNumber = (value) => {
    if (!value) return value;
    
    // Remove all non-digit characters
    const phoneNumber = value.replace(/[^\d]/g, '');
    
    // Get length of the input
    const phoneNumberLength = phoneNumber.length;
    
    // If length is less than 4, just return the numbers
    if (phoneNumberLength < 4) return phoneNumber;
    
    // If length is less than 7, format as (XXX) XXX
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    
    // Format as (XXX) XXX-XXXX
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handleInput = (e) => {
    // Get the input value
    const formattedNumber = formatPhoneNumber(e.target.value);
    
    // Limit to 14 characters (including formatting)
    if (formattedNumber.length <= 14) {
      onChange(formattedNumber);
    }
  };

  return (
    <TextField
      {...props}
      value={formatPhoneNumber(value)}
      onChange={(e) => handleInput(e)}
      placeholder="(123) 456-7890"
    />
  );
};

export default PhoneInput;