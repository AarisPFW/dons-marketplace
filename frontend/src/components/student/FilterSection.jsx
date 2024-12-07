import React from 'react';
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, InputAdornment } from '@mui/material';
import { Search } from 'lucide-react';

const CATEGORIES = ["All", "Home", "Electronics", "Personal", "Sports", "Kitchen", "Others"];

const FilterSection = ({ filters, setFilters }) => {
    return (
      <Grid 
        container 
        spacing={{ xs: 2, md: 2 }} 
        alignItems="center"
        sx={{ width: '100%', m: 0 }} // Add this
      >
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={filters.category}
              label="Category"
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              {CATEGORIES.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={filters.sortBy}
              label="Sort By"
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            >
              <MenuItem value="datePosted">Latest First</MenuItem>
              <MenuItem value="priceAsc">Price: Low to High</MenuItem>
              <MenuItem value="priceDesc">Price: High to Low</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Price Range</InputLabel>
            <Select
              value={filters.priceRange}
              label="Price Range"
              onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
            >
              <MenuItem value="all">All Prices</MenuItem>
              <MenuItem value="0-50">Under $50</MenuItem>
              <MenuItem value="50-100">$50 - $100</MenuItem>
              <MenuItem value="100-500">$100 - $500</MenuItem>
              <MenuItem value="500+">$500+</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    );
  };

export default FilterSection;