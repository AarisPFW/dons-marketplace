// src/pages/Seller/Dashboard.jsx
import React, { useState } from 'react';
import {
  Box,
  Container,
  Button,
  Typography
} from '@mui/material';
import { Plus } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import ProductTable from '../../components/seller/ProductTable';
import ProductDialog from '../../components/seller/ProductDialog';
import DeleteConfirmDialog from '../../components/seller/DeleteConfirmDialog';

// Dummy data - replace with API call later
const DUMMY_PRODUCTS = [
  {
    id: 1,
    title: "Study Table",
    price: 50.00,
    category: "Home",
    description: "Good condition study table",
    image: "/api/placeholder/400/200",
    datePosted: "2024-03-01",
    status: "Listed"
  },
  // Add more dummy products...
];

const SellerDashboard = () => {
  const [products, setProducts] = useState(DUMMY_PRODUCTS);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, product: null });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setOpenDialog(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const handleDeleteClick = (product) => {
    setDeleteDialog({ open: true, product });
  };

  const handleDeleteConfirm = () => {
    setProducts(products.filter(p => p.id !== deleteDialog.product.id));
    setDeleteDialog({ open: false, product: null });
  };

  const handleSubmit = (formData) => {
    if (selectedProduct) {
      // Update existing product
      setProducts(prevProducts => prevProducts.map(p => 
        p.id === selectedProduct.id ? { ...formData, id: p.id } : p
      ));
    } else {
      // Add new product
      setProducts(prevProducts => [
        ...prevProducts,
        {
          ...formData,
          id: Math.max(...prevProducts.map(p => p.id), 0) + 1, // Generate unique ID
          datePosted: new Date().toISOString()
        }
      ]);
    }
    setOpenDialog(false);
    setSelectedProduct(null); // Reset selected product after submission
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedProduct(null); // Reset selected product when closing
  };

  return (
    <Box>
      <Navbar userType="seller" />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">My Products</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Plus />}
            onClick={handleAddProduct}
          >
            List Product
          </Button>
        </Box>

        <ProductTable
          products={products}
          onEdit={handleEditProduct}
          onDelete={handleDeleteClick}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />

        <ProductDialog
          open={openDialog}
          onClose={handleClose}
          onSubmit={handleSubmit}
          product={selectedProduct}
        />

        <DeleteConfirmDialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, product: null })}
          onConfirm={handleDeleteConfirm}
          productTitle={deleteDialog.product?.title}
        />
      </Container>
    </Box>
  );
};

export default SellerDashboard;