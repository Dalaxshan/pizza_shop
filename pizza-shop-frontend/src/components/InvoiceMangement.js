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
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Grid,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import { useReactToPrint } from 'react-to-print';
import InvoicePrint from './InvoicePrint';

const InvoiceManagement = () => {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orders, setOrders] = useState([]);
  const invoiceRef = React.useRef();

  useEffect(() => {
    fetchItems();
    fetchOrders();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/items');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/orders');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity: quantity } : item
      )
    );
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleSubmitOrder = async () => {
    const subtotal = calculateSubtotal();
    const order = {
      customerName,
      customerPhone,
      subtotal,
      items: cart.map(item => ({
        item_id: item.id,
        quantity: item.quantity,
        price_at_order: item.price
      }))
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Order created with ID: ${data.order_id}`);
        setCart([]);
        setCustomerName('');
        setCustomerPhone('');
        fetchOrders();
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
  });

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom sx={{ mt: 3 }}>
        Invoice Management
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Available Items
          </Typography>
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => addToCart(item)}
                      >
                        Add
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Current Order
          </Typography>
          <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <TextField
              label="Customer Name"
              fullWidth
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              margin="normal"
            />
            <TextField
              label="Customer Phone"
              fullWidth
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              margin="normal"
            />
          </Box>
          
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Qty</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                    <TableCell align="right">
                      <TextField
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                        inputProps={{ min: 1, style: { textAlign: 'right' } }}
                        size="small"
                        sx={{ width: 60 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => removeFromCart(item.id)} size="small">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell rowSpan={3} />
                  <TableCell colSpan={2}>Subtotal</TableCell>
                  <TableCell align="right">${calculateSubtotal().toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2}>Tax (10%)</TableCell>
                  <TableCell align="right">${(calculateSubtotal() * 0.1).toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2}><strong>Total</strong></TableCell>
                  <TableCell align="right">
                    <strong>${(calculateSubtotal() * 1.1).toFixed(2)}</strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitOrder}
              disabled={cart.length === 0}
            >
              Submit Order
            </Button>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
              disabled={cart.length === 0}
            >
              Print Invoice
            </Button>
          </Box>
        </Grid>
      </Grid>
      
      {/* Hidden invoice for printing */}
      <div style={{ display: 'none' }}>
        <InvoicePrint 
          ref={invoiceRef} 
          customerName={customerName} 
          customerPhone={customerPhone} 
          cart={cart} 
          subtotal={calculateSubtotal()} 
        />
      </div>
      
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Recent Orders
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customer_name}</TableCell>
                <TableCell>{order.customer_phone}</TableCell>
                <TableCell align="right">${order.total.toFixed(2)}</TableCell>
                <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default InvoiceManagement;