// src/components/student/ProductCard.jsx
import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';

const ProductCard = ({ product, onClick }) => {
  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          cursor: 'pointer'
        }
      }}
      onClick={() => onClick(product)}
    >
      <CardMedia
        component="img"
        height="200"
        image={product.image}
        alt={product.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {product.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {product.description}
        </Typography>
        <Typography variant="h6" color="primary">
          ${product.price.toFixed(2)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {product.category} • Posted on {new Date(product.datePosted).toLocaleDateString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProductCard;