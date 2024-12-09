import React from 'react';
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
  CircularProgress,
  Skeleton
} from '@mui/material';
import { Edit, Trash2, PackageSearch } from 'lucide-react';

const ProductTable = ({ 
  products, 
  loading,  // New prop for loading state
  onEdit, 
  onDelete, 
  page, 
  rowsPerPage, 
  onPageChange, 
  onRowsPerPageChange 
}) => {
  if (loading) {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Date Posted</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(rowsPerPage)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton variant="rectangular" width={50} height={50} /></TableCell>
                  <TableCell><Skeleton width={150} /></TableCell>
                  <TableCell><Skeleton width={100} /></TableCell>
                  <TableCell><Skeleton width={70} /></TableCell>
                  <TableCell><Skeleton width={100} /></TableCell>
                  <TableCell><Skeleton width={80} /></TableCell>
                  <TableCell><Skeleton width={100} /></TableCell>
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
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Date Posted</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((product) => (
                <TableRow key={product._id}>  {/* Changed from id to _id for MongoDB */}
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
                  <TableCell>
                    <Chip 
                      label={product.status}
                      color={product.status === 'Listed' ? 'info' : 'success'}
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
        count={products.length}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </Paper>
  );
};

export default ProductTable;