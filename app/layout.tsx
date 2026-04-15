import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Sidebar } from '@/components/layout/Sidebar'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Trade Hub',
  description: 'Personal trading dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Sidebar />
        <main className="main-content" style={{ padding: '1.5rem', minHeight: '100vh' }}>
          {children}
        </main>
      </body>
    </html>
  )
}
