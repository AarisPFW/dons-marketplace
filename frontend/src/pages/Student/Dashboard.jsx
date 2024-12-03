// src/pages/Student/Dashboard.jsx
import React, { useState } from 'react';
import { Box, Container, Stack, Pagination } from '@mui/material';
import Navbar from '../../../components/common/navbar';
import FilterSection from '../../../components/student/FilterSection';
import ProductGrid from '../../../components/student/ProductGrid';
import ProductDetailModal from '../../../components/student/ProductDetailModal';

// Temporary Dummy data
const DUMMY_PRODUCTS = [
  {
    "id": 1,
    "title": "Study Table",
    "price": 50.00,
    "category": "Home",
    "description": "Good condition study table",
    "image": "/api/placeholder/400/200",
    "datePosted": "2024-03-01"
  },
  {
    "id": 2,
    "title": "Vintage Guitar",
    "price": 299.99,
    "category": "Music",
    "description": "1980s acoustic guitar, minor wear",
    "image": "/api/placeholder/400/200",
    "datePosted": "2024-03-02"
  },
  {
    "id": 3,
    "title": "Mountain Bike",
    "price": 450.00,
    "category": "Sports",
    "description": "Trek mountain bike, recently serviced",
    "image": "/api/placeholder/400/200",
    "datePosted": "2024-03-03"
  },
  {
    "id": 4,
    "title": "iPhone 13",
    "price": 599.99,
    "category": "Electronics",
    "description": "256GB, excellent condition, includes charger",
    "image": "/api/placeholder/400/200",
    "datePosted": "2024-03-04"
  },
  {
    "id": 5,
    "title": "Leather Sofa",
    "price": 899.00,
    "category": "Home",
    "description": "Brown leather 3-seater sofa",
    "image": "/api/placeholder/400/200",
    "datePosted": "2024-03-05"
  },
  {
    "id": 6,
    "title": "Gaming Monitor",
    "price": 279.99,
    "category": "Electronics",
    "description": "27-inch 144Hz gaming monitor",
    "image": "/api/placeholder/400/200",
    "datePosted": "2024-03-06"
  },
  {
    "id": 7,
    "title": "Tennis Racket",
    "price": 45.00,
    "category": "Sports",
    "description": "Wilson tennis racket with case",
    "image": "/api/placeholder/400/200",
    "datePosted": "2024-03-07"
  },
  {
    "id": 8,
    "title": "Digital Piano",
    "price": 699.99,
    "category": "Music",
    "description": "Yamaha digital piano with stand",
    "image": "/api/placeholder/400/200",
    "datePosted": "2024-03-08"
  },
  {
    "id": 9,
    "title": "Coffee Table",
    "price": 120.00,
    "category": "Home",
    "description": "Modern glass coffee table",
    "image": "/api/placeholder/400/200",
    "datePosted": "2024-03-09"
  },
  {
    "id": 10,
    "title": "Camping Tent",
    "price": 159.99,
    "category": "Outdoors",
    "description": "4-person waterproof tent",
    "image": "/api/placeholder/400/200",
    "datePosted": "2024-03-10"
  },
  {
    "id": 11,
    "title": "Smart Watch",
    "price": 199.99,
    "category": "Electronics",
    "description": "Fitness tracker with heart rate monitor",
    "image": "/api/placeholder/400/200",
    "datePosted": "2024-03-11"
  },
  {
    "id": 12,
    "title": "Dining Set",
    "price": 399.99,
    "category": "Home",
    "description": "Table with 4 chairs, solid wood",
    "image": "/api/placeholder/400/200",
    "datePosted": "2024-03-12"
  },
  {
    "id": 13,
    "title": "Electric Guitar",
    "price": 349.99,
    "category": "Music",
    "description": "Fender Stratocaster, mint condition",
    "image": "/api/placeholder/400/200",
    "datePosted": "2024-03-13"
  },
  {
    "id": 14,
    "title": "Yoga Mat",
    "price": 25.00,
    "category": "Sports",
    "description": "Premium non-slip yoga mat",
    "image": "/api/placeholder/400/200",
    "datePosted": "2024-03-14"
  },
  {
    "id": 15,
    "title": "Drawing Tablet",
    "price": 179.99,
    "category": "Electronics",
    "description": "Wacom drawing tablet with pen",
    "image": "/api/placeholder/400/200",
    "datePosted": "2024-03-15"
  },
  {
    "id": 16,
    "title": "Bookshelf",
    "price": 89.99,
    "category": "Home",
    "description": "5-tier wooden bookshelf",
    "image": "/api/placeholder/400/200",
    "datePosted": "2024-03-16"
  },
  {
    "id": 17,
    "title": "Drum Set",
    "price": 549.99,
    "category": "Music",
    "description": "Complete 5-piece drum set",
    "image": "/api/placeholder/400/200",
    "datePosted": "2024-03-17"
  },
  {
    "id": 18,
    "title": "Soccer Ball",
    "price": 29.99,
    "category": "Sports",
    "description": "Official size soccer ball",
    "image": "/api/placeholder/400/200",
    "datePosted": "2024-03-18"
  },
  {
    "id": 19,
    "title": "Laptop Stand",
    "price": 35.00,
    "category": "Electronics",
    "description": "Adjustable aluminum laptop stand",
    "image": "/api/placeholder/400/200",
    "datePosted": "2024-03-19"
  },
  {
    "id": 20,
    "title": "Wall Clock",
    "price": 40.00,
    "category": "Home",
    "description": "Modern minimalist wall clock",
    "image": "/api/placeholder/400/200",
    "datePosted": "2024-03-20"
  }
];

const StudentDashboard = () => {
  const [filters, setFilters] = useState({
    search: "",
    category: "All",
    sortBy: "datePosted",
    priceRange: "all"
  });
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const isInPriceRange = (price, range) => {
    switch (range) {
      case "0-50":
        return price <= 50;
      case "50-100":
        return price > 50 && price <= 100;
      case "100-500":
        return price > 100 && price <= 500;
      case "500+":
        return price > 500;
      default:
        return true; // "all" or any other value
    }
  };

  // Filter and sort products
  const filteredProducts = DUMMY_PRODUCTS.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = filters.category === "All" || product.category === filters.category;
    const matchesPriceRange = isInPriceRange(product.price, filters.priceRange);
    
    return matchesSearch && matchesCategory && matchesPriceRange;
  }).sort((a, b) => {
    if (filters.sortBy === "datePosted") return new Date(b.datePosted) - new Date(a.datePosted);
    if (filters.sortBy === "priceAsc") return a.price - b.price;
    if (filters.sortBy === "priceDesc") return b.price - a.price;
    return 0;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  //State management for card
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      <Navbar />
      <Container 
        maxWidth="xl" 
        sx={{ 
          py: 4,
          px: { xs: 2, sm: 3 },
        }}
      >
        <Stack 
          spacing={3} 
          sx={{ 
            width: '100%',
            alignItems: 'center' 
          }}
        >
          <FilterSection filters={filters} setFilters={setFilters} />
          <ProductGrid products={displayedProducts} onProductClick={handleProductClick}/>
          <Box display="flex" justifyContent="center" sx={{ width: '100%', py: 2 }}>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={(e, value) => setPage(value)}
              color="primary"
              size="large"
              sx={{
                '& .MuiPagination-ul': {
                  flexWrap: 'nowrap'
                }
              }}
            />
          </Box>
        </Stack>
      </Container>
      <ProductDetailModal
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
      />
    </Box>
  );
};

export default StudentDashboard;