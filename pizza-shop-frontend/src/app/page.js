'use client'

import Link from 'next/link'
import { Button, Container, Typography, Box } from '@mui/material'

export default function Home() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Pizza Shop Billing System
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Link href="/admin/items" passHref>
            <Button variant="contained" size="large" fullWidth>
              Manage Items
            </Button>
          </Link>
          <Link href="/admin/invoices" passHref>
            <Button variant="contained" size="large" fullWidth>
              Manage Invoices
            </Button>
          </Link>
        </Box>
      </Box>
    </Container>
  )
}