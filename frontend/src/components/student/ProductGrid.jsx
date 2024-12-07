// src/components/student/ProductGrid.jsx
import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { PackageSearch } from 'lucide-react'; // Import the icon
import ProductCard from './ProductCard';

const ProductGrid = ({ products, onProductClick }) => {
  if (products.length === 0) {
    return (
      <Box 
        sx={{ 
          width: '100%', 
          textAlign: 'center',
          py: 8,
          px: 2
        }}
      >
        <PackageSearch 
          size={48} 
          style={{ 
            marginBottom: '16px',
            color: '#999' 
          }} 
        />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No products found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Try adjusting your filters or search terms
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={{ xs: 2, sm: 2, md: 3 }} sx={{ width: '100%', m: 0 }}>
      {products.map((product) => (
        <Grid item xs={12} sm={6} lg={4} key={product.id}>
          <ProductCard 
            product={product}
            onClick={() => onProductClick(product)}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductGrid;