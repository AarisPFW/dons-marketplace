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
  const { user } = useAuth();
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
      const response = await axiosInstance.get(`/users/products/?seller_email=${user.email}`);
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
    setLoading(true);
    try {
      await axiosInstance.delete(`/users/products/${deleteDialog.product._id}/delete/`);
      await fetchProducts();
      showAlert('Product deleted successfully');
    } catch (error) {
      showAlert('Failed to delete product', 'error');
    } finally {
      setDeleteDialog({ open: false, product: null });
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      if (selectedProduct) {
        // Update product - only send required fields
        const updateData = {
          title: formData.title,
          price: formData.price,
          category: formData.category,
          description: formData.description,
          image: formData.image,
          status: formData.status,
          seller_email: user.email
        };

        await axiosInstance.put(`/users/products/${selectedProduct._id}/update/`, updateData);
        showAlert('Product updated successfully');
      } else {
        // Add new product
        await axiosInstance.post('/users/products/create/', {
          ...formData,
          seller_email: user.email,
          seller_phone_number: 122345678
        });
        showAlert('Product created successfully');
      }
      
      await fetchProducts();
      setOpenDialog(false);
      setSelectedProduct(null);
    } catch (error) {
      showAlert(
        error.response?.data?.message || 'Failed to save product', 
        'error'
      );
    } finally {
      setLoading(false);
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