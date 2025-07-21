import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Divider
} from '@mui/material';

const InvoicePrint = React.forwardRef(({ customerName, customerPhone, cart, subtotal }, ref) => {
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  const invoiceDate = new Date().toLocaleDateString();
  
  return (
    <Box ref={ref} sx={{ p: 3, width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Pizza Shop
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        123 Pizza Street, Foodville
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Phone: (123) 456-7890
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h6">Customer:</Typography>
          <Typography>{customerName}</Typography>
          <Typography>{customerPhone}</Typography>
        </Box>
        <Box>
          <Typography variant="h6">Invoice Date:</Typography>
          <Typography>{invoiceDate}</Typography>
        </Box>
      </Box>
      
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Item</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Qty</TableCell>
            <TableCell align="right">Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cart.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell align="right">${item.price.toFixed(2)}</TableCell>
              <TableCell align="right">{item.quantity}</TableCell>
              <TableCell align="right">${(item.price * item.quantity).toFixed(2)}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell rowSpan={3} />
            <TableCell colSpan={2}>Subtotal</TableCell>
            <TableCell align="right">${subtotal.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>Tax (10%)</TableCell>
            <TableCell align="right">${tax.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}><strong>Total</strong></TableCell>
            <TableCell align="right"><strong>${total.toFixed(2)}</strong></TableCell>
          </TableRow>
        </TableBody>
      </Table>
      
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2">Thank you for your order!</Typography>
        <Typography variant="body2">Please visit us again</Typography>
      </Box>
    </Box>
  );
});

InvoicePrint.displayName = 'InvoicePrint';

export default InvoicePrint;