import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Grid
} from '@mui/material';

const ProductDialog = ({ open, onClose, onSubmit, product }) => {
    const initialFormData = {
      title: '',
      price: '',
      category: '',
      description: '',
      image: '/api/placeholder/400/200', // default image
      status: 'Listed'
    };
  
    const [formData, setFormData] = useState(initialFormData);
  
    useEffect(() => {
      if (product) {
        setFormData(product);
      } else {
        setFormData(initialFormData); // Reset form when adding new product
      }
    }, [product, open]); // Add open to dependencies
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit({
        ...formData,
        price: Number(formData.price) // Ensure price is a number
      });
    };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {product ? 'Edit Product' : 'List New Product'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <MenuItem value="Home">Home</MenuItem>
                  <MenuItem value="Electronics">Electronics</MenuItem>
                  <MenuItem value="Personal">Personal</MenuItem>
                  <MenuItem value="Kitchen">Kitchen</MenuItem>
                  <MenuItem value="Others">Others</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                required
              />
            </Grid>
            {product && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Status"
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <MenuItem value="Listed">Listed</MenuItem>
                    <MenuItem value="Sold">Sold</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {product ? 'Update' : 'List'} Product
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductDialog;