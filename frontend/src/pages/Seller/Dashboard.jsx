import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Button,
  Typography,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { Plus } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import ProductTable from '../../components/seller/ProductTable';
import ProductDialog from '../../components/seller/ProductDialog';
import DeleteConfirmDialog from '../../components/seller/DeleteConfirmDialog';
import { useAuth } from '../../contexts/AuthContext';
import axiosInstance from '../../api/axios';

const SellerDashboard = () => {
  const { user, token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, product: null });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [alert, setAlert] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/users/products/?seller_email=${user.email}/`);
      setProducts(response.data.products || []);
    } catch (error) {
      showAlert('Failed to fetch products', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Run only once when component mounts
  useEffect(() => {
    fetchProducts();
  }, []); // Empty dependency array

  const showAlert = (message, severity = 'success') => {
    setAlert({
      open: true,
      message,
      severity
    });
  };

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

  const handleDeleteConfirm = async () => {
    try {
      await axiosInstance.delete(`/users/products/${deleteDialog.product._id}`);
      // Update local state instead of fetching
      setProducts(currentProducts => 
        currentProducts.filter(p => p._id !== deleteDialog.product._id)
      );
      showAlert('Product deleted successfully');
    } catch (error) {
      showAlert('Failed to delete product', 'error');
    } finally {
      setDeleteDialog({ open: false, product: null });
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedProduct) {
        // Update product
        const response = await axiosInstance.put(`/users/products/${selectedProduct._id}/update/`, {
          ...formData,
          seller_email: user.email
        });
        // Update local state
        setProducts(currentProducts => 
          currentProducts.map(p => 
            p._id === selectedProduct._id ? response.data.product : p
          )
        );
        showAlert('Product updated successfully');
      } else {
        // Add new product
        const response = await axiosInstance.post('/users/products/create/', {
          ...formData,
          seller_email: user.email,
          seller_phone_number: 122345678
        });
        // Update local state
        setProducts(currentProducts => 
          currentProducts.map(p => 
            p._id === selectedProduct._id ? response.data.product : p
          )
        );
        showAlert('Product created successfully');
      }
      setOpenDialog(false);
      setSelectedProduct(null);
    } catch (error) {
      showAlert(
        error.response?.data?.message || 'Failed to save product', 
        'error'
      );
    }
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
          loading={loading}
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
          onClose={() => {
            setOpenDialog(false);
            setSelectedProduct(null);
          }}
          onSubmit={handleSubmit}
          product={selectedProduct}
        />

        <DeleteConfirmDialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, product: null })}
          onConfirm={handleDeleteConfirm}
          productTitle={deleteDialog.product?.title}
        />

        <Snackbar 
          open={alert.open} 
          autoHideDuration={6000} 
          onClose={() => setAlert({ ...alert, open: false })}
        >
          <Alert 
            severity={alert.severity}
            onClose={() => setAlert({ ...alert, open: false })}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default SellerDashboard;