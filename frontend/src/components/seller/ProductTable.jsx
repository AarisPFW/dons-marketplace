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
  Typography
} from '@mui/material';
import { Edit, Trash2, PackageSearch } from 'lucide-react';

const ProductTable = ({ 
  products, 
  onEdit, 
  onDelete, 
  page, 
  rowsPerPage, 
  onPageChange, 
  onRowsPerPageChange 
}) => {
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
                <TableRow key={product.id}>
                  <TableCell>
                    <img 
                      src={product.image} 
                      alt={product.title} 
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                  </TableCell>
                  <TableCell>{product.title}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{new Date(product.datePosted).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip 
                      label={product.status}
                      color={product.status === 'Listed' ? 'info' : 'success'}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => onEdit(product)}>
                      <Edit size={20} />
                    </IconButton>
                    <IconButton onClick={() => onDelete(product)}>
                      <Trash2 size={20} />
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