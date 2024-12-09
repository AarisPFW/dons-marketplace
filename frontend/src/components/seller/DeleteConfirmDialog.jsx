// src/components/seller/DeleteConfirmDialog.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from '@mui/material';
import { AlertTriangle } from 'lucide-react';

const DeleteConfirmDialog = ({ open, onClose, onConfirm, productTitle }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 0 }}>Delete Product</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 1 }}>
          <AlertTriangle color="error" size={24} style={{ marginRight: '8px' }} />
          <Typography variant="h6" color="error">
            Are you sure?
          </Typography>
        </Box>
        <Typography>
          This will permanently delete "{productTitle}". This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Delete Product
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;