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
  Grid,
  IconButton,
  Alert
} from '@mui/material';
import { Upload, X } from 'lucide-react';

const ProductDialog = ({ open, onClose, onSubmit, product }) => {
  const [formError, setFormError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);

  const initialFormData = {
    title: '',
    price: '',
    category: '',
    description: '',
    image: null,
    status: 'listed'
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (product) {
      setFormData(product);
      setImagePreview(product.image);
    } else {
      setFormData(initialFormData);
      setImagePreview(null);
    }
  }, [product, open]);

  // Validate form data whenever it changes
  useEffect(() => {
    const isValid = 
      formData.title.trim() !== '' &&
      formData.price > 0 &&
      formData.category !== '' &&
      formData.description.trim() !== '' &&
      (imagePreview !== null || (product && formData.image === product.image));

    setIsFormValid(isValid);
  }, [formData, imagePreview, product]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 30 * 1024 * 1024) { // 30MB check
        setFormError('Image size should be less than 30MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!isFormValid) {
      setFormError('Please fill in all required fields');
      return;
    }

    onSubmit({
      ...formData,
      price: Number(formData.price)
    });
  };

  const clearImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image: null }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {product ? 'Edit Product' : 'List New Product'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ 
                width: '100%', 
                height: 200, 
                border: '2px dashed #ccc',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                mb: 2,
                overflow: 'hidden'
              }}>
                {imagePreview ? (
                  <>
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '100%', 
                        objectFit: 'contain' 
                      }} 
                    />
                    <IconButton
                      onClick={clearImage}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'rgba(0,0,0,0.5)',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                      }}
                    >
                      <X color="white" size={20} />
                    </IconButton>
                  </>
                ) : (
                  <Button
                    component="label"
                    startIcon={<Upload />}
                  >
                    Upload Image
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </Button>
                )}
              </Box>
            </Grid>

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
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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

            {product && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Status"
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <MenuItem value="listed">Listed</MenuItem>
                    <MenuItem value="sold">Sold</MenuItem>
                    </Select>
              </FormControl>
            </Grid>
          )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={!isFormValid}
          >
            {product ? 'Update' : 'List'} Product
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductDialog;