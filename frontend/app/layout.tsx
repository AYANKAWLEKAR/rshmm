import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CRUD App',
  description: 'A CRUD application with Next.js and FastAPI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
