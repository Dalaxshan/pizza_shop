import './globals.css'

export const metadata = {
  title: 'Pizza Shop Billing System',
  description: 'Manage your pizza shop orders and inventory',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}