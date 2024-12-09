import React, { useState, useEffect } from 'react';
import { Box, Container, Stack, Pagination } from '@mui/material';
import Navbar from '../../components/common/Navbar';
import FilterSection from '../../components/student/FilterSection';
import ProductGrid from '../../components/student/ProductGrid';
import ProductDetailModal from '../../components/student/ProductDetailModal';
import axiosInstance from '../../api/axios';

const StudentDashboard = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    category: "All",
    sortBy: "datePosted",
    priceRange: "all"
  });
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const itemsPerPage = 6;

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get('/users/products/');
        // Filter out sold products immediately after fetching
        const listedProducts = response.data.products.filter(product => product.status === 'listed');
        setProducts(listedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

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
        return true;
    }
  };

  // Filter and sort products
  const filteredProducts = products.filter(product => {
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

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      <Navbar userType="student" />
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