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
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

const ItemManagement = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    category: 'pizza',
    price: 0
  });
  const [editingItem, setEditingItem] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Fetch all items
  const fetchItems = async () => {
    try {
      const res = await fetch('/api/items');
      if (!res.ok) throw new Error('Failed to fetch items');
      setItems(await res.json());
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Failed to load items');
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  // Handle edit input changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingItem(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  // Create new item
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });

      if (!res.ok) throw new Error('Failed to create item');
      
      fetchItems();
      setNewItem({ name: '', description: '', category: 'pizza', price: 0 });
    } catch (error) {
      console.error('Create error:', error);
      alert('Failed to create item');
    }
  };

  // Delete item
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/items/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Failed to delete item');
      
      fetchItems();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete item');
    }
  };

  // Open edit dialog
  const handleEditClick = (item) => {
    setEditingItem({ ...item });
    setOpenDialog(true);
  };

  // Update item
  const handleUpdate = async () => {
    try {
      const res = await fetch(`/api/items/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem)
      });

      if (!res.ok) throw new Error('Failed to update item');
      
      fetchItems();
      setOpenDialog(false);
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update item');
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
      
      {/* Add Item Form */}
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4, p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
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
          inputProps={{ step: "0.01", min: "0" }}
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

      {/* Items Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEditClick(item)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(item.id)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={editingItem?.name || ''}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Description"
            name="description"
            value={editingItem?.description || ''}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
            multiline
            rows={2}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={editingItem?.category || 'pizza'}
              onChange={handleEditChange}
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
            value={editingItem?.price || 0}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
            inputProps={{ step: "0.01", min: "0" }}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ItemManagement;