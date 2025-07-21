import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  TextField
} from '@mui/material';

const ItemManagement = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    category: 'pizza',
    price: 0
  });

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/items');
      if (!res.ok) throw new Error('Failed to fetch items');
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error('Fetch error:', error);
      // Add error handling (e.g., show toast notification)
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(newItem)
      });

      if (!res.ok) {
        throw new Error('Failed to create item');
      }

      // Refresh the items list
      await fetchItems();
      
      // Reset form
      setNewItem({
        name: '',
        description: '',
        category: 'pizza',
        price: 0
      });

    } catch (error) {
      console.error('Create error:', error);
    }
  };

  useEffect(() => { 
    fetchItems(); 
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom sx={{ mt: 3 }}>
        Item Management
      </Typography>
      
      <Box 
        component="form" 
        onSubmit={handleSubmit} 
        sx={{ 
          mb: 4, 
          p: 3, 
          bgcolor: 'background.paper', 
          borderRadius: 1,
          boxShadow: 1
        }}
      >
        <Typography variant="h6" gutterBottom>
          Add New Item
        </Typography>
        
        <TextField
          label="Name"
          name="name"
          value={newItem.name}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
        />
        
        <TextField
          label="Description"
          name="description"
          value={newItem.description}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          multiline
          rows={2}
        />
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            value={newItem.category}
            onChange={handleInputChange}
            label="Category"
          >
            <MenuItem value="pizza">Pizza</MenuItem>
            <MenuItem value="topping">Topping</MenuItem>
            <MenuItem value="beverage">Beverage</MenuItem>
          </Select>
        </FormControl>
        
        <TextField
          label="Price"
          name="price"
          type="number"
          value={newItem.price}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          inputProps={{ 
            step: "0.01",
            min: "0"
          }}
          required
        />
        
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2 }}
          disabled={!newItem.name || newItem.price <= 0}
        >
          Add Item
        </Button>
      </Box>
      
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length > 0 ? (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No items found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ItemManagement;