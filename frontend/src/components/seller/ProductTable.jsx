import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  TablePagination,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Button
} from '@mui/material';
import { Edit, Trash2, PackageSearch, Search, FilterX } from 'lucide-react';

const ProductTable = ({ 
  products, 
  loading, 
  onEdit, 
  onDelete, 
  page, 
  rowsPerPage, 
  onPageChange, 
  onRowsPerPageChange 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [localPage, setLocalPage] = useState(0); // Local page state for filtered results

  // Reset page when filters change
  useEffect(() => {
    setLocalPage(0);
  }, [searchTerm, categoryFilter, statusFilter]);

  // Filter and search logic
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
    const matchesStatus = statusFilter ? product.status === statusFilter : true;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Get unique categories from products
  const categories = [...new Set(products.map(product => product.category))];

  // Function to reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setStatusFilter('');
    setLocalPage(0);
  };

  if (loading) {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Box sx={{ p: 2 }}>
          <Stack direction="row" spacing={2}>
            <TextField disabled fullWidth placeholder="Search products..." />
            <FormControl disabled sx={{ minWidth: 120 }}>
              <InputLabel>Category</InputLabel>
              <Select label="Category" />
            </FormControl>
            <FormControl disabled sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select label="Status" />
            </FormControl>
          </Stack>
        </Box>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Date Posted</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(rowsPerPage)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Box sx={{ width: 50, height: 50, bgcolor: 'grey.200' }} /></TableCell>
                  <TableCell><Box sx={{ width: 150, height: 20, bgcolor: 'grey.200' }} /></TableCell>
                  <TableCell><Box sx={{ width: 100, height: 20, bgcolor: 'grey.200' }} /></TableCell>
                  <TableCell><Box sx={{ width: 70, height: 20, bgcolor: 'grey.200' }} /></TableCell>
                  <TableCell><Box sx={{ width: 100, height: 20, bgcolor: 'grey.200' }} /></TableCell>
                  <TableCell><Box sx={{ width: 80, height: 20, bgcolor: 'grey.200' }} /></TableCell>
                  <TableCell><Box sx={{ width: 100, height: 20, bgcolor: 'grey.200' }} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }

  if (products.length === 0) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        py: 8,
        bgcolor: 'background.paper',
        borderRadius: 1
      }}>
        <PackageSearch size={48} style={{ color: '#999', marginBottom: '16px' }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No products listed
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Click on "List Product" to add your first product
        </Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ p: 2 }}>
        <Stack direction="row" spacing={2}>
          <TextField
            fullWidth
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search size={20} style={{ marginRight: 8 }} />
            }}
          />
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              label="Category"
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {categories.map(category => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="listed">Listed</MenuItem>
              <MenuItem value="sold">Sold</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>

      {filteredProducts.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          px: 2,
          bgcolor: 'background.paper'
        }}>
          <FilterX size={48} style={{ color: '#999', marginBottom: '16px' }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No matching products found
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Try adjusting your search or filters
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={resetFilters}
            sx={{ mt: 2 }}
          >
            Reset Filters
          </Button>
        </Box>
      ) : (
        <>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Date Posted</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts
                  .slice(localPage * rowsPerPage, localPage * rowsPerPage + rowsPerPage)
                  .map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: 1,
                            overflow: 'hidden',
                            bgcolor: 'grey.100'
                          }}
                        >
                          <img 
                            src={product.image} 
                            alt={product.title} 
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover' 
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>{product.title}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>${Number(product.price).toFixed(2)}</TableCell>
                      <TableCell>{new Date(product.date_posted).toLocaleDateString()}</TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={product.status}
                          color={product.status === 'listed' ? 'info' : 'success'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          onClick={() => onEdit(product)}
                          size="small"
                          color="primary"
                        >
                          <Edit size={18} />
                        </IconButton>
                        <IconButton 
                          onClick={() => onDelete(product)}
                          size="small"
                          color="error"
                          sx={{ ml: 1 }}
                        >
                          <Trash2 size={18} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredProducts.length}
            page={localPage}
            onPageChange={(e, newPage) => setLocalPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={onRowsPerPageChange}
          />
        </>
      )}
    </Paper>
  );
};

export default ProductTable;