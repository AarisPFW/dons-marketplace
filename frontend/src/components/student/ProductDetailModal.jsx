// src/components/student/ProductDetailModal.jsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Grid,
  Divider,
  Link,
  Chip
} from '@mui/material';
import { X, Mail, Phone } from 'lucide-react';

const ProductDetailModal = ({ open, onClose, product }) => {
  if (!product) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
        {/* Close Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <IconButton
            onClick={onClose}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: 'text.primary',
              }
            }}
          >
            <X />
          </IconButton>
        </Box>

        <Grid container>
          {/* Image Section */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                width: '100%',
                height: { xs: '300px', md: '400px' },
                position: 'relative',
                overflow: 'hidden',
                bgcolor: 'grey.100'
              }}
            >
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'text.secondary'
                  }}
                >
                  No Image Available
                </Box>
              )}
            </Box>
          </Grid>

          {/* Details Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" fontWeight="bold">
                  {product.title}
                </Typography>
                <Chip 
                  label={product.status} 
                  color={product.status === 'Listed' ? 'info' : 'success'}
                  size="small"
                />
              </Box>

              <Typography variant="h4" color="primary" gutterBottom>
                ${product.price.toFixed(2)}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body1" color="text.secondary" paragraph>
                {product.description}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Category: {product.category}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Posted: {new Date(product.date_posted).toLocaleString()}
              </Typography>

              <Divider sx={{ my: 2 }} />

              {/* Seller Info */}
              <Typography variant="h6" gutterBottom>
                Contact Seller
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link
                  href={`mailto:${product.seller_email}`}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: 'text.primary',
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'primary.main',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  <Mail size={20} style={{ marginRight: 8 }} />
                  {product.seller_email}
                </Link>

                <Link
                  href={`sms:${product.seller?.phone || "1234567890"}`}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: 'text.primary',
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'primary.main',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  <Phone size={20} style={{ marginRight: 8 }} />
                  {product.seller_phone_number}
                </Link>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;